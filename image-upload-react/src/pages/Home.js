import React from "react";
import ImageUpload from "../components/ImageUpload";
import "../App.css";

const Home = () => {
  const handleFileUpload = (file) => {
    console.log("File uploaded:", file);
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
      </div>
    </div>
  );
};

export default Home;
