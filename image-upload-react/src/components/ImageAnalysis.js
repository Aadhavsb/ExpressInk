import React from "react";
import "./ImageAnalysis.css";

const ImageAnalysis = ({ aiResponse }) => {
  if (!aiResponse) {
    return <div></div>;
  }

  const { sentiment_rating, reasoning_text, detected_objects } = aiResponse;

  return (
    <div className="image-analysis-container">
      <h2>Image Analysis Results</h2>
      <div className="analysis-content">
        <div className="analysis-item">
          <h3>Mood Rating:</h3>
          <p className="sentiment-rating">{sentiment_rating}</p>
        </div>

        <div className="analysis-item">
          <h3>Reasoning:</h3>
          <p className="reasoning-text">{reasoning_text}</p>
        </div>

        <div className="analysis-item">
          <h3>Detected Objects:</h3>
          {detected_objects && detected_objects.length > 0 ? (
            <ul className="detected-objects-list">
              {detected_objects.map((object, index) => (
                <li key={index} className="detected-object-item">
                  {object}
                </li>
              ))}
            </ul>
          ) : (
            <p>No objects detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;
