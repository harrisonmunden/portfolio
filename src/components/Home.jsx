import React from 'react';
import './styles/home.css';
import { motion } from 'framer-motion';

const Home = ({ goTo, hideWorkNav, hideAboutNav }) => {
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
            {!hideWorkNav && (
              <motion.button className="nav-link" onClick={() => goTo('work')} layoutId="work-nav" style={{background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <span>work</span>
                <motion.img src="/src/assets/GlassyObjects/About/Chevron.png" alt="chevron" className="chevron-img" layoutId="work-chevron" />
              </motion.button>
            )}
            {!hideAboutNav && (
              <motion.button className="nav-link" onClick={() => goTo('about')} layoutId="about-nav" style={{background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <span>about</span>
                <motion.img src="/src/assets/GlassyObjects/About/Chevron.png" alt="chevron" className="chevron-img" layoutId="about-chevron" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
