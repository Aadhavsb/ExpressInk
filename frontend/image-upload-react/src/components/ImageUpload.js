import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import ProgressBar from "./ProgressBar";
import "./ImageUpload.css";

const ImageUpload = ({ onFileUpload, onUploadNewImage }) => {
  const { getAuthHeaders } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
  };  const uploadImage = async (file) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsImageUploaded(true);
    setIsAnalysisComplete(false);
    setProgress(0);

    // Store the file for later analysis
    setSelectedFile(file);
  };
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setIsAnalysisComplete(false);
    setProgress(0);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Simulate progress during upload and analysis
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders()
          }
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      setImageUrl(`http://localhost:8000${response.data.imagePath}`);

      setTimeout(() => {
        setIsAnalyzing(false);
        setIsAnalysisComplete(true);
        
        if (onFileUpload) {
          onFileUpload(response.data);
        }
      }, 500);

    } catch (err) {
      console.error("Error analyzing image:", err);
      setIsAnalyzing(false);
      setProgress(0);
    }
  };
  const handleUploadNewImage = () => {
    setUploadedImage(null);
    setIsImageUploaded(false);
    setIsAnalysisComplete(false);
    setIsAnalyzing(false);
    setProgress(0);
    setImageUrl("");
    setSelectedFile(null);

    if (onUploadNewImage) {
      onUploadNewImage();
    }
  };

  return (
    <div className="image-upload-container">
      <div
        className={`upload-box ${isDragging ? "dragging" : ""} ${
          isImageUploaded ? "with-image" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={
          !isImageUploaded
            ? () => document.getElementById("fileInput").click()
            : null
        }
      >
        {!isImageUploaded ? (
          <>
            <p>Drag and drop an image here, or click to upload</p>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden-input"
            />
          </>
        ) : (
          <div className="uploaded-image-preview">
            <div className="image-preview-container">
              <img src={uploadedImage || imageUrl} alt="Uploaded" />
            </div>
          </div>
        )}
      </div>

      {isImageUploaded && (
        <div className="controls">
          {isAnalyzing ? (
            <ProgressBar progress={progress} />
          ) : isAnalysisComplete ? (
            <button
              className="upload-new-image-button"
              onClick={handleUploadNewImage}
            >
              Upload New Image
            </button>
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
