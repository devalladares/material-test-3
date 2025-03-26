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

// Update SURPRISE_REFINEMENTS with more fun, bonkers prompts
const SURPRISE_REFINEMENTS = [
  // Open-ended prompts (higher probability)
  "Do something cool with this. I leave it up to you!",
  "Surprise me! Take this image somewhere unexpected.",
  "Transform this however you want. Be creative!",
  "Do something wild with this image. No limits!",
  "Make this image magical in your own way.",
  "Take creative freedom with this image. Surprise me!",
  "Show me what you can do with this. Go crazy!",
  "Transform this in a way I wouldn't expect.",
  "Have fun with this and do whatever inspires you.",
  "Go wild with this image! Show me something amazing.",
  "Put your own creative spin on this image.",
  "Reimagine this image however you want. Be bold!",
  "Do something unexpected with this. Totally up to you!",
  "Surprise me with your creativity. Anything goes!",
  "Make this extraordinary in whatever way you choose.",
  "Show off your creative abilities with this image!",
  "Take this in any direction that excites you!",
  "Transform this however your imagination guides you.",
  "Make this magical in your own unique way.",
  "Do something fun and unexpected with this!",
  "Surprise me! Show me your creativity.",
  "Make this more beautiful <3",
  "Put your artistic spin on this image!",
  "Let your imagination run wild with this!",
  "Take this image to a whole new level of awesome!",
  "Make this image extraordinary in your own way.",
  "Do something fantastic with this. Full creative freedom!",
  "Surprise me with a totally unexpected transformation!",
  "Go nuts with this! Show me something incredible!",
  "Add your own wild twist to this image!",
  "Make this image come alive however you want!",
  "Transform this in the most creative way possible!",
  "Go crazy with this. I want to be wowed :))",
  "Do whatever magical things you want with this image!",
  "Reinvent this image however inspires you!",
  
  // Specific wild ideas (lower probability)
  "Can you add this to outer space with aliens having a BBQ?",
  "Can you add a giraffe wearing a tuxedo to this?",
  "Can you make tiny vikings invade this image?",
  "Can you turn this into an ice cream sundae being eaten by robots?",
  "Can you make this float in a sea of rainbow soup?",
  "Can you add dancing pickles to this image?",
  "Can you make this the centerpiece of an alien museum?",
  "Can you add this to a cereal bowl being eaten by a giant?",
  "Can you make this the star of a bizarre music video?",
  "Can you add tiny dinosaurs having a tea party?",
  "Can you turn this into something from a fever dream?",
  "Can you make this the main character in a surreal fairytale?",
  "Can you put this in the middle of a candy landscape?",
  "Can you add this to a world where physics works backwards?",
  "Can you make this the prize in a cosmic game show?",
  "Can you add tiny people worshipping this as a deity?",
  "Can you put this in the paws of a giant cosmic cat?",
  "Can you make this wearing sunglasses and surfing?",
  "Can you add this to a world made entirely of cheese?",
  "Can you make this the centerpiece of a goblin birthday party?",
  "Can you transform this into a cloud creature floating in the sky?",
  "Can you add this to a world where everything is made of pasta?",
  "Can you turn this into a piñata at a monster celebration?",
  "Can you add this to outer space?",
  "Can you add this to a landscape made of breakfast foods?",
  "Can you make this the conductor of an orchestra of unusual animals?",
  "Can you turn this into a strange plant growing in an alien garden?",
  "Can you add this to a world inside a snow globe?",
  "Can you make this the secret ingredient in a witch's cauldron?",
  "Can you turn this into a superhero with an unusual power?",
  "Can you make this swimming in a sea of jelly beans?",
  "Can you add this to a planet where everything is upside down?",
  "Can you make this the treasure in a dragon's unusual collection?",
  "Can you transform this into a character in a bizarre cartoon?",
  "Can you add this to a world where shadows come to life?"
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

  const handleSurpriseMe = () => {
    // Get a random surprise prompt
    const randomPrompt = SURPRISE_REFINEMENTS[Math.floor(Math.random() * SURPRISE_REFINEMENTS.length)];
    // Set it directly as the input value
    setInputValue(randomPrompt);
    // Focus the input
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
      </div>

      {/* Action bar and refiner section */}
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        {/* Refiner input - only shown when there's generated content */}
        {hasGeneratedContent ? (
          <form onSubmit={handleSubmit} className="flex-1 min-w-0">
            <div className="flex items-center bg-white rounded-xl shadow-soft p-2 border border-gray-200">
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
        ) : (
          <div className="flex-1"></div> 
        )}
        
        {/* Action bar - always visible */}
        <ActionBar
          handleSaveImage={handleSaveImage}
          handleRegenerate={handleRegenerate}
          onOpenHistory={onOpenHistory}
          hasGeneratedContent={hasGeneratedContent}
        />
      </div>

      {/* Refined suggestion chips */}
      {hasGeneratedContent && (
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Surprise Me button with same styling as other buttons */}
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-white hover:bg-gray-50 rounded-full border border-gray-200 text-gray-400 opacity-60 hover:text-gray-600 hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <Wand2 className="w-4 h-4" />
            <span>Surprise Me</span>
          </button>

          {/* Regular suggestion buttons */}
          {REFINEMENT_SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-white hover:bg-gray-50 rounded-full border border-gray-200 text-gray-400 opacity-60 hover:text-gray-600 hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <suggestion.icon className="w-4 h-4" />
              <span>{suggestion.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayCanvas; 