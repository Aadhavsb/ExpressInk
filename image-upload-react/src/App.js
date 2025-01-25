import React from "react";
import ImageUpload from './ImageUpload';
import "./App.css";

export default function App() {
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
          ExpressInk uses advanced AI technology to analyze the emotional content of
          your photos, offering insights into the mood and atmosphere captured in
          each image. Whether for personal reflection or professional use, ExpressInk
          provides a unique perspective on your visual content.
        </p>
      </section>

      <section className="how-to-section">
        <h2 className="section-title">How to Use</h2>
        <ol className="instructions">
          <li>Upload your image using the button below.</li>
          <li>Our AI analyzes the photo to detect emotions.</li>
          <li>Receive detailed insights and mood summaries.</li>
        </ol>
      </section>

      <ImageUpload />
    </div>
  );
}