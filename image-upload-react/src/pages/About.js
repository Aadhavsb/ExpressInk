import React from "react";
import "../App.css";

const About = () => {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">About ExpressInk</h1>
        <p className="subtitle">
          Learn more about our platform, our team, and how to get in touch.
        </p>
      </header>

      <section className="about-section">
        <h2 className="section-title">About ExpressInk</h2>
        <p className="section-content">
        ExpressInk uses advanced AI technology to analyze the emotional content of your photos, offering insights into the mood and atmosphere captured in each image. Whether for personal reflection or professional use, ExpressInk provides a unique perspective on your visual content.
        </p>
      </section>

      <section className="about-section">
        <h2 className="section-title">Our Team</h2>
        <p className="section-content">
          As part of HackCWRU 2025, we built a webapp based on Node.js and React.
        </p>
        <ul className="team-list">
          <li><strong>Aadhab Bharadwaj</strong> - Full Stack</li>
          <li><strong>Sunveer Chugh</strong> - Full Stack</li>
          <li><strong>Jason Li</strong> - Full Stack</li>
          <li><strong>Dakin Muhlner</strong> - Full Stack</li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="section-title">Contact Info</h2>
        <p className="section-content">
          We would love to hear from you! Whether you have questions, feedback,
          or just want to say hello, feel free to reach out!
        </p>
        <p className="section-content">
          <strong>Email:</strong> ssc151@case.edu
        </p>
      </section>
    </div>
  );
};

export default About;
