// ---- SHARED HEADER ANIMATION CONFIG ----
// To control the shared header (work/about) transition:
// - stiffness: higher = snappier, lower = longer/more bounce
// - damping: lower = more bounce, higher = less bounce
// - bounce: higher = more bounce
export const HEADER_ANIMATION = {
  type: 'spring',
  stiffness: 230,
  damping: 20,
  bounce: 0.2,
};
// ----------------------------------------

const PAGE_BOUNCE = {
  type: 'spring',
  stiffness: 230,
  damping: 20,
  bounce: 0.2,
};

import React, { useState, useEffect } from 'react';
import { About, Works, Home } from './components';
import { AnimatePresence, motion } from 'framer-motion';
import PersonFigure from './components/PersonFigure';

const SHARED_CHEVRON_SRC = '/GlassyObjects/About/Chevron.png';

const SharedWorkHeader = ({ page, goTo }) => {
  const isHome = page === 'home';
  const isMobile = window.innerWidth <= 600;
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
        src={SHARED_CHEVRON_SRC}
        alt="chevron"
        className="chevron-img"
        layoutId="work-chevron"
        style={{
          width: isHome ? 55 : (isMobile ? 29 : 55),
          marginLeft: 8,
          marginTop: 0,
        }}
        initial={false}
        animate={{ width: isHome ? 55 : (isMobile ? 29 : 55), rotate: isHome ? 0 : 90}}
        transition={HEADER_ANIMATION}
      />
    </motion.div>
  );
};

const SharedAboutHeader = ({ page, goTo }) => {
  const isHome = page === 'home';
  const isMobile = window.innerWidth <= 600;
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
        src={SHARED_CHEVRON_SRC}
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

const App = () => {
  const [page, setPage] = useState('home');
  const [modelViewerOpen, setModelViewerOpen] = useState(false);

  const goTo = (target) => {
    if (target === 'about') return; // Prevent navigation to about page
    setPage(target);
  };

  // Expose goToHome globally for PersonFigure click-to-home
  useEffect(() => {
    window.goToHome = () => goTo('home');
    return () => { window.goToHome = undefined; };
  }, []);

  // Fade style for header and PersonFigure
  const fadeStyle = modelViewerOpen ? { opacity: 0, pointerEvents: 'none', transition: 'opacity 0.4s cubic-bezier(.4,2,.6,1)' } : {};

  return (
    <div className="relative z-0 bg-primary" style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <div style={fadeStyle}>
          <SharedWorkHeader key="work-header" page={page} goTo={goTo} />
        </div>
      </AnimatePresence>
      {/* <AnimatePresence mode="wait">
        <div style={fadeStyle}>
          <SharedAboutHeader key="about-header" page={page} goTo={goTo} />
        </div>
      </AnimatePresence> */}
      {/* Person Figure Animation */}
      <div style={fadeStyle}>
        <PersonFigure page={page} />
      </div>
      <AnimatePresence mode="wait">
        {page === 'home' && (
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
        )}
        {page === 'work' && (
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
        )}
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
      </AnimatePresence>
    </div>
  );
};

export default App;