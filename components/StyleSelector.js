import { useState, useRef, useEffect } from 'react';
import { RefreshCw, Plus, Upload, Edit, Trash2, RefreshCcw, HelpCircle, Sparkles } from 'lucide-react';

// Define default style options with display names and prompts
const defaultStyleOptions = {
  material: {
    name: "Chrome",
    file: "chrome.jpeg",
    prompt: "Recreate this doodle as a physical chrome sculpture made of a chromium metal tubes or pipes in a professional studio setting. If it is typography, render it accordingly, but always always have a black background and studio lighting. Render it in Cinema 4D with Octane, using studio lighting against a pure black background. Make it look like a high-end product rendering of a sculptural piece. Flat Black background always"
  },
  honey: {
    name: "Honey",
    file: "honey.jpeg",
    prompt: "Transform this sketch into a honey. Render it as if made entirely of translucent, golden honey with characteristic viscous drips and flows. Add realistic liquid properties including surface tension, reflections, and light refraction. Render it in Cinema 4D with Octane, using studio lighting against a pure black background. Flat Black background always"
  },
  softbody: {
    name: "Soft Body",
    file: "softbody.jpeg",
    prompt: "Convert this drawing / text into a soft body physics render. Render it as if made of a soft, jelly-like material that responds to gravity and motion. Add realistic deformation, bounce, and squash effects typical of soft body dynamics. Use dramatic lighting against a black background to emphasize the material's translucency and surface properties. Render it in Cinema 4D with Octane, using studio lighting against a pure black background. Make it look like a high-end 3D animation frame."
  },
  topographic: {
    name: "Topographic",
    file: "topographic.jpeg",
    prompt: "Transform this sketch into a sculptural form composed of precisely stacked, thin metallic rings or layers. Render it with warm copper/bronze tones with each layer maintaining equal spacing from adjacent layers, creating a topographic map effect. The form should appear to flow and undulate while maintaining the precise parallel structure. Use dramatic studio lighting against a pure black background to highlight the metallic luster and dimensional quality. Render it in a high-end 3D visualization style with perfect definition between each ring layer."
  },
  testMaterial: {
    name: "Surprise Me!",
    file: "test-material.jpeg",
    prompt: "Transform this sketch into an experimental material with unique and unexpected properties. Each generation should be different and surprising - it could be crystalline, liquid, gaseous, organic, metallic, or something completely unexpected. Use dramatic studio lighting against a pure black background to showcase the material's unique characteristics. Render it in a high-end 3D style with professional lighting and composition, emphasizing the most interesting and unexpected qualities of the chosen material."
  }
};

// Create a mutable copy that will include user-added materials
export let styleOptions = { ...defaultStyleOptions };

// Define the base prompt template
const BASE_PROMPT = (materialName) => 
  `Transform this sketch into a ${materialName.toLowerCase()} material. Render it in a high-end 3D visualization style with professional studio lighting against a pure black background. Make it look like an elegant Cinema 4D and Octane rendering with detailed material properties and characteristics. The final result should be an elegant visualization with perfect studio lighting, crisp shadows, and high-end material definition.`;

const enhanceMaterialDetails = async (materialDescription) => {
  console.log("Enhancing material:", materialDescription);
  try {
    const response = await fetch("/api/enhance-material", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materialDescription })
    });
    
    const data = await response.json();
    console.log("Enhanced material data:", data);
    
    // If we have valid data, use it
    if (data.name && typeof data.details === 'string') {
      // Strictly combine base prompt with only the additional details
      const finalPrompt = data.details.trim()
        ? `${BASE_PROMPT(data.name)}. ${data.details.trim()}`
        : BASE_PROMPT(data.name);
      
      return {
        name: data.name,
        prompt: finalPrompt
      };
    }
    
    // If data is invalid, throw error to trigger fallback
    throw new Error('Invalid enhancement data received');
  } catch (error) {
    console.error("Error enhancing material details:", error);
    
    // Create a more sophisticated fallback that still provides value
    const capitalizedName = materialDescription
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    const fallbackPrompt = `${BASE_PROMPT(materialDescription)}. Emphasize the characteristic properties of ${materialDescription.toLowerCase()} with accurate surface texturing and physical behavior.`;
    
    return {
      name: `${capitalizedName} Material`,
      prompt: fallbackPrompt
    };
  }
};

// Function to get prompt based on style mode
export const getPromptForStyle = (styleMode) => {
  if (!styleMode || !styleOptions[styleMode]) {
    return styleOptions.material.prompt;
  }
  return styleOptions[styleMode].prompt || styleOptions.material.prompt;
};

// Replace with a simpler generatePromptForMaterial function
export const generatePromptForMaterial = (materialName) => {
  return `Transform this sketch into a ${materialName.toLowerCase()} material. Render it in a high-end 3D visualization style with professional studio lighting against a pure black background. Make it look like a elegant Cinema 4D and octane rendering with detailed material properties and characteristics.`;
};

const StyleSelector = ({ styleMode, setStyleMode, handleGenerate }) => {
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [customImagePreview, setCustomImagePreview] = useState('');
  const [customImageFile, setCustomImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [materials, setMaterials] = useState(defaultStyleOptions);
  const [generatedMaterialName, setGeneratedMaterialName] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [showMaterialNameEdit, setShowMaterialNameEdit] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load custom materials from local storage on component mount
  useEffect(() => {
    loadCustomMaterials();
  }, []);

  // Extract loadCustomMaterials into its own named function
  const loadCustomMaterials = () => {
    try {
      const savedMaterials = localStorage.getItem('customMaterials');
      if (savedMaterials) {
        const parsedMaterials = JSON.parse(savedMaterials);
        // Update both the styleOptions and the state
        const updatedMaterials = { ...defaultStyleOptions, ...parsedMaterials };
        styleOptions = updatedMaterials;
        setMaterials(updatedMaterials);
        console.log('Loaded custom materials from local storage');
      }
    } catch (error) {
      console.error('Error loading custom materials:', error);
    }
  };

  // Modify the useEffect that handles thumbnail and text generation
  useEffect(() => {
    const delayedGeneration = async () => {
      // Skip automatic generation if we're editing (recentlyAdded exists)
      if (!newMaterialName.trim() || recentlyAdded) return;
      
      // Set loading states
      if (!useCustomImage) {
        setIsGeneratingPreview(true);
      }
      setIsGeneratingText(true);
      
      try {
        // Use our enhanced material details function
        const enhanced = await enhanceMaterialDetails(newMaterialName);
        setGeneratedMaterialName(enhanced.name);
        setGeneratedPrompt(enhanced.prompt);
        
        // Generate thumbnail with the enhanced prompt
        if (!useCustomImage) {
          try {
            // Generate a thumbnail using the API with the enhanced prompt
            const response = await fetch("/api/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: enhanced.prompt,
              }),
            });
            
            const data = await response.json();
            
            if (data.success && data.imageData) {
              // Set the preview thumbnail
              setPreviewThumbnail(`data:image/jpeg;base64,${data.imageData}`);
            }
          } catch (error) {
            console.error("Error generating preview thumbnail:", error);
          }
        }
      } catch (error) {
        console.error('Error in material generation:', error);
        
        // Fall back to basic generation if enhanced fails
        setGeneratedMaterialName(`${newMaterialName} Material`);
        setGeneratedPrompt(generatePromptForMaterial(newMaterialName));
      } finally {
        setIsGeneratingPreview(false);
        setIsGeneratingText(false);
      }
    };
    
    // Delay generation to avoid too many API calls while typing
    const timeoutId = setTimeout(delayedGeneration, 1500);
    return () => clearTimeout(timeoutId);
  }, [newMaterialName, useCustomImage, recentlyAdded]);

  // Helper function to resize and compress image data
  const compressImage = (dataUrl, maxWidth = 200) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and export as JPEG with lower quality
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    });
  };

  // Function to debug storage usage
  const checkStorageUsage = () => {
    let totalSize = 0;
    let itemCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const size = (key.length + value.length) * 2; // Approximate size in bytes (UTF-16)
      totalSize += size;
      itemCount++;
      console.log(`Item: ${key}, Size: ${(size / 1024).toFixed(2)}KB`);
    }
    
    console.log(`Total localStorage usage: ${(totalSize / 1024 / 1024).toFixed(2)}MB, Items: ${itemCount}`);
    return totalSize;
  };

  const handleAddMaterial = () => {
    resetMaterialForm();
    setRecentlyAdded(null);
    setShowAddMaterialModal(true);
  };

  const handleCloseModal = () => {
    setShowAddMaterialModal(false);
    setNewMaterialName('');
    setUseCustomImage(false);
    setCustomImagePreview('');
    setCustomImageFile(null);
    setCustomPrompt('');
    setShowCustomPrompt(false);
    setPreviewThumbnail('');
  };

  // Handle clicking outside of the modal to close it
  const handleClickOutsideModal = (e) => {
    // If the clicked element is the backdrop (has the modalBackdrop class)
    if (e.target.classList.contains('modalBackdrop')) {
      handleCloseModal();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      // When the file is loaded, create a temporary image to extract a square crop
      const img = new Image();
      img.onload = () => {
        // Create a canvas element to crop the image to a square
        const canvas = document.createElement('canvas');
        // Determine the size of the square (min of width and height)
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        
        // Calculate the position to start drawing to center the crop
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        
        // Draw the cropped image to the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
        
        // Convert the canvas to a data URL
        const croppedImageDataUrl = canvas.toDataURL(file.type);
        setCustomImagePreview(croppedImageDataUrl);
        setCustomImageFile(file);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleGenerateDefaultPrompt = () => {
    if (!newMaterialName.trim()) return;
    
    // Generate default prompt based on material name
    const defaultPrompt = generatePromptForMaterial(newMaterialName);
    setCustomPrompt(defaultPrompt);
    
    // Clear the preview so it will regenerate with the new prompt
    setPreviewThumbnail('');
  };

  // Add a helper function to read file as data URL
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Option 1: Add function to compress images more aggressively before storage
  const compressImageForStorage = async (dataUrl) => {
    // Use a smaller max width for storage
    const maxWidth = 100; // Reduce from 200 to 100
    const quality = 0.5; // Reduce quality from 0.7 to 0.5
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  };

  // Option 2: Add function to manage storage limits
  const manageStorageLimit = async (newMaterial) => {
    try {
      // Get current materials
      const savedMaterials = localStorage.getItem('customMaterials');
      if (!savedMaterials) return;
      
      const parsedMaterials = JSON.parse(savedMaterials);
      const customKeys = Object.keys(parsedMaterials).filter(key => 
        !Object.keys(defaultStyleOptions).includes(key));
      
      // If we have too many custom materials, remove the oldest ones
      if (customKeys.length > 4) { // Limit to 5 custom materials
        // Sort by creation time (if you have that data) or just take the first ones
        const keysToRemove = customKeys.slice(0, customKeys.length - 4);
        
        keysToRemove.forEach(key => {
          delete parsedMaterials[key];
        });
        
        // Save the reduced set back to localStorage
        localStorage.setItem('customMaterials', JSON.stringify(parsedMaterials));
      }
    } catch (error) {
      console.error('Error managing storage limit:', error);
    }
  };

  // Add a function to reset the form fields
  const resetMaterialForm = () => {
    setNewMaterialName('');
    setGeneratedMaterialName('');
    setGeneratedPrompt('');
    setCustomPrompt('');
    setPreviewThumbnail('');
    setUseCustomImage(false);
    setCustomImagePreview('');
    setShowCustomPrompt(false);
  };

  // Update the openAddMaterialModal function to reset form on open
  const openAddMaterialModal = () => {
    resetMaterialForm();
    setRecentlyAdded(null);
    setShowAddMaterialModal(true);
  };

  // Modify handleEditMaterial to keep thumbnail when editing
  const handleEditMaterial = (materialId) => {
    const material = materials[materialId];
    if (!material) return;
    
    // Set form fields with existing data
    setNewMaterialName(material.originalDescription || ''); // Store original description if available
    setGeneratedMaterialName(material.name || '');
    
    // Set prompt with appropriate approach
    const materialPrompt = material.prompt || '';
    setGeneratedPrompt(materialPrompt);
    setCustomPrompt(materialPrompt);
    setShowCustomPrompt(false);
    
    // Set thumbnail without triggering regeneration
    if (material.thumbnail) {
      setPreviewThumbnail(material.thumbnail);
      setUseCustomImage(false);
    }
    
    setRecentlyAdded(materialId);
    setShowAddMaterialModal(true);
  };

  // Add a function to manually refresh the thumbnail
  const handleRefreshThumbnail = async (prompt) => {
    if (!newMaterialName.trim() || useCustomImage) return;
    
    setIsGeneratingPreview(true);
    
    try {
      // Use the current prompt (either custom or default)
      const promptToUse = showCustomPrompt && customPrompt.trim()
        ? customPrompt
        : generatePromptForMaterial(newMaterialName);
      
      // Generate a new thumbnail using the API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptToUse,
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.imageData) {
        // Set the preview thumbnail
        setPreviewThumbnail(`data:image/jpeg;base64,${data.imageData}`);
      }
    } catch (error) {
      console.error("Error generating preview thumbnail:", error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // Add a function to manually refresh the text
  const handleRefreshText = async () => {
    if (!newMaterialName.trim()) return;
    
    setIsGeneratingText(true);
    
    try {
      // ... existing code for text generation ...
      // This can reuse the same code from the useEffect
    } catch (error) {
      console.error("Error generating material name and prompt:", error);
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleNewMaterialDescription = async (description) => {
    if (!description.trim()) return;
    
    setIsGeneratingText(true);
    try {
      const enhanced = await enhanceMaterialDetails(description);
      setGeneratedMaterialName(enhanced.name);
      setGeneratedPrompt(enhanced.prompt);
      
      // Trigger thumbnail generation with the new prompt
      if (!useCustomImage) {
        handleRefreshThumbnail(enhanced.prompt);
      }
    } catch (error) {
      console.error("Error generating material:", error);
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleCreateMaterial = async () => {
    if (!newMaterialName.trim()) return;
    
    // Generate a unique ID for the material
    const materialId = recentlyAdded || `custom_${Date.now()}`;
    
    // Use the generated material name instead of the description
    const displayName = generatedMaterialName || `${newMaterialName} Material`;
    
    // Use the generated or custom prompt
    const materialPrompt = showCustomPrompt ? customPrompt : (generatedPrompt || generatePromptForMaterial(newMaterialName));
    
    // Create the new material object
    const newMaterial = {
      name: displayName,
      prompt: materialPrompt,
      thumbnail: useCustomImage ? customImagePreview : previewThumbnail,
      originalDescription: newMaterialName, // Store the original description for editing
      isCustom: true
    };
    
    // Update both our state and storage references
    const updatedMaterials = { ...materials, [materialId]: newMaterial };
    
    // Apply more aggressive compression before storing
    if (useCustomImage && customImagePreview) {
      newMaterial.thumbnail = await compressImageForStorage(customImagePreview);
    } else if (previewThumbnail) {
      newMaterial.thumbnail = await compressImageForStorage(previewThumbnail);
    }
    
    // Before trying to save, manage storage limit
    await manageStorageLimit(newMaterial);
    
    try {
      // Save to localStorage
      localStorage.setItem('customMaterials', JSON.stringify(updatedMaterials));
      
      // Update state and global reference
      styleOptions = updatedMaterials;
      setMaterials(updatedMaterials);
      
      // Set as recently added for highlight effect
      setRecentlyAdded(materialId);
      
      // Switch to the new material mode
      setStyleMode(materialId);
      
      // Close the modal
      setShowAddMaterialModal(false);
      
      // Reset form
      resetMaterialForm();
      
      console.log("Material created successfully:", materialId);
    } catch (error) {
      // If we still hit quota errors, implement fallback
      console.error('Storage error:', error);
      
      // Fallback: Store only the most recent materials
      const reducedMaterials = {};
      
      // Keep just the new material and the default ones
      reducedMaterials[materialId] = newMaterial;
      
      // Try to save just this one
      try {
        localStorage.setItem('customMaterials', JSON.stringify(reducedMaterials));
        styleOptions = {...defaultStyleOptions, ...reducedMaterials};
        setMaterials(styleOptions);
      } catch (secondError) {
        // If even that fails, alert the user
        alert("Couldn't save your material due to storage limitations. Try clearing some browser data.");
      }
    }
  };

  const handleDeleteMaterial = (event, key) => {
    event.stopPropagation(); // Prevent triggering the parent button's onClick
    
    // Only allow deleting custom materials
    if (styleOptions[key]?.isCustom) {
      if (window.confirm(`Are you sure you want to delete the "${styleOptions[key].name}" material?`)) {
        // If currently selected, switch to default material
        if (styleMode === key) {
          setStyleMode('material');
        }
        
        // Delete the material
        const { [key]: deleted, ...remaining } = styleOptions;
        const updatedMaterials = { ...defaultStyleOptions, ...remaining };
        styleOptions = updatedMaterials;
        setMaterials(updatedMaterials);
        
        // Save the updated materials
        const customMaterials = {};
        Object.entries(remaining).forEach(([k, v]) => {
          if (!defaultStyleOptions[k]) {
            customMaterials[k] = v;
          }
        });
        localStorage.setItem('customMaterials', JSON.stringify(customMaterials));
      }
    }
  };

  // Add a function to sort materials in the desired order
  const getSortedMaterials = (materials) => {
    // 1. Get original materials (excluding Test Material)
    const originalMaterials = Object.entries(defaultStyleOptions)
      .filter(([key]) => key !== 'testMaterial')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    // 2. Get custom/locally saved materials (excluding Test Material)
    const customMaterials = Object.entries(materials)
      .filter(([key]) => !defaultStyleOptions[key] && key !== 'testMaterial')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    // 3. Get Test Material
    const testMaterial = materials.testMaterial ? { testMaterial: materials.testMaterial } : {};

    // Combine in desired order
    return {
      ...originalMaterials,
      ...customMaterials,
      ...testMaterial
    };
  };

  // Fix the reference image upload function
  const handleReferenceImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear recentlyAdded to ensure we're not in edit mode
    setRecentlyAdded(null);
    
    // Set loading states
    setIsGeneratingText(true);
    setIsGeneratingPreview(true);
    
    try {
      // Process the image for preview
      const reader = new FileReader();
      reader.onloadend = async (event) => {
        const imageDataUrl = event.target.result;
        
        // Set UI state for image
        setCustomImagePreview(imageDataUrl);
        setUseCustomImage(true);
        
        // Call the analyze-image API
        try {
          const response = await fetch('/api/analyze-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageDataUrl }),
          });
          
          if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.prompt && data.suggestedName) {
            // Update the material information
            setGeneratedMaterialName(data.suggestedName);
            setNewMaterialName(data.suggestedName);
            setGeneratedPrompt(data.prompt);
            setCustomPrompt(data.prompt);
            setShowCustomPrompt(true);
          }
        } catch (error) {
          console.error('Error analyzing reference image:', error);
          // Set fallback values
          setGeneratedMaterialName('Reference Material');
          setNewMaterialName('Reference Material');
          setGeneratedPrompt('Transform this reference into a 3D rendering with dramatic lighting on a black background.');
          setCustomPrompt('Transform this reference into a 3D rendering with dramatic lighting on a black background.');
        } finally {
          setIsGeneratingText(false);
          setIsGeneratingPreview(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setIsGeneratingText(false);
      setIsGeneratingPreview(false);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[35vh] pr-2 ">
          {/* 1. Original + 2. Local + 3. Test Material */}
          {Object.entries(getSortedMaterials(materials)).map(([key, { name, file, imageData, thumbnail, isCustom }]) => (
            <button
              key={key}
              onClick={async () => {
                const isSameMaterial = styleMode === key;
                if (!isSameMaterial) {
                  setStyleMode(key);
                } else {
                  handleGenerate();
                }
              }}
              type="button"
              aria-label={`Select ${name} style`}
              aria-pressed={styleMode === key}
              className="focus:outline-none relative group"
            >
              <div className={`w-20 border ${
                key === 'testMaterial' 
                  ? styleMode === key ? 'border-blue-500' : 'border-gray-200 border-dashed'
                  : styleMode === key ? 'border-blue-500' : 'border-gray-200'
              } overflow-hidden rounded-xl ${
                styleMode === key 
                  ? 'bg-white' 
                  : 'bg-gray-50'
              }`}>
                {/* Image container - fixed to be square */}
                <div className="w-full relative" style={{ aspectRatio: '1/1' }}>
                  {key === 'testMaterial' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <HelpCircle className="w-8 h-8 text-gray-400" />
                    </div>
                  ) : (
                    <img 
                      src={imageData ? `data:image/jpeg;base64,${imageData}` : (file ? `/samples/${file}` : thumbnail || '')}
                      alt={`${name} style example`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Error loading thumbnail for ${name}`);
                        e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                      }}
                    />
                  )}
                  {/* Improved control buttons for materials */}
                  {isCustom && (
                    <div className="absolute inset-0">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditMaterial(key);
                          }}
                          className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity"
                          aria-label={`Edit ${name} material`}
                        >
                          <Edit className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteMaterial(e, key);
                          }}
                          className="absolute top-1 left-1 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity"
                          aria-label={`Delete ${name} material`}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Label below image */}
                <div className={`px-1 py-1 text-left text-xs font-medium border-t border-gray-200 ${
                  styleMode === key 
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-600'
                }`}>
                  <div className="truncate">
                    {name}
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {/* 4. Add Material Button - Always at the end */}
          <button
            onClick={handleAddMaterial}
            type="button"
            aria-label="Add new material"
            className="focus:outline-none"
          >
            <div className="w-20 border border-dashed border-gray-200 overflow-hidden rounded-xl bg-gray-50 flex flex-col">
              <div className="w-full relative" style={{ aspectRatio: '1/1' }}>
                <div className="flex items-center justify-center h-full">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <div className="px-1 py-1 text-left text-xs font-medium border-t border-gray-200 bg-white text-gray-600 w-full">
                <div className="truncate">
                  Add Material
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Add Material Modal - Updated with semi-transparent backdrop */}
      {showAddMaterialModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 modalBackdrop overflow-y-auto p-4"
          onClick={handleClickOutsideModal}
        >
          <div 
            className="bg-white p-6 rounded-xl shadow-medium max-w-lg w-full my-8"
            onClick={(e) => e.stopPropagation()}  // Prevent clicks inside from closing the modal
          >
            <div className="flex items-center justify-between mb-9">
              <h2 className="text-xl font-medium text-gray-800" style={{ fontFamily: "'Google Sans Text', sans-serif" }}>Add Material</h2>
            </div>

            {/* Material Description and Preview section - reorganized */}
            <div className="mb-12">
              {/* Description and Upload section - Manual inputs at top */}
              <div className="mb-12">
                {/* Material Description */}
                <div className="flex-1">
                  <label className="block text-black font-medium mb-1">Describe your material</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={newMaterialName}
                      onChange={(e) => setNewMaterialName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newMaterialName.trim()) {
                          e.preventDefault();
                          handleNewMaterialDescription(newMaterialName);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black pr-10"
                      placeholder="Eg. Bubbles, glass etc"
                    />
                    <div className="absolute right-2">
                      <Sparkles className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Upload reference section - Removed "Upload" text */}
                <div className="w-full mt-4">
                  <label className="block text-black font-medium mb-1">Or upload a reference image</label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ height: "100px" }}
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleReferenceImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Generated content section */}
              <div className="mt-12">
                {/* Material Name, Prompt, and Thumbnail in a consistent layout */}
                <div className="flex gap-3">
                  {/* Left column for Material Name and Prompt */}
                  <div className="flex-1 flex flex-col gap-3">
                    {/* Material Name field */}
                    <div className="relative">
                      {showMaterialNameEdit ? (
                        <input
                          type="text"
                          value={generatedMaterialName}
                          onChange={(e) => setGeneratedMaterialName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Material Name"
                        />
                      ) : (
                        <div className="group w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 relative">
                          {generatedMaterialName || (
                            <span className="text-gray-400 text-sm">Material Name</span>
                          )}
                          {!showMaterialNameEdit && (
                            <button
                              onClick={() => setShowMaterialNameEdit(true)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Edit material name"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </div>
                      )}
                      {isGeneratingText && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Prompt section */}
                    <div className="relative">
                      {showCustomPrompt ? (
                        <textarea
                          value={customPrompt || generatedPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-[100px] resize-none overflow-y-auto"
                          placeholder="Prompt"
                        />
                      ) : (
                        <div className="group w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 h-[100px] overflow-y-auto relative">
                          {generatedPrompt || (
                            <span className="text-gray-400 text-sm">Prompt</span>
                          )}
                          {!showCustomPrompt && (
                            <button
                              onClick={() => setShowCustomPrompt(true)}
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Edit prompt"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </div>
                      )}
                      {isGeneratingText && (
                        <div className="absolute right-3 top-3">
                          <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-32">
                    <div className="w-32 h-32 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative">
                      {(previewThumbnail || customImagePreview) ? (
                        <img 
                          src={useCustomImage ? customImagePreview : previewThumbnail} 
                          alt="Material preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <p className="text-gray-400 text-sm text-center px-4">
                            {isGeneratingPreview ? 'Generating...' : 'Preview'}
                          </p>
                        </div>
                      )}
                      {/* Refresh button */}
                      {(previewThumbnail || customImagePreview) && !isGeneratingPreview && !useCustomImage && (
                        <button
                          onClick={() => handleRefreshThumbnail(customPrompt)}
                          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                          title="Refresh thumbnail"
                        >
                          <RefreshCcw className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddMaterialModal(false)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMaterial}
                disabled={isGeneratingThumbnail || !newMaterialName.trim()}
                className="px-3 py-2 border border-blue-500 rounded-lg text-blue-500 hover:bg-blue-50 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                Create Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleSelector; 