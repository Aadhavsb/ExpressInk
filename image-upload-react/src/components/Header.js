import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <a href="/">
          <img
            src="/expressink-logo.png"
            alt="ExpressInk Logo"
            className="logo-image"
          />
        </a>
      </div>
      <ul className="nav-links">
        <li>
          <a href="/" className="nav-item">
            Home
          </a>
        </li>
        <li>
          <a href="/About" className="nav-item">
            About
          </a>
        </li>
        <li>
          <a href="/Results" className="nav-item">
            Results
          </a>
        </li>
        <li>
          <a href="/Events" className="nav-item">
            Events
          </a>
        </li>
        <li>
          <a href="/Login" className="nav-item">
            Login/Signup
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
