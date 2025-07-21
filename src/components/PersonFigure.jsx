import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PersonFigure = ({ page }) => {
  const [isMobile, setIsMobile] = useState(false);
  const isHome = page === 'home';
  const isWork = page === 'work';
  const isAbout = page === 'about';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const CONFIG = {
    startYRange: { min: 300, max: 700 }, // Random starting Y position range
    delayIncrement: 0.0, // Small delay between each head animation
    headSize: {
      desktop: 160,
      mobile: 50,
      home: {
        desktop: 750,
        mobile: 150
      }
    },
    bodySize: {
      desktop: 250,
      mobile: 180
    },
    opacity: 0.7,
    waveHeight: 20, // Reduced from 150 to move heads up
    waveAmplitude: 100, // Increased from 100 to make wave more visible
    waveFrequency: 0.6, // Increased from 0.02 to make wave more pronounced
    waveOffset: 1.1, // Control the wave shape offset (0 = normal, positive = shifted right, negative = shifted left)
    numHeads: 12,
    startX: -50, // Start from left with negative padding
  };

  const HEADER_ANIMATION = {
    type: "spring",
    stiffness: 200,
    damping: 13,
    duration: 0.6
  };

  // Generate wave positions
  const generateWavePositions = () => {
    const positions = [];
    const screenWidth = window.innerWidth;
    const totalWidth = screenWidth + Math.abs(CONFIG.startX) * 2; // Account for negative padding
    const spacing = totalWidth / (CONFIG.numHeads - 1);
    
    for (let i = 0; i < CONFIG.numHeads; i++) {
      const x = CONFIG.startX + (i * spacing);
      const waveY = Math.sin((i + CONFIG.waveOffset) * CONFIG.waveFrequency) * CONFIG.waveAmplitude;
      const y = CONFIG.waveHeight + waveY;
      const startY = Math.random() * (CONFIG.startYRange.max - CONFIG.startYRange.min) + CONFIG.startYRange.min;
      const delay = i * CONFIG.delayIncrement;
      
      positions.push({ x, y, startY, delay, index: i });
    }
    
    return positions;
  };

  const wavePositions = generateWavePositions();
  
  // Calculate home page head position
  const homeHeadX = window.innerWidth * 0.7; // 70% from left for home position
  const homeHeadY = window.innerHeight - 450; // Increased from 200 to move head higher
  
  // Find the wave position closest to the home head's X position for vertical-only movement
  let closestWaveIndex = 0;
  let minDistance = Math.abs(wavePositions[0].x - homeHeadX);
  
  for (let i = 1; i < wavePositions.length; i++) {
    const distance = Math.abs(wavePositions[i].x - homeHeadX);
    if (distance < minDistance) {
      minDistance = distance;
      closestWaveIndex = i;
    }
  }
  
  const sharedHeadWaveIndex = closestWaveIndex;
  const sharedHeadPosition = wavePositions[sharedHeadWaveIndex];
  
  // Use the wave position Y for the shared head
  const waveHeadY = sharedHeadPosition.y;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
      {/* Shared Head - Always Visible (like shared headers) */}
      <motion.img
        layout
        layoutId="shared-head"
        src="/src/assets/GlassyObjects/About/Head.webp"
        alt="Head"
        style={{
          position: 'absolute',
          width: 'auto',
          height: 'auto',
          maxWidth: isHome ? (isMobile ? CONFIG.headSize.home.mobile : CONFIG.headSize.home.desktop) : (isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop),
          maxHeight: isHome ? (isMobile ? CONFIG.headSize.home.mobile : CONFIG.headSize.home.desktop) : (isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop),
          left: isHome ? `${homeHeadX}px` : `${sharedHeadPosition.x}px`, // Use calculated X positions
          top: isHome ? `${homeHeadY}px` : `${waveHeadY}px`, // Use calculated Y positions
          opacity: isHome ? 1 : CONFIG.opacity,
          zIndex: 2,
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isHome ? 1 : CONFIG.opacity }}
        exit={{ opacity: 0 }}
        transition={HEADER_ANIMATION}
      />

      <AnimatePresence mode="sync">
        {/* Home Page: Body Only */}
        {isHome && (
          <motion.div
            key="home-person"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              left: `${homeHeadX - (isMobile ? 20 : 23)}px`,
              top: `${homeHeadY + (isMobile ? CONFIG.headSize.home.mobile * 0.8 : CONFIG.headSize.home.desktop * 0.25)}px`,
              width: 'auto',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {/* Body */}
            <motion.img
              src="/src/assets/GlassyObjects/About/Body.webp"
              alt="Body"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: isMobile ? CONFIG.bodySize.mobile : CONFIG.bodySize.desktop,
                maxHeight: isMobile ? CONFIG.bodySize.mobile * 1.33 : CONFIG.bodySize.desktop * 1.33,
                zIndex: 1,
                filter: 'blur(0px)', // No blur for home page person
              }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...HEADER_ANIMATION, delay: 0.1 }}
            />
          </motion.div>
        )}

        {/* Work/About Pages: Additional Wave Heads */}
        {(isWork || isAbout) && (
          <motion.div
            key="wave-heads"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Additional heads in the wave (excluding the shared head position) */}
            {wavePositions.map((pos, index) => {
              if (index === sharedHeadWaveIndex) return null; // Skip the shared head position
              return (
                <motion.img
                  key={`head-${index}`}
                  src="/src/assets/GlassyObjects/About/Head.webp"
                  alt="Head"
                  style={{
                    position: 'absolute',
                    width: 'auto',
                    height: 'auto',
                    maxWidth: isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop,
                    maxHeight: isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop,
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    opacity: CONFIG.opacity,
                  }}
                  initial={{ 
                    y: pos.startY,
                    opacity: 0,
                  }}
                  animate={{ 
                    y: 0,
                    opacity: CONFIG.opacity,
                  }}
                  exit={{ 
                    y: pos.startY,
                    opacity: 0,
                  }}
                  transition={{
                    ...HEADER_ANIMATION,
                    delay: pos.delay,
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonFigure; 