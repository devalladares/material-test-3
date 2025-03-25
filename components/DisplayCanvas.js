import { LoaderCircle, ImageIcon, Send, RotateCw, Maximize, Wand2, Sun, Plus, Palette, Image as ImageLucide } from 'lucide-react';
import { useEffect, useState } from 'react';
import ActionBar from './ActionBar';
import ImageRefiner from './ImageRefiner';

// Update REFINEMENT_SUGGESTIONS with cleaner labels and full prompts
const REFINEMENT_SUGGESTIONS = [
  { label: 'Rotate', prompt: 'Can you rotate this by ', icon: RotateCw },
  { label: 'Add light', prompt: 'Can you add a light from the ', icon: Sun },
  { label: 'Add object', prompt: 'Can you add a ', icon: Plus },
  { label: 'Background', prompt: 'Can you change the background to ', icon: ImageLucide },
  { label: 'Color', prompt: 'Can you make the color more ', icon: Palette },
  { label: 'Scale', prompt: 'Can you make this ', icon: Maximize },
  { label: 'Lighting', prompt: 'Can you make the lighting more ', icon: Sun },
  { label: 'Style', prompt: 'Can you make it look more ', icon: Wand2 },
  { label: 'Material', prompt: 'Can you change the material to ', icon: Wand2 },
  // Add more suggestions as needed...
];

const DisplayCanvas = ({ 
  displayCanvasRef, 
  isLoading,
  handleSaveImage,
  handleRegenerate,
  hasGeneratedContent = false,
  currentDimension,
  onOpenHistory,
  onRefineImage
}) => {
  // Use a local state that combines props with local state
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [inputValue, setInputValue] = useState('');
  
  // Update placeholder visibility when loading or content prop changes
  useEffect(() => {
    if (hasGeneratedContent) {
      setShowPlaceholder(false);
    } else if (isLoading) {
      setShowPlaceholder(true);
    }
  }, [isLoading, hasGeneratedContent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onRefineImage(inputValue);
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion) => {
    // Use the full prompt when clicking the suggestion
    setInputValue(suggestion.prompt);
    // Optional: Focus the input after clicking suggestion
    document.querySelector('input[name="refiner"]').focus();
  };

  return (
    <div className="flex flex-col">
      {/* Canvas container with fixed aspect ratio */}
      <div className="relative w-full" style={{ aspectRatio: `${currentDimension.width} / ${currentDimension.height}` }}>
        <canvas
          ref={displayCanvasRef}
          width={currentDimension.width}
          height={currentDimension.height}
          className="absolute inset-0 w-full h-full border border-gray-300 bg-white rounded-xl shadow-soft"
          aria-label="Generated image canvas"
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl">
            <div className="bg-white/90 rounded-full p-3 shadow-medium">
              <LoaderCircle className="w-8 h-8 animate-spin text-gray-700" />
            </div>
          </div>
        )}
        
        {/* Placeholder overlay */}
        {showPlaceholder && !isLoading && !hasGeneratedContent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <ImageIcon className="w-7 h-7 text-gray-400 mb-2" />
            <p className="text-gray-400 text-lg font-medium">Generation will appear here</p>
          </div>
        )}

        {/* Floating action bar - now properly contained within the canvas container */}
        <div className="absolute bottom-4 right-4 z-10">
          <ActionBar
            handleSaveImage={handleSaveImage}
            handleRegenerate={handleRegenerate}
            onOpenHistory={onOpenHistory}
          />
        </div>
      </div>

      {/* Refiner input - moved outside the canvas container */}
      {hasGeneratedContent && (
        <div className="mt-4 space-y-2">
          <form onSubmit={handleSubmit} className="flex">
            <div className="flex-1 flex items-center bg-white rounded-xl shadow-soft p-2 border border-gray-200">
              <input
                name="refiner"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type to refine the image..."
                disabled={isLoading}
                className="flex-1 px-2 bg-transparent border-none text-gray-600 placeholder-gray-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send refinement"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Refined suggestion chips */}
          <div className="flex flex-wrap gap-1.5">
            {REFINEMENT_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center gap-1.5 px-2 py-0.5 text-xs bg-white hover:bg-gray-50 rounded-full border border-gray-200 text-gray-400 opacity-60 hover:text-gray-600 hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <suggestion.icon className="w-3.5 h-3.5" />
                <span>{suggestion.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayCanvas; 