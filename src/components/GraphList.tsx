
import React from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { GraphFunction } from './Calculator';

interface GraphListProps {
  functions: GraphFunction[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
}

const AVAILABLE_COLORS = [
  '#00ff00', '#ff0000', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ffa500', '#800080'
];

export const GraphList: React.FC<GraphListProps> = ({
  functions,
  onRemove,
  onToggle,
  onColorChange,
}) => {
  if (functions.length === 0) {
    return (
      <div 
        className="p-6 rounded-lg text-center"
        style={{ 
          backgroundColor: '#1A1A1A',
          color: '#6c757d'
        }}
      >
        No hay funciones agregadas
      </div>
    );
  }

  return (
    <div 
      className="p-6 rounded-lg"
      style={{ 
        backgroundColor: '#1A1A1A',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
      }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
        Funciones ({functions.length})
      </h2>
      
      <div className="space-y-3">
        {functions.map((func) => (
          <div 
            key={func.id}
            className="p-3 rounded border"
            style={{ 
              backgroundColor: func.visible ? 'rgba(26, 26, 26, 0.5)' : '#000',
              borderColor: '#dee2e6'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span 
                className="font-mono text-sm"
                style={{ color: func.visible ? '#FFFFFF' : '#6c757d' }}
              >
                f(x) = {func.expression}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggle(func.id)}
                  className="p-1 rounded transition-colors"
                  style={{ color: func.visible ? '#00ff00' : '#6c757d' }}
                >
                  {func.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => onRemove(func.id)}
                  className="p-1 rounded transition-colors"
                  style={{ color: '#dc3545' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#C6C6C6' }}>Color:</span>
              <div className="flex gap-1">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onColorChange(func.id, color)}
                    className="w-6 h-6 rounded border-2 transition-all"
                    style={{
                      backgroundColor: color,
                      borderColor: func.color === color ? '#FFFFFF' : 'transparent'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
