import { X } from 'lucide-react';

const HistoryModal = ({ 
  isOpen, 
  onClose, 
  history,
  onSelectImage,
  currentDimension
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-xl shadow-medium max-w-5xl w-full mx-auto my-8 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-800">Drawing History</h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No history available yet. Start drawing to create some!
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
            {history.map((item, index) => (
              <div 
                key={item.timestamp} 
                className="relative group cursor-pointer"
                onClick={() => onSelectImage(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectImage(item);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select drawing from ${new Date(item.timestamp).toLocaleString()}`}
              >
                <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={item.imageUrl} 
                    alt={`Drawing history ${index + 1}`}
                    className="object-cover w-full h-full group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal; 