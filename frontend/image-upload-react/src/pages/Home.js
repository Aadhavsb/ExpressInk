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
  };
  return (
    <div className="app-container">
      {/* Floating toy icons */}
      <div className="floating-toys">
        <div className="toy-icon teddy">🧸</div>
        <div className="toy-icon blocks">🧱</div>
        <div className="toy-icon puzzle">🧩</div>
        <div className="toy-icon crayon">🖍️</div>
        <div className="toy-icon star">⭐</div>
        <div className="toy-icon rainbow">🌈</div>
      </div>

      <header className="heading">
        <h1 className="title">
          ExpressInk - Unleash the Story Behind Every Stroke
        </h1>
        <p className="subtitle">
          Analyze the emotions conveyed in your child's artwork instantly with
          our AI-powered insights!
        </p>
      </header>

      {/* Wave divider */}
      <div className="wave-divider"></div>

      <div className="prompt" onClick={getRandomPrompt}>
        <h2>Suggested Prompt:</h2>
        <p className="prompt-text">{SuggestedPrompt}</p>
      </div>

      {/* Section wave */}
      <div className="section-wave"></div>

      <div className="upload-drawing-container">
        <h1 className="upload-line">Upload Image or Draw Here</h1>

        {!showDrawing ? (
          <div>
            <ImageUpload
              onFileUpload={handleFileUpload}
              onUploadNewImage={handleUploadNewImage}
            />
            <p className="mode-switch-text">
              Want to draw live?{" "}
              <button
                onClick={() => {
                  setShowDrawing(true);
                  setAiResponse(null);
                }}
                className="toggle-button"
              >
                Switch to Drawing Mode
              </button>
            </p>
          </div>
        ) : (
          <div>
            <DrawingCanvas
              onAnalyze={handleDrawingAnalyze}
              onResetAnalysis={handleResetAnalysis}
            />
            <p className="mode-switch-text">
              Want to upload an image instead?{" "}
              <button
                onClick={() => {
                  setShowDrawing(false);
                  setAiResponse(null);
                }}
                className="toggle-button"
              >
                Switch to Image Upload
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Analysis wave */}
      <div className="analysis-wave"></div>

      <ImageAnalysis aiResponse={aiResponse} />

      <Footer />
    </div>
  );
};

export default Home;
