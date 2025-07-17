import React from "react";
import "./styles/about.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="intro-section">
        <span className="intro-text">Hi, I'm</span>
        <h1 className="name">Harrison Munden</h1>
      </div>
      <div className="about-main-content">
        <img
          src="/src/assets/placeholder-profile.png"
          alt="Profile"
          className="profile-img"
        />
        <div className="about-details">
          <div className="about-section">
            <div className="about-item">
              <span className="label">goals</span>
              <span className="arrow">&#9660;</span>
            </div>
            <div className="about-dropdown">
              <p>Placeholder for goals description. Add your goals here.</p>
            </div>
          </div>
          <div className="about-section">
            <div className="about-item">
              <span className="label">experience</span>
              <span className="arrow">&#9660;</span>
            </div>
            <div className="about-dropdown">
              <p>
                Placeholder for experience description. Add your experience here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
