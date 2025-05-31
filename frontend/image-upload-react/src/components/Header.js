import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="nav">
      {/* Logo on the left */}
      <div className="nav-logo">
        <Link to="/">
          <img
            src="/expressink-logo.png"
            alt="ExpressInk Logo"
            className="logo-image"
          />
        </Link>
      </div>

      {/* Navigation links in the center */}
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-item">
            Home
          </Link>
        </li>
        <li>
          <Link to="/Results" className="nav-item">
            Results
          </Link>
        </li>
        <li>
          <Link to="/Events" className="nav-item">
            Events
          </Link>
        </li>
        <li>
          <Link to="/About" className="nav-item">
            About
          </Link>
        </li>
      </ul>

      {/* Login/Auth section on the right */}
      <div className="nav-auth">
        {!isAuthenticated ? (
          <Link to="/login" className="nav-item">
            Login
          </Link>
        ) : (
          <div className="username-dropdown" ref={dropdownRef}>
            <span onClick={toggleDropdown} className="username">
              {username}
            </span>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-button"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
