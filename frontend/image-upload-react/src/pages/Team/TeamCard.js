import React from "react";
import "./TeamCard.css";

export default function TeamCard({ image, name, bio }) {
  return (
    <div className="team-card">
      <div className="team-card-image-container">
        <img
          src={image}
          alt={`${name}'s profile`}
          className="team-card-image"
        />
        <div className="team-card-overlay"></div>
      </div>
      <div className="team-card-content">
        <h3 className="team-card-name">{name}</h3>
        <p className="team-card-bio">{bio}</p>
        <div className="team-card-badge">Full Stack</div>
      </div>
    </div>
  );
}
