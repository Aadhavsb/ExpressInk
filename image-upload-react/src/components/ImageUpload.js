import React, { useState } from "react";
import "./ImageUpload.css";
import axios from "axios";

const ImageUpload = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const uploadImage = (file) => {
    const imageUrl = URL.createObjectURL(file); // Local preview
    setUploadedImage(imageUrl);
    setIsImageUploaded(true);
    if (onFileUpload) {
      onFileUpload(file);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // Simulate progress
    let fakeProgress = 0;
    const progressInterval = setInterval(() => {
      fakeProgress += 10;
      setProgress(fakeProgress);
      if (fakeProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsAnalyzing(false); // Stop analyzing after progress completes
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="image-upload-container">
      {!isImageUploaded ? (
        <div
          className={`upload-box ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <p>Drag and drop an image here, or click to upload</p>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden-input"
          />
        </div>
      ) : (
        <div className="uploaded-image-preview">
          <img src={uploadedImage} alt="Uploaded" />
          {isAnalyzing ? (
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          ) : (
            <button className="analyze-button" onClick={handleAnalyze}>
              Analyze
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
