import React from "react";
import "./ImageAnalysis.css";

const ImageAnalysis = ({ aiResponse }) => {
  if (!aiResponse) {
    return <div></div>;
  }

  const { sentiment_rating, reasoning_text, detected_objects } = aiResponse;

  //capitalize first letter of sentiment_rating
  const capitalizeSentimentRating = sentiment_rating
    ? sentiment_rating.charAt(0).toUpperCase() + sentiment_rating.slice(1)
    : '';

  //capitalize first letter for each object in the detected_objects array
  const capitalizeDetectedObjects = detected_objects
    ? detected_objects.map((object) =>
        object
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
    : [];

  return (
    <div className="image-analysis-container">
      <h2>Image Analysis Results</h2>
      <div className="analysis-content">
        <div className="analysis-item">
          <h3>Mood Rating:</h3>
          <p className="sentiment-rating">{capitalizeSentimentRating}</p>
        </div>

        <div className="analysis-item">
          <h3>Reasoning:</h3>
          <p className="reasoning-text">{reasoning_text}</p>
        </div>

        <div className="analysis-item">
          <h3>Detected Objects:</h3>
          {detected_objects && detected_objects.length > 0 ? (
            <ul className="detected-objects-list">
              {capitalizeDetectedObjects.map((object, index) => (
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
