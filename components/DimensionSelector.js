import { Square, RectangleVertical, RectangleHorizontal, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const dimensions = [
  {
    id: 'landscape',
    label: '3:2',
    width: 1500,
    height: 1000,
    icon: RectangleHorizontal
  },
  {
    id: 'portrait',
    label: '4:5',
    width: 1000,
    height: 1250,
    icon: RectangleVertical
  },
  {
    id: 'square',
    label: '1:1',
    width: 1000,
    height: 1000,
    icon: Square
  }
];

const DimensionSelector = ({ currentDimension = dimensions[0], onDimensionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Replace click handlers with hover handlers
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div 
      className="relative z-50" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Current selection - removed ChevronDown */}
      <button
        className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full transition-all hover:bg-gray-50 hover:border-gray-300"
        style={{ opacity: isOpen ? 1 : 0.7 }}
      >
        {(() => {
          const current = dimensions.find(d => d.id === currentDimension.id) || dimensions[0];
          const Icon = current.icon;
          return (
            <>
              <Icon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{current.label}</span>
            </>
          );
        })()}
      </button>

      {/* Invisible wrapper to bridge the gap + Dropdown */}
      {isOpen && (
        <>
          <div className="absolute inset-x-0 h-2 -bottom-2" />
          <div className="absolute right-0 top-[calc(100%-1px)] bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            {dimensions.map((dim) => {
              const Icon = dim.icon;
              return (
                <button
                  key={dim.id}
                  onClick={() => onDimensionChange(dim)}
                  className={`w-full p-2 flex items-center gap-2 hover:bg-gray-50 transition-opacity ${
                    currentDimension.id === dim.id ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600 whitespace-nowrap">{dim.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DimensionSelector; 