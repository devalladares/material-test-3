import { Download, RefreshCw, History } from 'lucide-react';

const ActionBar = ({ handleSaveImage, handleRegenerate, onOpenHistory, hasGeneratedContent = false }) => {
  return (
    <div className="flex gap-2 bg-white rounded-xl shadow-soft p-2 border border-gray-200">
      <button
        type="button"
        onClick={handleRegenerate}
        disabled={!hasGeneratedContent}
        className={`p-2 rounded-lg transition-colors relative group ${
          hasGeneratedContent 
            ? 'text-gray-600 hover:bg-gray-50' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Regenerate"
      >
        <RefreshCw className="w-5 h-5" />
        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-gray-800 text-xs rounded border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Regenerate
        </span>
      </button>

      <div className="w-px bg-gray-200 mx-1" />
      
      <button
        type="button"
        onClick={onOpenHistory}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors relative group"
        aria-label="View History"
      >
        <History className="w-5 h-5" />
        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-gray-800 text-xs rounded border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          History
        </span>
      </button>

      <div className="w-px bg-gray-200 mx-1" />
      
      <button
        type="button"
        onClick={handleSaveImage}
        disabled={!hasGeneratedContent}
        className={`p-2 rounded-lg transition-colors relative group ${
          hasGeneratedContent 
            ? 'text-gray-600 hover:bg-gray-50' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Save Image"
      >
        <Download className="w-5 h-5" />
        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-gray-800 text-xs rounded border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Save
        </span>
      </button>
    </div>
  );
};

export default ActionBar; 