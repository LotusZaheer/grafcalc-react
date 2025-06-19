
import React, { useState } from 'react';
import { GraphingCalculator } from './GraphingCalculator';
import { FunctionInput } from './FunctionInput';
import { GraphList } from './GraphList';
import { Plus } from 'lucide-react';

export interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

const GRAPH_COLORS = [
  '#00ff00', // green
  '#ff0000', // red
  '#0000ff', // blue
  '#ffff00', // yellow
  '#ff00ff', // magenta
  '#00ffff', // cyan
  '#ffa500', // orange
  '#800080', // purple
];

export const Calculator = () => {
  const [functions, setFunctions] = useState<GraphFunction[]>([]);
  const [currentExpression, setCurrentExpression] = useState('x^2');

  const addFunction = () => {
    if (!currentExpression.trim()) return;

    const newFunction: GraphFunction = {
      id: Date.now().toString(),
      expression: currentExpression,
      color: GRAPH_COLORS[functions.length % GRAPH_COLORS.length],
      visible: true,
    };

    setFunctions([...functions, newFunction]);
    setCurrentExpression('');
  };

  const removeFunction = (id: string) => {
    setFunctions(functions.filter(f => f.id !== id));
  };

  const toggleFunction = (id: string) => {
    setFunctions(functions.map(f => 
      f.id === id ? { ...f, visible: !f.visible } : f
    ));
  };

  const updateFunctionColor = (id: string, color: string) => {
    setFunctions(functions.map(f => 
      f.id === id ? { ...f, color } : f
    ));
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#000' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#FFFFFF' }}>
          Calculadora Gráfica
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de control */}
          <div className="lg:col-span-1 space-y-6">
            <div 
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: '#1A1A1A',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                Agregar Función
              </h2>
              
              <FunctionInput
                value={currentExpression}
                onChange={setCurrentExpression}
                onSubmit={addFunction}
              />
              
              <button
                onClick={addFunction}
                className="w-full mt-4 px-4 py-2 rounded flex items-center justify-center gap-2 transition-all duration-300"
                style={{ 
                  backgroundColor: '#0F5FA6',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0A8CBF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0F5FA6';
                }}
              >
                <Plus size={20} />
                Agregar Gráfica
              </button>
            </div>

            <GraphList
              functions={functions}
              onRemove={removeFunction}
              onToggle={toggleFunction}
              onColorChange={updateFunctionColor}
            />
          </div>

          {/* Gráfica */}
          <div className="lg:col-span-3">
            <div 
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: '#1A1A1A',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              <GraphingCalculator functions={functions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
