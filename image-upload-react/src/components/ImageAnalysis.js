import React from "react";

const ImageAnalysis = ({ aiResponse }) => {
  if (!aiResponse) {
    return (
      <div className="image-analysis-container">
        <p>Please upload an image for analysis.</p>
      </div>
    );
  }

  const { sentiment_rating, reasoning_text, detected_objects } = aiResponse;

  return (
    <div className="image-analysis-container">
      <h2>Image Analysis Results</h2>

      <div className="analysis-item">
        <h3>Sentiment Rating:</h3>
        <p>{sentiment_rating}</p>
      </div>

      <div className="analysis-item">
        <h3>Reasoning:</h3>
        <p>{reasoning_text}</p>
      </div>

      <div className="analysis-item">
        <h3>Detected Objects:</h3>
        {detected_objects && detected_objects.length > 0 ? (
          <ul>
            {detected_objects.map((object, index) => (
              <li key={index}>{object}</li>
            ))}
          </ul>
        ) : (
          <p>No objects detected.</p>
        )}
      </div>
    </div>
  );
};

export default ImageAnalysis;