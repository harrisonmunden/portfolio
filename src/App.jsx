import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PersonFigure from './components/PersonFigure';
import Home from './components/Home';
import Works from './components/Works';
import About from './components/About';
import VideoGamePage from './components/VideoGamePage';
import { useScrollToTop } from './hooks/useScrollToTop';

// Animation constants
const PAGE_BOUNCE = {
  type: 'spring',
  stiffness: 230,
  damping: 20,
  bounce: 0.2,
};

const HEADER_ANIMATION = {
  type: 'spring',
  stiffness: 230,
  damping: 20,
  bounce: 0.2,
};

// Faster, simpler animation for video game pages
const GAME_PAGE_ANIMATION = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
};

// Shared header components
const SharedWorkHeader = ({ page, goTo }) => {
  const isHome = page === 'home';
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  
  if (!(page === 'home' || page === 'work')) return null;
  
  return (
    <motion.div
      layout
      layoutId="work-nav"
      className="shared-work-header"
      style={{
        position: 'absolute',
        left: isHome ? (isMobile ? 25 : 100) : (isMobile ? 20 : 60),
        top: isHome ? (isMobile ? 320 : 420) : (isMobile ? 20 : 50),
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: isHome ? (isMobile ? 46 : 66) : (isMobile ? 40 : 88),
        fontWeight: 900,
        color: '#1a1a1a',
        letterSpacing: '0.085em',
        fontFamily: 'Martian Mono, Courier New, Courier, monospace',
      }}
      onClick={() => goTo(isHome ? 'work' : 'home')}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={HEADER_ANIMATION}
    >
      <span>work</span>
      <motion.img
        src="/GlassyObjects/About/Chevron.png"
        alt="chevron"
        className="chevron-img"
        layoutId="work-chevron"
        style={{
          width: isHome ? 55 : (isMobile ? 29 : 55), 
          marginLeft: 8,
          marginTop: 0,
        }}
        initial={false}
        animate={{ width: isHome ? 55 : (isMobile ? 29 : 55), rotate: isHome ? 0 : 90 }}
        transition={HEADER_ANIMATION}
      />
    </motion.div>
  );
};

const SharedAboutHeader = ({ page, goTo }) => {
  const isHome = page === 'home';
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  
  if (!(page === 'home' || page === 'about')) return null;
  
  return (
    <motion.div
      layout
      layoutId="about-nav"
      className="shared-about-header"
      style={{
        position: 'absolute',
        left: isHome ? (isMobile ? 25 : 100) : (isMobile ? 20 : 60),
        top: isHome ? (isMobile ? 390 : 500) : (isMobile ? 20 : 50),
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: isHome ? (isMobile ? 46 : 66) : (isMobile ? 40 : 88),
        fontWeight: 900,
        color: '#1a1a1a',
        letterSpacing: '0.085em',
        fontFamily: 'Martian Mono, Courier New, Courier, monospace',
      }}
      onClick={() => goTo(isHome ? 'about' : 'home')}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={HEADER_ANIMATION}
    >
      <span>about</span>
      <motion.img
        src="/GlassyObjects/About/Chevron.png"
        alt="chevron"
        className="chevron-img"
        layoutId="about-chevron"
        style={{
          width: isHome ? 55 : (isMobile ? 29 : 55), 
          marginLeft: 8,
          marginTop: 0,
        }}
        initial={false}
        animate={{ width: isHome ? 55 : (isMobile ? 29 : 55), rotate: isHome ? 0 : 90 }}
        transition={HEADER_ANIMATION}
      />
    </motion.div>
  );
};

// Main App component with routing
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modelViewerOpen, setModelViewerOpen] = useState(false);
  
  // Use custom scroll restoration hook
  useScrollToTop();
  
  // Get current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/work') return 'work';
    if (path === '/about') return 'about';
    if (path.startsWith('/game/')) return 'game';
    return 'home';
  };
  
  const currentPage = getCurrentPage();
  const isGamePage = currentPage === 'game';

  const goTo = (target) => {
    if (target === 'about') return; // Prevent navigation to about page
    if (target === 'home') {
      navigate('/');
    } else if (target === 'work') {
      navigate('/work');
    }
  };

  // Expose goToHome globally for PersonFigure click-to-home
  useEffect(() => {
    window.goToHome = () => goTo('home');
    return () => { window.goToHome = undefined; };
  }, [navigate]);

  // Fade style for header and PersonFigure
  const fadeStyle = modelViewerOpen ? { opacity: 0, pointerEvents: 'none', transition: 'opacity 0.4s cubic-bezier(.4,2,.6,1)' } : {};

  return (
    <div className="relative z-0 bg-primary" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Only show navigation headers and PersonFigure on home/work pages, not on game pages */}
      {!isGamePage && (
        <>
          <AnimatePresence mode="wait">
            <div style={fadeStyle}>
              <SharedWorkHeader key="work-header" page={currentPage} goTo={goTo} />
            </div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <div style={fadeStyle}>
              <SharedAboutHeader key="about-header" page={currentPage} goTo={goTo} />
            </div>
          </AnimatePresence>
          {/* Person Figure Animation */}
          <div style={fadeStyle}>
            <PersonFigure page={currentPage} />
          </div>
        </>
      )}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={PAGE_BOUNCE}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <Home goTo={goTo} hideWorkNav hideAboutNav={true} />
            </motion.div>
          } />
          <Route path="/work" element={
            <motion.div
              key="work"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={PAGE_BOUNCE}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <Works goTo={goTo} hideWorkNav onModelViewerOpenChange={setModelViewerOpen} />
            </motion.div>
          } />
          <Route path="/game/:gameId" element={
            <motion.div
              key={`game-${location.pathname}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={GAME_PAGE_ANIMATION}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <VideoGamePage />
            </motion.div>
          } />
          {/* {page === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={PAGE_BOUNCE}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <About goTo={goTo} hideAboutNav={true} />
            </motion.div>
          )} */}
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;