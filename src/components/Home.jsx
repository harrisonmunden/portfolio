import React, { useEffect, useRef, useState } from 'react';
import './styles/home.css';
import { motion, AnimatePresence } from 'framer-motion';

const roles = ['3D Artist', 'App Developer', 'UX Designer'];

const Home = ({ goTo, hidePrintsNav, hideRealtimeNav, hideProfessionalNav }) => {
  const homeRef = useRef(null);
  const hasTransitioned = useRef(false);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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
        hasTransitioned.current = true;
        
        // Force scroll to top multiple times
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Transition immediately
        goTo('prints-for-sale');
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
              <h1 className="name-last">Munden,</h1>
              <div className="rotating-title-wrapper">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roles[roleIndex]}
                    className="rotating-title"
                    initial={{ y: 15, opacity: 0, filter: 'blur(2px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -15, opacity: 0, filter: 'blur(2px)' }}
                    transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="navigation-links">
            {!hidePrintsNav && (
              <motion.button 
                className="nav-link" 
                onClick={() => goTo('prints-for-sale')} 
                layoutId="prints-nav" 
                style={{background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer'}}
              >
                <span>prints</span>
                <motion.img 
                  src="/GlassyObjects/About/Chevron.png" 
                  alt="chevron" 
                  className="chevron-img" 
                  layoutId="prints-chevron"
                />
              </motion.button>
            )}
            {!hideRealtimeNav && (
              <motion.button 
                className="nav-link" 
                onClick={() => goTo('realtime-artwork')} 
                layoutId="realtime-nav" 
                style={{background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer'}}
              >
                <span>realtime</span>
                <motion.img 
                  src="/GlassyObjects/About/Chevron.png" 
                  alt="chevron" 
                  className="chevron-img" 
                  layoutId="realtime-chevron"
                />
              </motion.button>
            )}
            {!hideProfessionalNav && (
              <motion.button 
                className="nav-link" 
                onClick={() => goTo('professional-work')} 
                layoutId="professional-nav" 
                style={{background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer'}}
              >
                <span>professional</span>
                <motion.img 
                  src="/GlassyObjects/About/Chevron.png" 
                  alt="chevron" 
                  className="chevron-img" 
                  layoutId="professional-chevron"
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
