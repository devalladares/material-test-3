import { Download, RefreshCw, History } from 'lucide-react';

const ActionBar = ({ handleSaveImage, handleRegenerate, onOpenHistory }) => {
  return (
    <div className="flex gap-2 bg-white rounded-xl shadow-soft p-2 border border-gray-200">
      <button
        type="button"
        onClick={onOpenHistory}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        aria-label="View History"
      >
        <History className="w-5 h-5" />
      </button>

      <div className="w-px bg-gray-200 mx-1" />
      
      <button
        type="button"
        onClick={handleRegenerate}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        aria-label="Regenerate"
      >
        <RefreshCw className="w-5 h-5" />
      </button>

      <div className="w-px bg-gray-200 mx-1" />
      
      <button
        type="button"
        onClick={handleSaveImage}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        aria-label="Save Image"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ActionBar; 