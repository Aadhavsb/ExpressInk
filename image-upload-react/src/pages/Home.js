import React, { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageAnalysis from "../components/ImageAnalysis";
import "../App.css";

const Home = () => {
  const [aiResponse, setAiResponse] = useState(null);

  const handleFileUpload = (file) => {
    console.log("File uploaded:", file);
    setAiResponse(file.aiResponse);
  };

  const handleUploadNewImage = () => {
    setAiResponse(null);
  };

  return (
    <div className="app-container">
      <header className="heading">
        <h1 className="title">
          ExpressInk - Unleash the Story Behind Every Stroke
        </h1>
        <p className="subtitle">
          Analyze the emotions conveyed in your child's artwork instantly with
          our AI-powered insights!
        </p>
      </header>

      <div>
        <h1>Upload your child's drawing here</h1>
        <ImageUpload
          onFileUpload={handleFileUpload}
          onUploadNewImage={handleUploadNewImage}
        />
        <ImageAnalysis aiResponse={aiResponse} />
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="privacy-assurance">
            <h2>Your Privacy Matters</h2>
            <p>
              We respect your privacy. All images are processed securely and are
              not stored on our servers.
            </p>
          </div>
          <div className="feature-highlights">
            <h2>Why Choose ExpressInk?</h2>
            <ul>
              <li>Instant AI Analysis</li>
              <li>User-Friendly Interface</li>
              <li>Expert Insights</li>
              <li>100% Secure and Private</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} ExpressInk Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
