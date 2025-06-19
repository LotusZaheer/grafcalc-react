
import React from 'react';
import { Input } from './ui/input';

interface FunctionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const FunctionInput: React.FC<FunctionInputProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium" style={{ color: '#C6C6C6' }}>
        Función f(x) =
      </label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ej: x^2, sin(x), cos(x), tan(x)"
        className="w-full"
        style={{
          backgroundColor: '#000',
          borderColor: '#dee2e6',
          color: '#FFFFFF'
        }}
      />
      <div className="text-xs" style={{ color: '#6c757d' }}>
        Ejemplos: x^2, sin(x), cos(x), tan(x), log(x), sqrt(x)
      </div>
    </div>
  );
};
