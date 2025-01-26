import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="privacy-assurance">
          <h2>Your Privacy Matters</h2>
          <p>
            We respect your privacy. All images are processed securely and are
            not stored on our servers.
          </p>
        </div>
        <div className="feature-highlights">
          <h2>Why Choose ExpressInk?</h2>
          <ul>
            <li>Instant AI Analysis</li>
            <li>User-Friendly Interface</li>
            <li>Expert Insights</li>
            <li>100% Secure and Private</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} ExpressInk Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
