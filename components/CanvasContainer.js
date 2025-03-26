import { useState, useRef, useEffect, useCallback } from "react";
import Canvas from "./Canvas";
import DisplayCanvas from "./DisplayCanvas";
import ToolBar from "./ToolBar";
import StyleSelector from "./StyleSelector";
import { getPromptForStyle } from "./StyleSelector";
import ActionBar from "./ActionBar";
import ErrorModal from "./ErrorModal";
import TextInput from "./TextInput";
import Header from "./Header";
import DimensionSelector from "./DimensionSelector";
import HistoryModal from "./HistoryModal";
import BottomToolBar from "./BottomToolBar";
import { getCoordinates, initializeCanvas, drawImageToCanvas, drawBezierCurve } from "./utils/canvasUtils";

const CanvasContainer = () => {
  const canvasRef = useRef(null);
  const canvasComponentRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const [currentDimension, setCurrentDimension] = useState({ 
    id: 'landscape', 
    label: '3:2',
    width: 1500, 
    height: 1000 
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(2);
  const colorInputRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  const [styleMode, setStyleMode] = useState('material');
  const [strokeCount, setStrokeCount] = useState(0);
  const strokeTimeoutRef = useRef(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const MIN_REQUEST_INTERVAL = 2000; // Minimum 2 seconds between requests
  const [currentTool, setCurrentTool] = useState('pencil'); // 'pencil', 'pen', 'eraser', 'text', 'rect', 'circle', 'line', 'star'
  const [isTyping, setIsTyping] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [bezierPoints, setBezierPoints] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const textInputRef = useRef(null);
  const [isPenDrawing, setIsPenDrawing] = useState(false);
  const [currentBezierPath, setCurrentBezierPath] = useState([]);
  const [tempPoints, setTempPoints] = useState([]);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [imageHistory, setImageHistory] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  // Add a ref to track style changes that need regeneration
  const needsRegenerationRef = useRef(false);

  // Load background image when generatedImage changes
  useEffect(() => {
    if (generatedImage && canvasRef.current) {
      // Use the window.Image constructor to avoid conflict with Next.js Image component
      const img = new window.Image();
      img.onload = () => {
        backgroundImageRef.current = img;
        drawImageToCanvas(canvasRef.current, backgroundImageRef.current);
      };
      img.src = generatedImage;
    }
  }, [generatedImage]);

  // Initialize canvas with white background when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current);
    }
    
    // Also initialize the display canvas
    if (displayCanvasRef.current) {
      const displayCtx = displayCanvasRef.current.getContext('2d');
      displayCtx.fillStyle = '#FFFFFF';
      displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
    }
  }, []);

  // Add an effect to sync canvas dimensions when they change
  useEffect(() => {
    if (canvasRef.current && displayCanvasRef.current) {
      // Ensure both canvases have the same dimensions
      canvasRef.current.width = currentDimension.width;
      canvasRef.current.height = currentDimension.height;
      displayCanvasRef.current.width = currentDimension.width;
      displayCanvasRef.current.height = currentDimension.height;
      
      // Initialize both canvases with white backgrounds
      initializeCanvas(canvasRef.current);
      
      const displayCtx = displayCanvasRef.current.getContext('2d');
      displayCtx.fillStyle = '#FFFFFF';
      displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
    }
  }, [currentDimension]);

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e, canvasRef.current);
    
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    
    console.log('startDrawing called', { currentTool, x, y });
    
    const ctx = canvasRef.current.getContext("2d");
    
    // Set up the line style at the start of drawing
    ctx.lineWidth = currentTool === 'eraser' ? 20 : penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : penColor;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setStrokeCount(prev => prev + 1);
    
    // Save canvas state before drawing
    saveCanvasState();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    
    // Occasionally log drawing activity
    if (Math.random() < 0.05) { // Only log ~5% of move events to avoid console spam
      console.log('draw called', { currentTool, isDrawing, x, y });
    }
    
    // Set up the line style before drawing
    ctx.lineWidth = currentTool === 'eraser' ? 60 : (penWidth * 4); // Pen width now 4x original size
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
    } else {
      ctx.strokeStyle = penColor;
    }
    
    if (currentTool === 'pen') {
      // Show preview line while moving
      if (tempPoints.length > 0) {
        const lastPoint = tempPoints[tempPoints.length - 1];
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = async (e) => {
    console.log('stopDrawing called in CanvasContainer', { 
      isDrawing, 
      currentTool, 
      hasEvent: !!e,
      eventType: e ? e.type : 'none'
    });
    
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Remove the timeout-based generation
    if (strokeTimeoutRef.current) {
      clearTimeout(strokeTimeoutRef.current);
      strokeTimeoutRef.current = null;
    }

    // The Canvas component will handle generation for pen and pencil tools directly
    // This function now primarily handles stroke counting for other tools
    
    // Only generate on mouse/touch up events when not using the pen or pencil tool
    // (since those are handled by the Canvas component)
    if (e && (e.type === 'mouseup' || e.type === 'touchend') && 
        currentTool !== 'pen' && currentTool !== 'pencil') {
      console.log('stopDrawing: detected mouseup/touchend event', { strokeCount });
      // Check if we have enough strokes to generate (increased to 10 from 3)
      if (strokeCount >= 10) {
        console.log('stopDrawing: calling handleGeneration due to stroke count');
        await handleGeneration();
        setStrokeCount(0);
      }
    }
  };

  const clearCanvas = () => {
    // If we have a ref to our Canvas component, use its custom clear method
    if (canvasComponentRef.current?.handleClearCanvas) {
      canvasComponentRef.current.handleClearCanvas();
      return;
    }
    
    // Fallback to original implementation
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    initializeCanvas(canvas);
    
    setGeneratedImage(null);
    backgroundImageRef.current = null;
    
    // Also clear the display canvas and reset generated content flag
    if (displayCanvasRef.current) {
      const displayCtx = displayCanvasRef.current.getContext('2d');
      displayCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
      displayCtx.fillStyle = '#FFFFFF';
      displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
      setHasGeneratedContent(false);
    }
    
    // Save empty canvas state
    saveCanvasState();
  };

  const handleGeneration = useCallback(async () => {
    console.log('handleGeneration called');
    
    // Remove the time throttling for automatic generation after doodle conversion
    // but keep it for manual generations
    const isAutoGeneration = !lastRequestTime;
    if (!isAutoGeneration) {
      const now = Date.now();
      if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        console.log("Request throttled - too soon after last request");
        return;
      }
      setLastRequestTime(now);
    }
    
    if (!canvasRef.current) return;
    
    console.log('Starting generation process');
    
    // Check if we're already in a loading state before setting it
    if (!isLoading) {
      setIsLoading(true);
    }
    
    try {
      const canvas = canvasRef.current;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);
      
      const drawingData = tempCanvas.toDataURL("image/png").split(",")[1];
      
      const materialPrompt = getPromptForStyle(styleMode);
      
      const requestPayload = {
        prompt: materialPrompt,
        drawingData,
        customApiKey
      };
      
      console.log('Making API request with style:', styleMode);
      console.log(`Using prompt: ${materialPrompt.substring(0, 100)}...`);
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });
      
      console.log('API response received, status:', response.status);
      
      const data = await response.json();
      
      if (data.success && data.imageData) {
        console.log('Image generated successfully');
        const imageUrl = `data:image/png;base64,${data.imageData}`;
        
        // Draw the generated image to the display canvas
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas) {
          console.error('Display canvas ref is null');
          return;
        }
        
        const displayCtx = displayCanvas.getContext('2d');
        
        // Clear the display canvas first
        displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
        displayCtx.fillStyle = '#FFFFFF';
        displayCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
        
        // Create and load the new image
        const img = new Image();
        
        // Set up the onload handler before setting the src
        img.onload = () => {
          console.log('Generated image loaded, drawing to display canvas');
          displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
          displayCtx.drawImage(img, 0, 0, displayCanvas.width, displayCanvas.height);
          console.log('Image drawn to display canvas');
          
          // Update our state to indicate we have generated content
          setHasGeneratedContent(true);

          // Add to history
          setImageHistory(prev => [...prev, {
            imageUrl,
            timestamp: Date.now(),
            drawingData: canvas.toDataURL(),
            styleMode,
            dimensions: currentDimension
          }]);
        };
        
        // Set the src to trigger loading
        img.src = imageUrl;
      } else {
        console.error("Failed to generate image:", data.error);
        
        // When generation fails, ensure display canvas is cleared
        if (displayCanvasRef.current) {
          const displayCtx = displayCanvasRef.current.getContext('2d');
          displayCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
          displayCtx.fillStyle = '#FFFFFF';
          displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
        }
        
        // Make sure we mark that we don't have generated content
        setHasGeneratedContent(false);
        
        if (data.error && (
          data.error.includes("Resource has been exhausted") || 
          data.error.includes("quota") ||
          response.status === 429 ||
          response.status === 500
        )) {
          setErrorMessage(data.error);
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setShowErrorModal(true);
      
      // When generation errors, ensure display canvas is cleared
      if (displayCanvasRef.current) {
        const displayCtx = displayCanvasRef.current.getContext('2d');
        displayCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
        displayCtx.fillStyle = '#FFFFFF';
        displayCtx.fillRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);
      }
      
      // Make sure we mark that we don't have generated content
      setHasGeneratedContent(false);
    } finally {
      setIsLoading(false);
      console.log('Generation process completed');
    }
  }, [canvasRef, isLoading, styleMode, customApiKey, lastRequestTime]);

  // Close the error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  // Handle the custom API key submission
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    setShowErrorModal(false);
    // Will use the customApiKey state in the next API call
  };

  // Add this function to handle undo
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const previousState = undoStack[undoStack.length - 2]; // Get second to last state
      
      if (previousState) {
        const img = new Image();
        img.onload = () => {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = previousState;
      } else {
        // If no previous state, clear to white
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  // Add this function to save canvas state
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    setUndoStack(prev => [...prev, dataURL]);
  };

  // Add this function to handle text input
  const handleTextInput = (e) => {
    if (e.key === 'Enter') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.font = '24px Arial';
      ctx.fillStyle = '#000000';
      ctx.fillText(textInput, textPosition.x, textPosition.y);
      setTextInput('');
      setIsTyping(false);
      saveCanvasState();
    }
  };

  // Modify the canvas click handler to handle text placement
  const handleCanvasClick = (e) => {
    if (currentTool === 'text') {
      const { x, y } = getCoordinates(e, canvasRef.current);
      setTextPosition({ x, y });
      setIsTyping(true);
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  };

  // Handle pen click for bezier curve tool
  const handlePenClick = (e) => {
    if (currentTool !== 'pen') return;
    
    // Note: Actual point creation is now handled in the Canvas component
    // This function is primarily used as a callback to inform the CanvasContainer
    // that a pen action happened
    
    console.log('handlePenClick called in CanvasContainer');
    
    // Set isDrawing flag to true when using pen tool
    // This ensures handleStopDrawing knows we're in drawing mode with the pen
    setIsDrawing(true);
    
    // Save canvas state when adding new points
    saveCanvasState();
  };

  // Add this new function near your other utility functions
  const handleSaveImage = () => {
    // For the generated image
    if (displayCanvasRef.current) {
      const link = document.createElement('a');
      link.download = 'chrome-study.png';
      link.href = displayCanvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  // Add this function to handle regeneration
  const handleRegenerate = async () => {
    if (canvasRef.current) {
      // Temporarily reset hasGeneratedContent so placeholder shows during loading
      setHasGeneratedContent(false);
      await handleGeneration();
    }
  };

  // Add useEffect to watch for styleMode changes and regenerate
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Only trigger if we have something drawn (check if canvas is not empty)
    // Note: handleGeneration is intentionally omitted from dependencies to prevent infinite loops
    const checkCanvasAndGenerate = async () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Check if canvas has any non-white pixels
      const hasDrawing = Array.from(imageData.data).some((pixel, index) => {
        // Check only RGB values (skip alpha)
        return index % 4 !== 3 && pixel !== 255;
      });

      // Only generate if there's a drawing AND we don't already have generated content
      if (hasDrawing && !hasGeneratedContent) {
        await handleGeneration();
      } else if (hasDrawing) {
        // Mark that regeneration is needed when style changes but we already have content
        needsRegenerationRef.current = true;
      }
    };

    // Skip on first render
    if (styleMode) {
      checkCanvasAndGenerate();
    }
  }, [styleMode, hasGeneratedContent]); // Removed handleGeneration from dependencies to prevent loop

  // Add new useEffect to handle regeneration when hasGeneratedContent changes to false
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Note: handleGeneration is intentionally omitted from dependencies to prevent infinite loops
    // If we need regeneration and the generated content was cleared
    if (needsRegenerationRef.current && !hasGeneratedContent) {
      const checkDrawingAndRegenerate = async () => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Check if canvas has any non-white pixels
        const hasDrawing = Array.from(imageData.data).some((pixel, index) => {
          // Check only RGB values (skip alpha)
          return index % 4 !== 3 && pixel !== 255;
        });

        if (hasDrawing) {
          needsRegenerationRef.current = false;
          await handleGeneration();
        }
      };
      
      checkDrawingAndRegenerate();
    }
  }, [hasGeneratedContent]);

  // Cleanup function - keep this to prevent memory leaks
  useEffect(() => {
    return () => {
      if (strokeTimeoutRef.current) {
        clearTimeout(strokeTimeoutRef.current);
        strokeTimeoutRef.current = null;
      }
    };
  }, []);

  // Handle dimension change
  const handleDimensionChange = (newDimension) => {
    console.log('Changing dimensions to:', newDimension);
    
    // Clear both canvases
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = newDimension.width;
      canvas.height = newDimension.height;
      initializeCanvas(canvas);
    }
    
    if (displayCanvasRef.current) {
      const displayCanvas = displayCanvasRef.current;
      displayCanvas.width = newDimension.width;
      displayCanvas.height = newDimension.height;
      const ctx = displayCanvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
    }
    
    // Reset generation state
    setHasGeneratedContent(false);
    setGeneratedImage(null);
    backgroundImageRef.current = null;
    
    // Update dimension state AFTER canvas dimensions are updated
    setCurrentDimension(newDimension);
  };

  // Add new function to handle selecting a historical image
  const handleSelectHistoricalImage = (historyItem) => {
    // Set the current dimension to match the historical image
    if (historyItem.dimensions) {
      setCurrentDimension(historyItem.dimensions);
    }

    // Draw the original drawing to the canvas
    const drawingImg = new Image();
    drawingImg.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(drawingImg, 0, 0, canvas.width, canvas.height);
      }
    };
    drawingImg.src = historyItem.drawingData;

    // Draw the generated image to the display canvas
    const generatedImg = new Image();
    generatedImg.onload = () => {
      const displayCanvas = displayCanvasRef.current;
      if (displayCanvas) {
        const ctx = displayCanvas.getContext('2d');
        ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
        ctx.drawImage(generatedImg, 0, 0, displayCanvas.width, displayCanvas.height);
        setHasGeneratedContent(true);
      }
    };
    generatedImg.src = historyItem.imageUrl;

    // Close the history modal
    setIsHistoryModalOpen(false);
  };

  // Add new function to handle image refinement
  const handleImageRefinement = async (refinementPrompt) => {
    if (!displayCanvasRef.current || !hasGeneratedContent) return;
    
    console.log('Starting image refinement with prompt:', refinementPrompt);
    setIsLoading(true);
    
    try {
      // Get the current image data
      const displayCanvas = displayCanvasRef.current;
      const imageData = displayCanvas.toDataURL("image/png").split(",")[1];
      
      const requestPayload = {
        prompt: refinementPrompt,
        imageData,
        customApiKey
      };
      
      console.log('Making refinement API request');
      
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });
      
      console.log('Refinement API response received, status:', response.status);
      
      const data = await response.json();
      
      if (data.success && data.imageData) {
        console.log('Image refined successfully');
        const imageUrl = `data:image/png;base64,${data.imageData}`;
        
        // Draw the refined image to the display canvas
        const displayCtx = displayCanvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          console.log('Refined image loaded, drawing to display canvas');
          displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
          displayCtx.drawImage(img, 0, 0, displayCanvas.width, displayCanvas.height);
          
          // Add to history
          setImageHistory(prev => [...prev, {
            imageUrl,
            timestamp: Date.now(),
            drawingData: canvasRef.current.toDataURL(),
            styleMode,
            dimensions: currentDimension
          }]);
        };
        
        img.src = imageUrl;
      } else {
        console.error("Failed to refine image:", data.error);
        setErrorMessage(data.error || "Failed to refine image. Please try again.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error during refinement:', error);
      setErrorMessage("An error occurred during refinement. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Add onImageUpload function
  const handleImageUpload = (imageDataUrl) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Clear the canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate dimensions to maintain aspect ratio and fit within canvas
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      // Draw the image centered and scaled
      ctx.drawImage(
        img,
        x, y,
        img.width * scale,
        img.height * scale
      );

      // Save canvas state after uploading image
      saveCanvasState();
      setHasGeneratedContent(true);
    };

    img.src = imageDataUrl;
  };

  // Add stroke width handler
  const handleStrokeWidth = (width) => {
    setPenWidth(width);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-2 md:p-4 overflow-y-auto">
      <div className="w-full max-w-[1800px] mx-auto pb-32">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex-shrink-0">
              <Header />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="hidden sm:block">
                <DimensionSelector 
                  currentDimension={currentDimension}
                  onDimensionChange={handleDimensionChange}
                />
              </div>
              <a 
                href="https://aistudio.google.com/prompts/new_chat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-full opacity-70 hover:opacity-100 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Using Gemini 2.0 Native Image Generation
              </a>
            </div>
          </div>
          
          {/* New single row layout */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 w-full">
            {/* Toolbar - fixed width on desktop, full width horizontal on mobile */}
            <div className="w-full md:w-[60px] md:flex-shrink-0">
              {/* Mobile toolbar (horizontal) */}
              <div className="block md:hidden w-fit">
                <ToolBar 
                  currentTool={currentTool}
                  setCurrentTool={setCurrentTool}
                  handleUndo={handleUndo}
                  clearCanvas={clearCanvas}
                  orientation="horizontal" 
                  currentWidth={penWidth}
                  setStrokeWidth={handleStrokeWidth}
                />
              </div>
              
              {/* Desktop toolbar (vertical) */}
              <div className="hidden md:block">
                <ToolBar 
                  currentTool={currentTool}
                  setCurrentTool={setCurrentTool}
                  handleUndo={handleUndo}
                  clearCanvas={clearCanvas}
                  orientation="vertical"
                  currentWidth={penWidth}
                  setStrokeWidth={handleStrokeWidth}
                />
              </div>
            </div>
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Canvas row */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Canvas */}
                <div className="flex-1 w-full relative">
                  <Canvas 
                    ref={canvasComponentRef}
                    canvasRef={canvasRef}
                    currentTool={currentTool}
                    isDrawing={isDrawing}
                    startDrawing={startDrawing}
                    draw={draw}
                    stopDrawing={stopDrawing}
                    handleCanvasClick={handleCanvasClick}
                    handlePenClick={handlePenClick}
                    handleGeneration={handleGeneration}
                    tempPoints={tempPoints}
                    setTempPoints={setTempPoints}
                    handleUndo={handleUndo}
                    clearCanvas={clearCanvas}
                    setCurrentTool={setCurrentTool}
                    currentDimension={currentDimension}
                    currentColor={penColor}
                    currentWidth={penWidth}
                    onImageUpload={handleImageUpload}
                    onGenerate={handleGeneration}
                    isGenerating={isLoading}
                    setIsGenerating={setIsLoading}
                    saveCanvasState={saveCanvasState}
                    onDrawingChange={setHasDrawing}
                    styleMode={styleMode}
                    setStyleMode={setStyleMode}
                  />
                </div>
                
                {/* Display Canvas */}
                <div className="flex-1 w-full">
                  <DisplayCanvas 
                    displayCanvasRef={displayCanvasRef}
                    isLoading={isLoading}
                    handleSaveImage={handleSaveImage}
                    handleRegenerate={handleRegenerate}
                    hasGeneratedContent={hasGeneratedContent}
                    currentDimension={currentDimension}
                    onOpenHistory={() => setIsHistoryModalOpen(true)}
                    onRefineImage={handleImageRefinement}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorModal 
        showErrorModal={showErrorModal}
        closeErrorModal={closeErrorModal}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
        handleApiKeySubmit={handleApiKeySubmit}
      />

      <TextInput 
        isTyping={isTyping}
        textInputRef={textInputRef}
        textInput={textInput}
        setTextInput={setTextInput}
        handleTextInput={handleTextInput}
        textPosition={textPosition}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={imageHistory}
        onSelectImage={handleSelectHistoricalImage}
        currentDimension={currentDimension}
      />
    </div>
  );
};

export default CanvasContainer; 