import React from "react";
import "./styles/about.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="intro-section">
        <span className="intro-text">Hi, I'm</span>
        <h1 className="name">Harrison Munden</h1>
      </div>
      <div className="about-links">
        <div className="about-item">
          <span className="label">goals</span>
          <span className="arrow">&#9660;</span>
        </div>
        <div className="about-item">
          <span className="label">experience</span>
          <span className="arrow">&#9660;</span>
        </div>
      </div>
    </div>
  );
};

export default About;
