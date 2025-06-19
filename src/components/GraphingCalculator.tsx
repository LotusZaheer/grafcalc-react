
import React, { useRef, useEffect, useState } from 'react';
import { evaluate } from 'mathjs';
import { GraphFunction } from './Calculator';

interface GraphingCalculatorProps {
  functions: GraphFunction[];
}

interface Point {
  x: number;
  y: number;
}

interface Viewport {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const GraphingCalculator: React.FC<GraphingCalculatorProps> = ({ functions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewport, setViewport] = useState<Viewport>({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; visible: boolean; values: string[] }>({
    x: 0,
    y: 0,
    visible: false,
    values: []
  });

  const width = 800;
  const height = 600;

  const screenToWorld = (screenX: number, screenY: number) => {
    const worldX = viewport.xMin + (screenX / width) * (viewport.xMax - viewport.xMin);
    const worldY = viewport.yMax - (screenY / height) * (viewport.yMax - viewport.yMin);
    return { x: worldX, y: worldY };
  };

  const worldToScreen = (worldX: number, worldY: number) => {
    const screenX = ((worldX - viewport.xMin) / (viewport.xMax - viewport.xMin)) * width;
    const screenY = ((viewport.yMax - worldY) / (viewport.yMax - viewport.yMin)) * height;
    return { x: screenX, y: screenY };
  };

  const evaluateFunction = (expression: string, x: number): number | null => {
    try {
      const result = evaluate(expression, { x });
      return typeof result === 'number' && isFinite(result) ? result : null;
    } catch {
      return null;
    }
  };

  const plotFunction = (ctx: CanvasRenderingContext2D, func: GraphFunction) => {
    if (!func.visible) return;

    ctx.strokeStyle = func.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const step = (viewport.xMax - viewport.xMin) / width;
    let isFirstPoint = true;

    for (let x = viewport.xMin; x <= viewport.xMax; x += step) {
      const y = evaluateFunction(func.expression, x);
      
      if (y !== null) {
        const screen = worldToScreen(x, y);
        
        if (screen.y >= 0 && screen.y <= height) {
          if (isFirstPoint) {
            ctx.moveTo(screen.x, screen.y);
            isFirstPoint = false;
          } else {
            ctx.lineTo(screen.x, screen.y);
          }
        } else {
          isFirstPoint = true;
        }
      } else {
        isFirstPoint = true;
      }
    }

    ctx.stroke();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Grid lines
    const gridSpacing = Math.pow(10, Math.floor(Math.log10((viewport.xMax - viewport.xMin) / 10)));
    
    // Vertical lines
    for (let x = Math.ceil(viewport.xMin / gridSpacing) * gridSpacing; x <= viewport.xMax; x += gridSpacing) {
      const screen = worldToScreen(x, 0);
      ctx.beginPath();
      ctx.moveTo(screen.x, 0);
      ctx.lineTo(screen.x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = Math.ceil(viewport.yMin / gridSpacing) * gridSpacing; y <= viewport.yMax; y += gridSpacing) {
      const screen = worldToScreen(0, y);
      ctx.beginPath();
      ctx.moveTo(0, screen.y);
      ctx.lineTo(width, screen.y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    // X-axis
    if (viewport.yMin <= 0 && viewport.yMax >= 0) {
      const screen = worldToScreen(0, 0);
      ctx.beginPath();
      ctx.moveTo(0, screen.y);
      ctx.lineTo(width, screen.y);
      ctx.stroke();
    }

    // Y-axis
    if (viewport.xMin <= 0 && viewport.xMax >= 0) {
      const screen = worldToScreen(0, 0);
      ctx.beginPath();
      ctx.moveTo(screen.x, 0);
      ctx.lineTo(screen.x, height);
      ctx.stroke();
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx);

    // Plot all functions
    functions.forEach(func => plotFunction(ctx, func));
  };

  useEffect(() => {
    draw();
  }, [functions, viewport]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      const worldDeltaX = (deltaX / width) * (viewport.xMax - viewport.xMin);
      const worldDeltaY = (deltaY / height) * (viewport.yMax - viewport.yMin);

      setViewport(prev => ({
        xMin: prev.xMin - worldDeltaX,
        xMax: prev.xMax - worldDeltaX,
        yMin: prev.yMin + worldDeltaY,
        yMax: prev.yMax + worldDeltaY,
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      // Show tooltip with function values
      const world = screenToWorld(mouseX, mouseY);
      const values = functions
        .filter(f => f.visible)
        .map(f => {
          const y = evaluateFunction(f.expression, world.x);
          return y !== null ? `f(x) = ${y.toFixed(3)}` : 'undefined';
        });

      setTooltip({
        x: mouseX,
        y: mouseY,
        visible: values.length > 0,
        values: [`x = ${world.x.toFixed(3)}`, `y = ${world.y.toFixed(3)}`, ...values]
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const world = screenToWorld(mouseX, mouseY);

    const newWidth = (viewport.xMax - viewport.xMin) * zoomFactor;
    const newHeight = (viewport.yMax - viewport.yMin) * zoomFactor;

    setViewport({
      xMin: world.x - (world.x - viewport.xMin) * zoomFactor,
      xMax: world.x + (viewport.xMax - world.x) * zoomFactor,
      yMin: world.y - (world.y - viewport.yMin) * zoomFactor,
      yMax: world.y + (viewport.yMax - world.y) * zoomFactor,
    });
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border cursor-crosshair"
        style={{ borderColor: '#dee2e6' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      />
      
      {tooltip.visible && (
        <div
          className="absolute pointer-events-none p-2 rounded text-xs"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            color: '#FFFFFF',
            border: '1px solid #dee2e6',
            zIndex: 1000
          }}
        >
          {tooltip.values.map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm" style={{ color: '#6c757d' }}>
        <p>• Arrastra para mover la vista</p>
        <p>• Usa la rueda del mouse para hacer zoom</p>
        <p>• Pasa el mouse sobre la gráfica para ver los valores</p>
      </div>
    </div>
  );
};
