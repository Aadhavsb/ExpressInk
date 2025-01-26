import React, { useRef, useState, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import ProgressBar from "./ProgressBar";
import "./DrawingCanvas.css";

const DrawingCanvas = ({ onAnalyze, onResetAnalysis }) => {
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(4);

  const [isDrawingSaved, setIsDrawingSaved] = useState(false);
  const [savedDrawing, setSavedDrawing] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isDrawingSaved && canvasRef.current) {
      canvasRef.current.clear();
    }
  }, [isDrawingSaved]);

  const handleSave = () => {
    const dataUrl =
      canvasRef.current.canvasContainer.children[1].toDataURL("image/png");
    setSavedDrawing(dataUrl);
    setIsDrawingSaved(true);
    setIsAnalysisComplete(false);
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setIsAnalysisComplete(false);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        console.log(newProgress);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          setIsAnalysisComplete(true);

          if (onAnalyze) {
            onAnalyze(savedDrawing);
          }
        }
        return newProgress;
      });
    }, 200);
  };

  const handleDrawNewImage = () => {
    setIsDrawingSaved(false);
    setSavedDrawing(null);
    setIsAnalysisComplete(false);
    setProgress(0);

    if (onResetAnalysis) {
      onResetAnalysis();
    }
  };

  return (
    <div className="drawing-canvas-container">
      {!isDrawingSaved ? (
        <>
          <CanvasDraw
            ref={canvasRef}
            canvasWidth={1000}
            canvasHeight={600}
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
        </>
      ) : (
        <div className="saved-drawing-container">
          <img
            src={savedDrawing}
            alt="Saved Drawing"
            className="saved-drawing"
          />
          <div className="controls">
            {isAnalyzing ? (
              <ProgressBar progress={progress} />
            ) : isAnalysisComplete ? (
              <button
                className="upload-new-drawing-button"
                onClick={handleDrawNewImage}
              >
                Draw New Image
              </button>
            ) : (
              <button className="analyze-button" onClick={handleAnalyze}>
                Analyze
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
