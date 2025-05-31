import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="privacy-assurance">
          <h2>Want to Get More Involved?</h2>
          <p><a href="https://researchautism.org/researchers/research-participation-opportunities/" target="_blank">ResearchAutism.org</a> hosts an aggregate of volunteer, research, and leadership opportunities in the autism field. </p>
        </div>
        <div className="feature-highlights">
          <h2>Why Choose ExpressInk?</h2>
          <ul>
            <li>Track mood trends over time</li>
            <li>See upcoming events near you</li>
            <li>Daily drawing prompt suggestions</li>
            <li>Secure, private, and easy interface</li>
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
