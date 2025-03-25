import { Pencil, Eraser, Type, Undo, Trash2, PenLine, MousePointer } from 'lucide-react';
import { PenTool } from 'lucide-react';
import { Undo2 } from 'lucide-react';
import { useState } from 'react';

const ToolBar = ({ 
  currentTool, 
  setCurrentTool, 
  handleUndo, 
  clearCanvas, 
  orientation = 'horizontal',
  currentWidth,
  setStrokeWidth
}) => {
  const mainTools = [
    { id: 'selection', icon: MousePointer, label: 'Selection' },
    { id: 'pencil', icon: Pencil, label: 'Pencil' },
    // { id: 'pen', icon: PenTool, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    // { id: 'text', icon: Type, label: 'Text' }
  ];

  const actions = [
    { id: 'undo', icon: Undo2, label: 'Undo', onClick: handleUndo },
    { id: 'clear', icon: Trash2, label: 'Clear', onClick: clearCanvas }
  ];

  const containerClasses = orientation === 'vertical' 
    ? 'flex flex-col gap-2 bg-white rounded-xl shadow-soft p-2 border border-gray-200'
    : 'flex gap-2 bg-white rounded-xl shadow-soft p-2 border border-gray-200';

  return (
    <div className={containerClasses}>
      {mainTools.map((tool) => (
        <div key={tool.id} className="relative">
          <button
            onClick={() => setCurrentTool(tool.id)}
            className={`p-2 rounded-lg transition-colors ${
              currentTool === tool.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        </div>
      ))}
      
      {orientation === 'vertical' && <div className="h-px bg-gray-200 my-2" />}
      {orientation === 'horizontal' && <div className="w-px bg-gray-200 mx-2" />}
      
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          title={action.label}
        >
          <action.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default ToolBar; 