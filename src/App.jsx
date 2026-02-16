import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PersonFigure from './components/PersonFigure';
import Home from './components/Home';
import PrintsForSale from './components/PrintsForSale';
import RealtimeArtwork from './components/RealtimeArtwork';
import ProfessionalWork from './components/ProfessionalWork';
import VideoGamePage from './components/VideoGamePage';
import CartPage from './components/CartPage';
import CartIcon from './components/CartIcon';
import CheckoutSuccess from './components/CheckoutSuccess';
import { CartProvider } from './contexts/CartContext';
import { useScrollToTop } from './hooks/useScrollToTop';

// Animation constants - Original spring physics for character
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

// Hook for responsive window width tracking
const useWindowWidth = () => {
  const [width, setWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    let rafId;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return width;
};

// Responsive value helper: returns mobile/tablet/desktop value based on width
const responsive = (width, mobile, tablet, desktop) => {
  if (width <= 600) return mobile;
  if (width <= 1024) return tablet;
  return desktop;
};

// Shared header components
const SharedPrintsHeader = ({ page, goTo, windowWidth }) => {
  const isHome = page === 'home';
  const w = windowWidth;

  if (!(page === 'home' || page === 'prints-for-sale')) return null;

  const fontSize = isHome
    ? responsive(w, 32, Math.round(32 + (66 - 32) * ((w - 600) / (1024 - 600))), 66)
    : responsive(w, 28, Math.round(28 + (88 - 28) * ((w - 600) / (1024 - 600))), 88);
  const left = isHome
    ? responsive(w, 25, Math.round(25 + (100 - 25) * ((w - 600) / (1024 - 600))), 100)
    : responsive(w, 20, Math.round(20 + (60 - 20) * ((w - 600) / (1024 - 600))), 60);
  const top = isHome
    ? responsive(w, 320, Math.round(320 + (460 - 320) * ((w - 600) / (1024 - 600))), 460)
    : responsive(w, 20, Math.round(20 + (50 - 20) * ((w - 600) / (1024 - 600))), 50);
  const chevronWidth = isHome ? 55 : responsive(w, 29, Math.round(29 + (55 - 29) * ((w - 600) / (1024 - 600))), 55);

  return (
    <motion.div
      layout
      layoutId="prints-nav"
      className="shared-prints-header"
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize,
        fontWeight: 900,
        color: '#1a1a1a',
        letterSpacing: '0.085em',
        fontFamily: 'Martian Mono, Courier New, Courier, monospace',
      }}
      onClick={() => goTo(isHome ? 'prints-for-sale' : 'home')}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={HEADER_ANIMATION}
    >
      <span>prints</span>
      <motion.img
        src="/GlassyObjects/About/Chevron.png"
        alt="chevron"
        className="chevron-img"
        layoutId="prints-chevron"
        style={{
          width: chevronWidth,
          marginLeft: 8,
          marginTop: 0,
        }}
        initial={false}
        animate={{ width: chevronWidth, rotate: isHome ? 0 : 90 }}
        transition={HEADER_ANIMATION}
      />
    </motion.div>
  );
};

const SharedRealtimeHeader = ({ page, goTo, windowWidth }) => {
  const isHome = page === 'home';
  const w = windowWidth;

  if (!(page === 'home' || page === 'realtime-artwork')) return null;

  const fontSize = isHome
    ? responsive(w, 32, Math.round(32 + (66 - 32) * ((w - 600) / (1024 - 600))), 66)
    : responsive(w, 28, Math.round(28 + (88 - 28) * ((w - 600) / (1024 - 600))), 88);
  const left = isHome
    ? responsive(w, 25, Math.round(25 + (100 - 25) * ((w - 600) / (1024 - 600))), 100)
    : responsive(w, 20, Math.round(20 + (60 - 20) * ((w - 600) / (1024 - 600))), 60);
  const top = isHome
    ? responsive(w, 360, Math.round(360 + (540 - 360) * ((w - 600) / (1024 - 600))), 540)
    : responsive(w, 20, Math.round(20 + (50 - 20) * ((w - 600) / (1024 - 600))), 50);
  const chevronWidth = isHome ? 55 : responsive(w, 29, Math.round(29 + (55 - 29) * ((w - 600) / (1024 - 600))), 55);

  return (
    <motion.div
      layout
      layoutId="realtime-nav"
      className="shared-realtime-header"
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize,
        fontWeight: 900,
        color: '#1a1a1a',
        letterSpacing: '0.085em',
        fontFamily: 'Martian Mono, Courier New, Courier, monospace',
      }}
      onClick={() => goTo(isHome ? 'realtime-artwork' : 'home')}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={HEADER_ANIMATION}
    >
      <span>realtime 3D</span>
      <motion.img
        src="/GlassyObjects/About/Chevron.png"
        alt="chevron"
        className="chevron-img"
        layoutId="realtime-chevron"
        style={{
          width: chevronWidth,
          marginLeft: 8,
          marginTop: 0,
        }}
        initial={false}
        animate={{ width: chevronWidth, rotate: isHome ? 0 : 90 }}
        transition={HEADER_ANIMATION}
      />
    </motion.div>
  );
};

const SharedProfessionalHeader = ({ page, goTo, windowWidth }) => {
  const isHome = page === 'home';
  const w = windowWidth;

  if (!(page === 'home' || page === 'professional-work')) return null;

  const fontSize = isHome
    ? responsive(w, 32, Math.round(32 + (66 - 32) * ((w - 600) / (1024 - 600))), 66)
    : responsive(w, 28, Math.round(28 + (88 - 28) * ((w - 600) / (1024 - 600))), 88);
  const left = isHome
    ? responsive(w, 25, Math.round(25 + (100 - 25) * ((w - 600) / (1024 - 600))), 100)
    : responsive(w, 20, Math.round(20 + (60 - 20) * ((w - 600) / (1024 - 600))), 60);
  const top = isHome
    ? responsive(w, 400, Math.round(400 + (620 - 400) * ((w - 600) / (1024 - 600))), 620)
    : responsive(w, 20, Math.round(20 + (50 - 20) * ((w - 600) / (1024 - 600))), 50);
  const chevronWidth = isHome ? 55 : responsive(w, 29, Math.round(29 + (55 - 29) * ((w - 600) / (1024 - 600))), 55);

  return (
    <motion.div
      layout
      layoutId="professional-nav"
      className="shared-professional-header"
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize,
        fontWeight: 900,
        color: '#1a1a1a',
        letterSpacing: '0.085em',
        fontFamily: 'Martian Mono, Courier New, Courier, monospace',
      }}
      onClick={() => goTo(isHome ? 'professional-work' : 'home')}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={HEADER_ANIMATION}
    >
      <span>professional</span>
      <motion.img
        src="/GlassyObjects/About/Chevron.png"
        alt="chevron"
        className="chevron-img"
        layoutId="professional-chevron"
        style={{
          width: chevronWidth,
          marginLeft: 8,
          marginTop: 0,
        }}
        initial={false}
        animate={{ width: chevronWidth, rotate: isHome ? 0 : 90 }}
        transition={HEADER_ANIMATION}
      />
    </motion.div>
  );
};

// Cart Icon Component for navigation
const CartIconNav = ({ page, goTo, windowWidth }) => {
  const isMobile = windowWidth <= 600;

  if (!(page === 'home' || page === 'prints-for-sale' || page === 'realtime-artwork' || page === 'professional-work' || page === 'cart')) return null;

  return (
    <motion.div
      className="cart-icon-nav"
      style={{
        position: 'fixed',
        ...(isMobile ? { left: 20 } : { right: 60 }),
        bottom: isMobile ? 20 : 50,
        zIndex: 9999,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={HEADER_ANIMATION}
    >
      <CartIcon onClick={() => goTo('cart')} isMobile={isMobile} />
    </motion.div>
  );
};

// Main App component with routing
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modelViewerOpen, setModelViewerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const windowWidth = useWindowWidth();

  // Use custom scroll restoration hook
  useScrollToTop();
  
  // Get current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/prints-for-sale') return 'prints-for-sale';
    if (path === '/realtime-artwork') return 'realtime-artwork';
    if (path === '/professional-work') return 'professional-work';
    if (path === '/cart') return 'cart';
    if (path === '/checkout-success') return 'checkout-success';
    if (path.startsWith('/game/')) return 'game';
    return 'home';
  };
  
  const currentPage = getCurrentPage();
  const isGamePage = currentPage === 'game';
  const isCheckoutSuccess = currentPage === 'checkout-success';

  const goTo = (target) => {
    if (target === 'home') {
      navigate('/');
    } else if (target === 'prints-for-sale') {
      navigate('/prints-for-sale');
    } else if (target === 'realtime-artwork') {
      navigate('/realtime-artwork');
    } else if (target === 'professional-work') {
      navigate('/professional-work');
    } else if (target === 'cart') {
      navigate('/cart');
    }
  };

  // Expose goToHome globally for PersonFigure click-to-home
  useEffect(() => {
    window.goToHome = () => goTo('home');
    return () => { window.goToHome = undefined; };
  }, [navigate]);

  // Fade style for header and PersonFigure
  const fadeStyle = (modelViewerOpen || checkoutOpen) ? { opacity: 0, pointerEvents: 'none', transition: 'opacity 0.4s cubic-bezier(.4,2,.6,1)' } : {};

  return (
    <div className="relative z-0 bg-primary" style={{ 
      minHeight: '100vh', 
      position: 'relative'
    }}>
      {/* Only show navigation headers and PersonFigure on home/work/cart pages, not on game or checkout-success pages */}
      {!isGamePage && !isCheckoutSuccess && (
        <div style={fadeStyle}>
          <SharedPrintsHeader key="prints-header" page={currentPage} goTo={goTo} windowWidth={windowWidth} />
          <SharedRealtimeHeader key="realtime-header" page={currentPage} goTo={goTo} windowWidth={windowWidth} />
          <SharedProfessionalHeader key="professional-header" page={currentPage} goTo={goTo} windowWidth={windowWidth} />
          <CartIconNav key="cart-icon" page={currentPage} goTo={goTo} windowWidth={windowWidth} />
          <PersonFigure page={currentPage} />
        </div>
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
              <Home goTo={goTo} hidePrintsNav hideRealtimeNav hideProfessionalNav />
            </motion.div>
          } />
          <Route path="/prints-for-sale" element={
            <motion.div
              key="prints-for-sale"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={PAGE_BOUNCE}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <PrintsForSale goTo={goTo} hideNav onModelViewerOpenChange={setModelViewerOpen} />
            </motion.div>
          } />
          <Route path="/realtime-artwork" element={
            <motion.div
              key="realtime-artwork"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={PAGE_BOUNCE}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <RealtimeArtwork goTo={goTo} hideNav onModelViewerOpenChange={setModelViewerOpen} />
            </motion.div>
          } />
          <Route path="/professional-work" element={
            <motion.div
              key="professional-work"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={PAGE_BOUNCE}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <ProfessionalWork goTo={goTo} hideNav />
            </motion.div>
          } />
          <Route path="/cart" element={
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={PAGE_BOUNCE}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <CartPage goTo={goTo} onCheckoutOpenChange={setCheckoutOpen} />
            </motion.div>
          } />
          <Route path="/checkout-success" element={
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={PAGE_BOUNCE}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <CheckoutSuccess goTo={goTo} />
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
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
};

export default App;
