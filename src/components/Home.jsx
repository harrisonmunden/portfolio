import React from 'react';
import './styles/home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-content">
        {/* Left side - Text content */}
        <div className="home-text-section">
          <div className="name-greeting-row">
            <div className="greeting">
              <span className="greeting-text">Hi, im</span>
            </div>
            
            <div className="name-section">
              <h1 className="name-first">Harrison</h1>
              <h1 className="name-last">Munden</h1>
            </div>
          </div>
          
          <div className="navigation-links">
            <a href="#work" className="nav-link">
              work
              <img src="/src/assets/GlassyObjects/About/Chevron.png" alt="chevron" className="chevron-img" />
            </a>
            <a href="#about" className="nav-link">
              about
              <img src="/src/assets/GlassyObjects/About/Chevron.png" alt="chevron" className="chevron-img" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Person figure at bottom */}
      <div className="home-figure-section">
        <img 
          src="/src/assets/GlassyObjects/About/PersonFigure.png" 
          alt="Person Figure" 
          className="person-figure"
        />
      </div>
    </div>
  );
};

export default Home;
