import React from 'react';
import "./Header.css";

const Header = () => {
  return (
    <nav className="nav">
      <div className="nav-logo">ExpressInk</div>
      <ul className="nav-links">
        <li><a href="#" className="nav-item">Home</a></li>
        <li><a href="#" className="nav-item">About</a></li>
        <li><a href="#" className="nav-item">Results</a></li>
        <li><a href="#" className="nav-item">Events</a></li>
        <li><a href="#" className="nav-item">Login/Signup</a></li>
      </ul>
    </nav>
  );
};

export default Header;