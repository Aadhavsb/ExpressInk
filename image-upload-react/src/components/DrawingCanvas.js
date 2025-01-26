import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import "./DrawingCanvas.css";

const DrawingCanvas = ({ onSave }) => {
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(4);

  const handleSave = () => {
    const dataUrl =
      canvasRef.current.canvasContainer.children[1].toDataURL("image/png");
    onSave(dataUrl);
  };

  const handleClear = () => {
    canvasRef.current.clear();
  };

  const handleUndo = () => {
    canvasRef.current.undo();
  };

  return (
    <div className="drawing-canvas-container">
      <CanvasDraw
        ref={canvasRef}
        canvasWidth={800}
        canvasHeight={400}
        brushColor={brushColor}
        brushRadius={brushRadius}
        lazyRadius={0}
        hideGrid
        className="canvas-draw"
      />
      <div className="drawing-controls">
        <div className="color-picker">
          <label>Brush Color:</label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
          />
        </div>
        <div className="brush-size">
          <label>Brush Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushRadius}
            onChange={(e) => setBrushRadius(parseInt(e.target.value))}
          />
        </div>
        <button onClick={handleUndo} className="drawing-button">
          Undo
        </button>
        <button onClick={handleClear} className="drawing-button">
          Clear
        </button>
        <button onClick={handleSave} className="drawing-button">
          Save Drawing
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
