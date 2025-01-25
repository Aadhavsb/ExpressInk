import React, { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageAnalysis from "../components/ImageAnalysis";
import "../App.css";

const Home = () => {
  const [aiResponse, setAiResponse] = useState(null);

  const handleFileUpload = (file) => {
    console.log("File uploaded:", file);
    setAiResponse(file.aiResponse); // Assumes aiResponse is part of the response data
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Welcome to ExpressInk</h1>
        <p className="subtitle">
          Discover the emotions behind your images with our intuitive tool.
        </p>
      </header>

      <section className="about-section">
        <h2 className="section-title">About ExpressInk</h2>
        <p className="section-content">
          ExpressInk uses advanced AI technology to analyze the emotional
          content of your photos, offering insights into the mood and atmosphere
          captured in each image. Whether for personal reflection or
          professional use, ExpressInk provides a unique perspective on your
          visual content.
        </p>
      </section>

      <div>
        <h1>Upload your child's drawing here</h1>
        <ImageUpload onFileUpload={handleFileUpload} />
        <ImageAnalysis aiResponse={aiResponse} />
      </div>
    </div>
  );
};

export default Home;
