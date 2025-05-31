import React, { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageAnalysis from "../components/ImageAnalysis";
import DrawingCanvas from "../components/DrawingCanvas";
import Footer from "../components/Footer";
import "../App.css";
import "./Home.css";

const Home = () => {
  const [aiResponse, setAiResponse] = useState(null);
  const [SuggestedPrompt, setSuggestedPrompt] = useState("");
  const [showDrawing, setShowDrawing] = useState(false);

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

  const handleDrawingAnalyze = (savedDrawingDataUrl) => {
    const file = dataURLtoFile(savedDrawingDataUrl, "drawing.png");

    uploadImage(file);
  };

  const handleResetAnalysis = () => {
    setAiResponse(null);
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("Non-JSON response:", errorText);
        throw new Error("Server returned non-JSON response");
      }

      const responseData = await response.json();
      if (responseData.aiResponse) {
        setAiResponse(responseData.aiResponse);
      } else {
        console.error("No aiResponse in the response:", responseData);
      }
    } catch (error) {
      console.error("Error uploading drawing:", error);
    }
  };  return (
    <div className="app-container">
      <header className="heading">
        <h1 className="title">
          ExpressInk - Unleash the Story Behind Every Stroke
        </h1>
        <p className="subtitle">
          Analyze the emotions conveyed in your child's artwork instantly with
          our AI-powered insights!
        </p>
      </header>{/* Main content container for side-by-side layout */}
      <div className="main-content">        <div className="prompt" onClick={getRandomPrompt}>
          <h2>Suggested Prompt:</h2>
          <p className="prompt-text">{SuggestedPrompt}</p>
          
          <div className="prompt-info">
            <div className="tip-section">
              <h3>💡 Drawing Tips:</h3>
              <ul>
                <li>Use bright colors to show happiness</li>
                <li>Draw big when you feel confident</li>
                <li>Include details that matter to you</li>
                <li>There's no wrong way to express yourself!</li>
              </ul>
            </div>
            
            <div className="encouragement">
              <h3>🌟 Remember:</h3>
              <p>Every drawing tells a unique story about your feelings and experiences. Take your time and have fun!</p>
            </div>
          </div>
        </div>

        <div className="upload-drawing-container">
          <h1 className="upload-line">Upload Image or Draw Here</h1>

          <div className="content-area">
            {!showDrawing ? (
              <ImageUpload
                onFileUpload={handleFileUpload}
                onUploadNewImage={handleUploadNewImage}
              />
            ) : (
              <DrawingCanvas
                onAnalyze={handleDrawingAnalyze}
                onResetAnalysis={handleResetAnalysis}
              />
            )}
          </div>

          <p className="mode-switch-text">
            {!showDrawing ? "Want to draw live? " : "Want to upload an image instead? "}
            <button
              onClick={() => {
                setShowDrawing(!showDrawing);
                setAiResponse(null);
              }}
              className="toggle-button"
            >
              {!showDrawing ? "Switch to Drawing Mode" : "Switch to Image Upload"}
            </button>
          </p>
        </div>
      </div>

      <ImageAnalysis aiResponse={aiResponse} />

      <Footer />
    </div>
  );
};

export default Home;
