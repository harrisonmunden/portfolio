import React, { useEffect, useRef } from 'react';
import './styles/home.css';
import { motion } from 'framer-motion';

const Home = ({ goTo, hideWorkNav, hideAboutNav }) => {
  const homeRef = useRef(null);
  const hasTransitioned = useRef(false);

  useEffect(() => {
    // Completely disable all scrolling on home page
    const disableScroll = () => {
      // Prevent all scroll events
      return false;
    };

    // Add aggressive scroll prevention
    document.addEventListener('wheel', disableScroll, { passive: false, capture: true });
    document.addEventListener('touchmove', disableScroll, { passive: false, capture: true });
    document.addEventListener('scroll', disableScroll, { passive: false, capture: true });
    document.addEventListener('keydown', disableScroll, { passive: false, capture: true });
    
    // Also prevent scroll on the body and html
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Force scroll to top
    window.scrollTo(0, 0);
    
    // Listen for any scroll attempt and immediately transition
    const handleAnyScroll = (e) => {
      if (hasTransitioned.current) return;
      
      // Only transition on scroll DOWN
      if (e.deltaY > 0) {
        console.log('Scroll DOWN detected - transitioning to work immediately');
        hasTransitioned.current = true;
        
        // Force scroll to top multiple times
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Transition immediately
        goTo('work');
      }
    };

    // Listen for wheel events to detect scroll attempts
    document.addEventListener('wheel', handleAnyScroll, { passive: false });
    
    return () => {
      // Clean up all event listeners
      document.removeEventListener('wheel', disableScroll, { passive: false, capture: true });
      document.removeEventListener('touchmove', disableScroll, { passive: false, capture: true });
      document.removeEventListener('scroll', disableScroll, { passive: false, capture: true });
      document.removeEventListener('keydown', disableScroll, { passive: false, capture: true });
      document.removeEventListener('wheel', handleAnyScroll);
      
      // Restore scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [goTo]);

  return (
    <div className="home-page" ref={homeRef}>
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
              <motion.button 
                className="nav-link" 
                onClick={() => goTo('work')} 
                layoutId="work-nav" 
                style={{
                  background: 'none', 
                  border: 'none', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer'
                }}
              >
                <span>work</span>
                <motion.img 
                  src="/GlassyObjects/About/Chevron.png" 
                  alt="chevron" 
                  className="chevron-img" 
                  layoutId="work-chevron"
                />
              </motion.button>
            )}
            {!hideAboutNav && (
              <motion.button 
                className="nav-link" 
                onClick={() => goTo('about')} 
                layoutId="about-nav" 
                style={{
                  background: 'none', 
                  border: 'none', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer'
                }}
              >
                <span>about</span>
                <motion.img 
                  src="/GlassyObjects/About/Chevron.png" 
                  alt="chevron" 
                  className="chevron-img" 
                  layoutId="about-chevron"
                />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
