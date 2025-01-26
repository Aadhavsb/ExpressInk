import React, { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageAnalysis from "../components/ImageAnalysis";
import "../App.css";
import Footer from "../components/Footer";

const Home = () => {
  const [aiResponse, setAiResponse] = useState(null);
  const [SuggestedPrompt, setSuggestedPrompt] = useState("");

  const handleFileUpload = (file) => {
    console.log("File uploaded:", file);
    setAiResponse(file.aiResponse);
  };

  const handleUploadNewImage = () => {
    setAiResponse(null);
  };

  const prompts = [
    "Draw a picture of yourself with your family. How do you feel in the picture?",
    "Draw a house where you feel safe. What does it look like? Who is with you?",
    "Draw a picture of your favorite place to relax. How does it make you feel?",
    "Draw a picture of a time you felt really happy. What were you doing?",
    "Draw a picture of how your day has been today. What colors or shapes do you use?",
    "Draw something that represents a challenge or problem you're facing right now.",
    "Draw a picture of your favorite thing to do when you're feeling sad. What helps you feel better?",
    "Draw a picture of a friend or someone you trust. What are they doing?",
    "Draw something that makes you feel brave or strong.",
    "Draw a picture of something you are looking forward to doing.",
  ];

  const getRandomPrompt = () => {
    const promptElement = document.querySelector(".prompt-text");
    promptElement.classList.add("fade-out");

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      setSuggestedPrompt(prompts[randomIndex]);
      promptElement.classList.remove("fade-out");
    }, 250);
  };

  useEffect(() => {
    getRandomPrompt();
  }, []);

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
      <div className="prompt" onClick={getRandomPrompt}>
        <h2>Suggested Prompt:</h2>
        <p className="prompt-text">{SuggestedPrompt}</p>
      </div>

      <div>
        <h1 className="upload-line">Upload Drawing Below</h1>
        <ImageUpload
          onFileUpload={handleFileUpload}
          onUploadNewImage={handleUploadNewImage}
        />
        <ImageAnalysis aiResponse={aiResponse} />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
