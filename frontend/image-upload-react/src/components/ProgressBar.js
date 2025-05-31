import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="progress-text">
        {progress < 100 ? `Analyzing... ${progress}%` : 'Analysis Complete!'}
      </div>
    </div>
  );
};

export default ProgressBar;
