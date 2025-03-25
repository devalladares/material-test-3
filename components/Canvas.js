import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { 
  getCoordinates, 
  drawBezierCurve, 
  drawBezierGuides, 
  createAnchorPoint,
  isNearHandle,
  updateHandle
} from './utils/canvasUtils';
import { PencilLine, Upload, ImagePlus, LoaderCircle } from 'lucide-react';
import ToolBar from './ToolBar';
import StyleSelector from './StyleSelector';

const Canvas = forwardRef(({
  canvasRef,
  currentTool,
  isDrawing,
  startDrawing,
  draw,
  stopDrawing,
  handleCanvasClick,
  handlePenClick,
  handleGeneration,
  tempPoints,
  setTempPoints,
  handleUndo,
  clearCanvas,
  setCurrentTool,
  currentDimension,
  onImageUpload,
  onGenerate,
  isGenerating,
  setIsGenerating,
  currentColor,
  currentWidth,
  handleStrokeWidth,
  saveCanvasState,
  onDrawingChange,
  styleMode,
  setStyleMode,
}, ref) => {
  const [showBezierGuides, setShowBezierGuides] = useState(true);
  const [activePoint, setActivePoint] = useState(-1);
  const [activeHandle, setActiveHandle] = useState(null);
  const [symmetric, setSymmetric] = useState(true);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [hasDrawing, setHasDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const fileInputRef = useRef(null);
  const [shapeStartPos, setShapeStartPos] = useState(null);
  const [previewCanvas, setPreviewCanvas] = useState(null);
  const [isDoodleConverting, setIsDoodleConverting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [draggingImage, setDraggingImage] = useState(null);
  const [resizingImage, setResizingImage] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Add touch event prevention function
  useEffect(() => {
    // Function to prevent default touch behavior on canvas
    const preventTouchDefault = (e) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    // Add event listener when component mounts
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', preventTouchDefault, { passive: false });
      canvas.addEventListener('touchmove', preventTouchDefault, { passive: false });
    }

    // Remove event listener when component unmounts
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', preventTouchDefault);
        canvas.removeEventListener('touchmove', preventTouchDefault);
      }
    };
  }, [isDrawing, canvasRef]);

  // Add debugging info to console
  useEffect(() => {
    console.log('Canvas tool changed or isDrawing changed:', { currentTool, isDrawing });
  }, [currentTool, isDrawing]);

  // Add effect to rerender when uploadedImages change
  useEffect(() => {
    if (uploadedImages.length > 0) {
      renderCanvas();
    }
  }, [uploadedImages]);

  // Redraw bezier guides and control points when tempPoints change
  useEffect(() => {
    if (currentTool === 'pen' && tempPoints.length > 0 && showBezierGuides) {
      redrawBezierGuides();
    }
  }, [tempPoints, showBezierGuides, currentTool]);

  // Add useEffect to check if canvas has content
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Check if canvas has any non-white pixels (i.e., has a drawing)
    const hasNonWhitePixels = Array.from(imageData.data).some((pixel, index) => {
      // Check only RGB values (skip alpha)
      return index % 4 !== 3 && pixel !== 255;
    });
    
    setHasDrawing(hasNonWhitePixels);
  }, [canvasRef]);

  const handleKeyDown = (e) => {
    // Add keyboard accessibility
    if (e.key === 'Enter' || e.key === ' ') {
      handleCanvasClick(e);
    }
    
    // Toggle symmetric handles with Shift key
    if (e.key === 'Shift') {
      setSymmetric(!symmetric);
    }
  };

  // Draw bezier control points and guide lines
  const redrawBezierGuides = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get the canvas context
    const ctx = canvas.getContext('2d');
    
    // Save the current canvas state to redraw later
    const canvasImage = new Image();
    canvasImage.src = canvas.toDataURL();
    
    canvasImage.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw the canvas content
      ctx.drawImage(canvasImage, 0, 0);
      
      // Draw the control points and guide lines
      drawBezierGuides(ctx, tempPoints);
    };
  };

  // Function to draw a star shape
  const drawStar = (ctx, x, y, radius, points = 5) => {
    ctx.beginPath();
    for (let i = 0; i <= points * 2; i++) {
      const r = i % 2 === 0 ? radius : radius / 2;
      const angle = (i * Math.PI) / points;
      const xPos = x + r * Math.sin(angle);
      const yPos = y + r * Math.cos(angle);
      if (i === 0) ctx.moveTo(xPos, yPos);
      else ctx.lineTo(xPos, yPos);
    }
    ctx.closePath();
  };

  // Function to draw shapes
  const drawShape = (ctx, startPos, endPos, shape, isPreview = false) => {
    if (!startPos || !endPos) return;

    const width = endPos.x - startPos.x;
    const height = endPos.y - startPos.y;
    const radius = Math.sqrt(width * width + height * height) / 2;

    ctx.strokeStyle = currentColor || '#000000';
    ctx.fillStyle = currentColor || '#000000';
    ctx.lineWidth = currentWidth || 2;

    switch (shape) {
      case 'rect':
        if (isPreview) {
          ctx.strokeRect(startPos.x, startPos.y, width, height);
        } else {
          ctx.fillRect(startPos.x, startPos.y, width, height);
        }
        break;
      case 'circle':
        ctx.beginPath();
        ctx.ellipse(
          startPos.x + width / 2,
          startPos.y + height / 2,
          Math.abs(width / 2),
          Math.abs(height / 2),
          0,
          0,
          2 * Math.PI
        );
        if (isPreview) {
          ctx.stroke();
        } else {
          ctx.fill();
        }
        break;
      case 'line':
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = currentWidth * 2 || 4; // Make lines thicker
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.stroke();
        break;
      case 'star': {
        const centerX = startPos.x + width / 2;
        const centerY = startPos.y + height / 2;
        drawStar(ctx, centerX, centerY, radius);
        if (isPreview) {
          ctx.stroke();
        } else {
          ctx.fill();
        }
        break;
      }
    }
  };

  // Add this new renderCanvas function after handleFileChange
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Store current canvas state in a temporary canvas to preserve drawings
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);
    
    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw original content
    ctx.drawImage(tempCanvas, 0, 0);
    
    // Draw all uploaded images
    for (const img of uploadedImages) {
      const imageObj = new Image();
      imageObj.src = img.src;
      ctx.drawImage(imageObj, img.x, img.y, img.width, img.height);
      
      // Draw selection handles if dragging or resizing this image
      if (draggingImage === img.id || resizingImage === img.id) {
        // Draw border
        ctx.strokeStyle = '#0080ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(img.x, img.y, img.width, img.height);
        
        // Draw corner resize handles
        ctx.fillStyle = '#0080ff';
        const handleSize = 8;
        
        // Top-left
        ctx.fillRect(img.x - handleSize/2, img.y - handleSize/2, handleSize, handleSize);
        // Top-right
        ctx.fillRect(img.x + img.width - handleSize/2, img.y - handleSize/2, handleSize, handleSize);
        // Bottom-left
        ctx.fillRect(img.x - handleSize/2, img.y + img.height - handleSize/2, handleSize, handleSize);
        // Bottom-right
        ctx.fillRect(img.x + img.width - handleSize/2, img.y + img.height - handleSize/2, handleSize, handleSize);
      }
    }
  }, [canvasRef, uploadedImages, draggingImage, resizingImage]);
  
  // Handle mouse down for image interaction
  const handleImageMouseDown = (e) => {
    if (currentTool !== 'selection') return false;
    
    const { x, y } = getCoordinates(e, canvasRef.current);
    const handleSize = 8;
    
    // Check if clicked on any image handle first (for resizing)
    for (let i = uploadedImages.length - 1; i >= 0; i--) {
      const img = uploadedImages[i];
      
      // Check if clicked on bottom-right resize handle
      if (
        x >= img.x + img.width - handleSize/2 - 5 &&
        x <= img.x + img.width + handleSize/2 + 5 &&
        y >= img.y + img.height - handleSize/2 - 5 &&
        y <= img.y + img.height + handleSize/2 + 5
      ) {
        setResizingImage(img.id);
        setDragOffset({ x: x - (img.x + img.width), y: y - (img.y + img.height) });
        return true;
      }
    }
    
    // If not resizing, check if clicked on any image (for dragging)
    for (let i = uploadedImages.length - 1; i >= 0; i--) {
      const img = uploadedImages[i];
      if (
        x >= img.x && 
        x <= img.x + img.width && 
        y >= img.y && 
        y <= img.y + img.height
      ) {
        setDraggingImage(img.id);
        setDragOffset({ x: x - img.x, y: y - img.y });
        return true;
      }
    }
    
    return false;
  };
  
  // Handle mouse move for image interaction
  const handleImageMouseMove = (e) => {
    if (!draggingImage && !resizingImage) return false;
    
    const { x, y } = getCoordinates(e, canvasRef.current);
    
    if (draggingImage) {
      // Update position of dragged image
      setUploadedImages(prev => prev.map(img => {
        if (img.id === draggingImage) {
          return {
            ...img,
            x: x - dragOffset.x,
            y: y - dragOffset.y
          };
        }
        return img;
      }));
      
      renderCanvas();
      return true;
    }
    
    if (resizingImage) {
      // Update size of resized image
      setUploadedImages(prev => prev.map(img => {
        if (img.id === resizingImage) {
          // Calculate new width and height
          const newWidth = Math.max(20, x - img.x - dragOffset.x + 10);
          const newHeight = Math.max(20, y - img.y - dragOffset.y + 10);
          
          // Option 1: Free resize
          return {
            ...img,
            width: newWidth,
            height: newHeight
          };
          
          // Option 2: Maintain aspect ratio (uncomment if needed)
          /*
          const aspectRatio = img.originalWidth / img.originalHeight;
          const newHeight = newWidth / aspectRatio;
          return {
            ...img,
            width: newWidth,
            height: newHeight
          };
          */
        }
        return img;
      }));
      
      renderCanvas();
      return true;
    }
    
    return false;
  };
  
  // Handle mouse up for image interaction
  const handleImageMouseUp = () => {
    if (draggingImage || resizingImage) {
      setDraggingImage(null);
      setResizingImage(null);
      saveCanvasState();
      return true;
    }
    return false;
  };

  // Function to delete the selected image
  const deleteSelectedImage = useCallback(() => {
    if (draggingImage) {
      setUploadedImages(prev => prev.filter(img => img.id !== draggingImage));
      setDraggingImage(null);
      renderCanvas();
      saveCanvasState();
    }
  }, [draggingImage, renderCanvas, saveCanvasState]);

  // Modify existing startDrawing to check for image interaction first
  const handleStartDrawing = (e) => {
    console.log('Canvas onMouseDown', { currentTool, isDrawing });
    
    // Check if we're interacting with an image first
    if (handleImageMouseDown(e)) {
      return;
    }
    
    if (currentTool === 'pen') {
      if (!checkForPointOrHandle(e)) {
        handlePenToolClick(e);
      }
      return;
    }
    
    const { x, y } = getCoordinates(e, canvasRef.current);
    
    if (['rect', 'circle', 'line', 'star'].includes(currentTool)) {
      setShapeStartPos({ x, y });
      
      // Create preview canvas if it doesn't exist
      if (!previewCanvas) {
        const canvas = document.createElement('canvas');
        canvas.width = canvasRef.current.width;
        canvas.height = canvasRef.current.height;
        setPreviewCanvas(canvas);
      }
    }
    
    startDrawing(e);
    setHasDrawing(true);
  };

  // Modify existing draw to handle image interaction
  const handleDraw = (e) => {
    // Handle image dragging/resizing first
    if (handleImageMouseMove(e)) {
      return;
    }
    
    if (currentTool === 'pen' && handleBezierMouseMove(e)) {
      return;
    }

    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const { x, y } = getCoordinates(e, canvas);
    
    draw(e);
  };

  // Modify existing stopDrawing to handle image interaction
  const handleStopDrawing = (e) => {
    // Handle image release first
    if (handleImageMouseUp()) {
      return;
    }
    
    console.log('handleStopDrawing called', { 
      eventType: e?.type, 
      currentTool, 
      isDrawing, 
      activePoint, 
      activeHandle
    });
    
    // If we're using the pen tool with active point or handle
    if (currentTool === 'pen') {
      // If we were dragging a handle, just release it
      if (activeHandle) {
        setActiveHandle(null);
        return;
      }
      
      // If we were dragging an anchor point, just release it
      if (activePoint !== -1) {
        setActivePoint(-1);
        return;
      }
    }

    stopDrawing(e);

    // If using the pencil tool and we've just finished a drag, trigger generation
    if (currentTool === 'pencil' && isDrawing && !isGenerating) {
      console.log(`${currentTool} tool condition met, will try to trigger generation`);
      
      // Set generating flag to prevent multiple calls
      if (typeof setIsGenerating === 'function') {
        setIsGenerating(true);
      }
      
      // Generate immediately - no timeout needed
      console.log('Calling handleGeneration function');
      if (typeof handleGeneration === 'function') {
        handleGeneration();
      } else {
        console.error('handleGeneration is not a function:', handleGeneration);
      }
    } else {
      console.log('Generation not triggered because:', { 
        isPencilTool: currentTool === 'pencil',
        wasDrawing: isDrawing,
        isGenerating
      });
    }
  };

  // Handle keyboard events for image deletion
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && draggingImage) {
        deleteSelectedImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [draggingImage, deleteSelectedImage]);

  // Check if we clicked on an existing point or handle
  const checkForPointOrHandle = (e) => {
    if (currentTool !== 'pen' || !showBezierGuides || tempPoints.length === 0) {
      return false;
    }
    
    const canvas = canvasRef.current;
    const { x, y } = getCoordinates(e, canvas);
    setLastMousePos({ x, y });
    
    // Check if we clicked on a handle
    for (let i = 0; i < tempPoints.length; i++) {
      const point = tempPoints[i];
      
      // Check for handleIn
      if (isNearHandle(point, 'handleIn', x, y)) {
        setActivePoint(i);
        setActiveHandle('handleIn');
        return true;
      }
      
      // Check for handleOut
      if (isNearHandle(point, 'handleOut', x, y)) {
        setActivePoint(i);
        setActiveHandle('handleOut');
        return true;
      }
      
      // Check for the anchor point itself
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (distance <= 10) {
        setActivePoint(i);
        setActiveHandle(null);
        return true;
      }
    }
    
    return false;
  };
  
  // Handle mouse move for bezier control point or handle dragging
  const handleBezierMouseMove = (e) => {
    if (currentTool !== 'pen') {
      return false;
    }
    
    const canvas = canvasRef.current;
    const { x, y } = getCoordinates(e, canvas);
    const dx = x - lastMousePos.x;
    const dy = y - lastMousePos.y;
    
    // If we're dragging a handle
    if (activePoint !== -1 && activeHandle) {
      const newPoints = [...tempPoints];
      updateHandle(newPoints[activePoint], activeHandle, dx, dy, symmetric);
      setTempPoints(newPoints);
      setLastMousePos({ x, y });
      return true;
    }
    
    // If we're dragging an anchor point
    if (activePoint !== -1) {
      const newPoints = [...tempPoints];
      newPoints[activePoint].x += dx;
      newPoints[activePoint].y += dy;
      
      // If this point has handles, move them with the point
      if (newPoints[activePoint].handleIn) {
        // No need to change the handle's offset, just move with the point
      }
      
      if (newPoints[activePoint].handleOut) {
        // No need to change the handle's offset, just move with the point
      }
      
      setTempPoints(newPoints);
      setLastMousePos({ x, y });
      return true;
    }
    
    return false;
  };

  // Handle clicks for bezier curve tool
  const handlePenToolClick = (e) => {
    const canvas = canvasRef.current;
    const { x, y } = getCoordinates(e, canvas);
    
    // Add a new point
    if (tempPoints.length === 0) {
      // First point has no handles initially
      const newPoint = { x, y, handleIn: null, handleOut: null };
      setTempPoints([newPoint]);
    } else {
      // Create a new point with handles relative to the last point
      const newPoint = createAnchorPoint(x, y, tempPoints[tempPoints.length - 1]);
      setTempPoints([...tempPoints, newPoint]);
    }
    
    // Always show guides when adding points
    setShowBezierGuides(true);
  };
  
  // Toggle bezier guide visibility
  const toggleBezierGuides = () => {
    setShowBezierGuides(!showBezierGuides);
    if (showBezierGuides) {
      redrawBezierGuides();
    }
  };

  // Draw the final bezier curve and clear control points
  const finalizeBezierCurve = () => {
    if (tempPoints.length < 2) {
      // Need at least 2 points for a path
      console.log('Need at least 2 control points to draw a path');
      return;
    }
    
    const canvas = canvasRef.current;
    
    // Draw the actual bezier curve
    drawBezierCurve(canvas, tempPoints);
    
    // Hide guides and reset control points
    setShowBezierGuides(false);
    setTempPoints([]);
    
    // Trigger generation only if not already generating
    if (!isGenerating) {
      // Set generating flag to prevent multiple calls
      if (typeof setIsGenerating === 'function') {
        setIsGenerating(true);
      }
      
      if (typeof handleGeneration === 'function') {
        handleGeneration();
      }
    }
  };

  // Add control point to segment
  const addControlPoint = (e) => {
    if (currentTool !== 'pen' || tempPoints.length < 2) return;
    
    const canvas = canvasRef.current;
    const { x, y } = getCoordinates(e, canvas);
    
    // Find the closest segment to add a point to
    let closestDistance = Number.POSITIVE_INFINITY;
    let insertIndex = -1;
    
    for (let i = 0; i < tempPoints.length - 1; i++) {
      const p1 = tempPoints[i];
      const p2 = tempPoints[i + 1];
      
      // Calculate distance from click to line between points
      // This is a simplified distance calculation for demo purposes
      const lineLength = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
      if (lineLength === 0) continue;
      
      // Project point onto line
      const t = ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / (lineLength * lineLength);
      
      // If projection is outside the line segment, skip
      if (t < 0 || t > 1) continue;
      
      // Calculate closest point on line
      const closestX = p1.x + t * (p2.x - p1.x);
      const closestY = p1.y + t * (p2.y - p1.y);
      
      // Calculate distance to closest point
      const distance = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
      
      if (distance < closestDistance && distance < 20) {
        closestDistance = distance;
        insertIndex = i + 1;
      }
    }
    
    if (insertIndex > 0) {
      // Create a new array with the new point inserted
      const newPoints = [...tempPoints];
      const prevPoint = newPoints[insertIndex - 1];
      const nextPoint = newPoints[insertIndex];
      
      // Create a new point at the click position with automatically calculated handles
      const newPoint = { 
        x, 
        y,
        // Calculate handles based on the positions of adjacent points
        handleIn: { 
          x: (prevPoint.x - x) * 0.25, 
          y: (prevPoint.y - y) * 0.25 
        },
        handleOut: { 
          x: (nextPoint.x - x) * 0.25, 
          y: (nextPoint.y - y) * 0.25 
        }
      };
      
      // Insert the new point
      newPoints.splice(insertIndex, 0, newPoint);
      setTempPoints(newPoints);
    }
  };

  // Add function to handle image upload
  const handleImageUpload = async (imageDataUrl) => {
    console.log("handleImageUpload called with image data");
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas ref is null");
      return;
    }

    // Set hasDrawing to true immediately
    setHasDrawing(true);
    if (typeof onDrawingChange === 'function') {
      onDrawingChange(true);
    }

    // First, let's convert to doodle
    try {
      console.log("Setting loading state...");
      setIsDoodleConverting(true);

      console.log("Making API call to convert to doodle...");
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "can you convert this into a detailed black and white doodle <3\ndo not add or change this! follow it. just see that a black line was drawing this on a white background :)\nPlease add as much detail as you can. Include texture details, shading elements, and fine features from the original.",
          drawingData: imageDataUrl.split(",")[1], // Make sure we're only sending the base64 data
        }),
      });

      console.log("API response received");
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.success && data.imageData) {
        console.log("Valid image data received, creating image...");
        // Draw the doodle version to the canvas
        const img = new Image();
        img.onload = () => {
          console.log("Image loaded, drawing to canvas...");
          const ctx = canvas.getContext('2d');
          
          // Clear canvas
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Calculate dimensions
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          
          // Draw doodle
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          // Set hasDrawing to true since we now have content
          if (typeof onDrawingChange === 'function') {
            onDrawingChange(true);
          }
          
          // Save canvas state
          saveCanvasState();
          
          // Automatically trigger 3D generation after a short delay, but only if not already generating
          console.log("Setting timeout for automatic generation...");
          setTimeout(() => {
            console.log("Timeout expired, checking if we can call handleGeneration...");
            if (typeof handleGeneration === 'function' && !isGenerating) {
              console.log("Calling handleGeneration and setting isGenerating flag...");
              setIsGenerating(true);
              handleGeneration();
            } else {
              console.log("Skipping generation because isGenerating is already true or handleGeneration is not available");
            }
          }, 1000);
        };
        
        img.src = `data:image/png;base64,${data.imageData}`;
      } else {
        console.error("Invalid response data:", data);
      }
    } catch (error) {
      console.error('Error converting image to doodle:', error);
    } finally {
      console.log("Setting loading state to false");
      setIsDoodleConverting(false);
    }
  };

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    onGenerate(imageData);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear "Draw Here" message right away
    if (typeof onDrawingChange === 'function') {
      onDrawingChange(true);
    }
    // Also update local state immediately
    setHasDrawing(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      const img = new Image();
      
      img.onload = () => {
        // Calculate appropriate dimensions while maintaining aspect ratio
        const maxWidth = canvasRef.current.width * 0.6; // Max 60% of canvas width
        const maxHeight = canvasRef.current.height * 0.6; // Max 60% of canvas height
        
        const scale = Math.min(
          maxWidth / img.width,
          maxHeight / img.height
        );
        
        const width = img.width * scale;
        const height = img.height * scale;
        
        // Position in the center of the canvas
        const x = (canvasRef.current.width - width) / 2;
        const y = (canvasRef.current.height - height) / 2;
        
        // Add to uploaded images state
        const newImage = {
          id: Date.now(),
          src: imageUrl,
          x,
          y,
          width,
          height,
          originalWidth: img.width,
          originalHeight: img.height
        };
        
        setUploadedImages(prev => [...prev, newImage]);
        
        // Render the image to the canvas
        renderCanvas();
        
        // Save canvas state
        saveCanvasState();
      };
      
      img.src = imageUrl;
    };
    
    reader.readAsDataURL(file);
  };

  // Add custom clearCanvas implementation
  const handleClearCanvas = () => {
    // Clear the canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Re-render all images
    renderCanvas();
    
    // Save the new state
    saveCanvasState();
    
    // Call the original clearCanvas function but only for other side effects
    // like clearing the generated image
    clearCanvas();
  };

  useImperativeHandle(ref, () => ({
    handleClearCanvas
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Canvas container with fixed aspect ratio */}
      <div className="relative w-full" style={{ aspectRatio: `${currentDimension.width} / ${currentDimension.height}` }}>
        <canvas
          ref={canvasRef}
          width={currentDimension.width}
          height={currentDimension.height}
          className="absolute inset-0 w-full h-full border border-gray-300 bg-white rounded-xl shadow-soft"
          style={{
            touchAction: 'none'
          }}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDraw}
          onMouseUp={handleStopDrawing}
          onMouseLeave={handleStopDrawing}
          onTouchStart={handleStartDrawing}
          onTouchMove={handleDraw}
          onTouchEnd={handleStopDrawing}
          onClick={handleCanvasClick}
          onKeyDown={handleKeyDown}
          tabIndex="0"
          aria-label="Drawing canvas"
        />
        
        {/* Floating upload button */}
        <button 
          type="button"
          onClick={handleUploadClick}
          className="absolute bottom-4 right-4 z-10 bg-white border border-gray-200 text-gray-700 rounded-lg p-3 flex items-center justify-center shadow-soft hover:bg-gray-100 transition-colors"
          aria-label="Upload image"
          title="Upload image"
        >
          <ImagePlus className="w-5 h-5" />
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </button>
        
        {/* Doodle conversion loading overlay */}
        {isDoodleConverting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-xl z-50">
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <LoaderCircle className="w-12 h-12 text-gray-700 animate-spin mb-4" />
              <p className="text-gray-900 font-medium text-lg">Converting to doodle...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
            </div>
          </div>
        )}
        
        {/* Draw here placeholder */}
        {!hasDrawing && !isDoodleConverting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <PencilLine className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-400 text-lg font-medium">Draw here</p>
          </div>
        )}
      </div>

      {/* Style selector - positioned below canvas */}
      <div className="w-full">
        <StyleSelector 
          styleMode={styleMode}
          setStyleMode={setStyleMode}
          handleGenerate={handleGeneration}
        />
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas; 