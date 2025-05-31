import React from "react";
import "./TeamCard.css";

export default function TeamCard({ image, name, bio }) {
  return (
    <div className="team-card">
      <img
        src={image}
        alt={`${name}'s profile`}
        className="team-card-image"
      />
      <h3 className="team-card-name">{name}</h3>
      <p className="team-card-bio">{bio}</p>
    </div>
  );
}
