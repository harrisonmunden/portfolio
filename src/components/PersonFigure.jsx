import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimation, animate } from 'framer-motion';

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
        desktop: 240,
        mobile: 190 // Smaller head for mobile home page
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

  const MAX_HEADS = 20; // Set this to a safe upper bound for your use case
  const headMotionValues = [
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
    { x: useMotionValue(0), y: useMotionValue(0) },
  ];

  // For the shared head
  const sharedHeadMotion = useMotionValue(0);
  const sharedHeadYMotion = useMotionValue(0);

  // Influence factors for neighbors
  const influence = [1, 0.6, 0.3, 0.1]; // 0 = self, 1 = closest, etc.

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const LIMIT = 120; // max pixels of drag
  const scale = (v) => LIMIT * Math.tanh(v / LIMIT);

  // Handler for drag
  const handleDrag = (index, event, info) => {
    // Debug: log drag event
    // console.log('Dragging head', index, 'offset:', info.offset);
    // Framer Motion handles the dragged head's x/y
    // We update neighbors here
    const scaledX = scale(info.offset.x);
    const scaledY = scale(info.offset.y);
    if (index === 'home') {
      sharedHeadMotion.set(scaledX);
      sharedHeadYMotion.set(scaledY);
    }
    influence.forEach((factor, i) => {
      if (i === 0) return; // skip self, Framer handles
      const plus = index + i;
      const minus = index - i;
      [plus, minus].forEach((neighborIdx) => {
        if (neighborIdx >= 0 && neighborIdx < CONFIG.numHeads) {
          headMotionValues[neighborIdx].x.set(scaledX * factor);
          headMotionValues[neighborIdx].y.set(scaledY * factor);
        }
      });
    });
  };

  const handleDragStart = (index) => {
    console.log('Drag start on head', index);
    setDraggedIndex(index);
    setDragOffset({ x: 0, y: 0 });
  };

  const SPRING_CONFIG = { type: 'spring', stiffness: 350, damping: 18 };

  const handleDragEnd = (index) => {
    console.log('Drag end on head', index);
    setDraggedIndex(null);
    // Spring all heads back to 0
    headMotionValues.forEach((ref) => {
      animate(ref.x, 0, SPRING_CONFIG);
      animate(ref.y, 0, SPRING_CONFIG);
    });
  };

  // Helper to get offset for a head based on drag state
  const getHeadOffset = (index) => {
    if (draggedIndex == null) return { x: 0, y: 0 };
    const dist = Math.abs(index - draggedIndex);
    if (dist >= influence.length) return { x: 0, y: 0 };
    return {
      x: dragOffset.x * influence[dist],
      y: dragOffset.y * influence[dist],
    };
  };

  // Generate wave positions
  const generateWavePositions = () => {
    const positions = [];
    const screenWidth = window.innerWidth;
    const totalWidth = screenWidth + Math.abs(CONFIG.startX) * 2; // Account for negative padding
    const spacing = totalWidth / (CONFIG.numHeads - 1);
    const amplitude = isMobile ? 40 : CONFIG.waveAmplitude; // Lower amplitude on mobile
    
    for (let i = 0; i < CONFIG.numHeads; i++) {
      const x = CONFIG.startX + (i * spacing);
      const waveY = Math.sin((i + CONFIG.waveOffset) * CONFIG.waveFrequency) * amplitude;
      const y = CONFIG.waveHeight + waveY;
      const startY = Math.random() * (CONFIG.startYRange.max - CONFIG.startYRange.min) + CONFIG.startYRange.min;
      const delay = i * CONFIG.delayIncrement;
      
      positions.push({ x, y, startY, delay, index: i });
    }
    
    return positions;
  };

  // After isMobileHead is defined, but before any use of homeHeadX/homeHeadY
  const isMobileHead = isMobile;
  const homeHeadWidth = isMobileHead ? CONFIG.headSize.home.mobile : CONFIG.headSize.home.desktop;
  const homeHeadHeight = isMobileHead ? CONFIG.headSize.home.mobile : CONFIG.headSize.home.desktop;
  const homeHeadX = window.innerWidth * (isMobileHead ? 0.48 : 0.68); // Centered on mobile, 68% on desktop
  const homeHeadY = isMobileHead
    ? window.innerHeight * 0.55 // 55% down from the top for mobile
    : window.innerHeight - 520; // existing value for desktop

  // Generate wave positions
  const wavePositions = generateWavePositions();
  
  // Find the wave position closest to the home head's X position for vertical-only movement
  let closestWaveIndex = 0;
  let minDistance = Math.abs(wavePositions[0].x - homeHeadX);
  for (let i = 1; i < wavePositions.length; i++) {
    const distance = Math.abs(wavePositions[i].x - homeHeadX);
    // Prefer later index if distance is equal
    if (distance < minDistance || (distance === minDistance && i > closestWaveIndex)) {
      minDistance = distance;
      closestWaveIndex = i;
    }
  }
  
  const sharedHeadWaveIndex = closestWaveIndex;
  const sharedHeadPosition = wavePositions[sharedHeadWaveIndex];
  
  // Use the wave position Y for the shared head
  const waveHeadY = sharedHeadPosition.y;

  // Snap back shared head on home drag end
  const handleSharedHeadDragEnd = () => {
    animate(sharedHeadMotion, 0, { type: 'spring', stiffness: 300, damping: 30 });
    animate(sharedHeadYMotion, 0, { type: 'spring', stiffness: 300, damping: 30 });
    setDraggedIndex(null);
  };

  // Always reset shared head x/y on work/about
  useEffect(() => {
    if (!isHome) {
      sharedHeadMotion.set(0);
      sharedHeadYMotion.set(0);
    }
  }, [isHome]);

  const DRAG_THRESHOLD = 8;
  const [dragActive, setDragActive] = useState({}); // { index: true/false }
  const dragStartPos = useRef({});
  const navTargetRef = useRef({});
  const NAV_CLICK_THRESHOLD = 8; // px

  // Utility: check if a point is inside a DOMRect
  function pointInRect(x, y, rect) {
    return (
      x >= rect.left && x <= rect.right &&
      y >= rect.top && y <= rect.bottom
    );
  }
  // Utility: check if two rects overlap
  function rectsOverlap(r1, r2) {
    return !(
      r1.right < r2.left ||
      r1.left > r2.right ||
      r1.bottom < r2.top ||
      r1.top > r2.bottom
    );
  }

  const handlePointerDown = (index, e) => {
    const point = e.touches ? e.touches[0] : e;
    // Get head image rect
    const headImg = e.currentTarget;
    const headRect = headImg.getBoundingClientRect();
    // Get nav target rects
    const navRects = [];
    document.querySelectorAll('.about-title, .works-main-title, .chevron-img').forEach(el => {
      navRects.push(el.getBoundingClientRect());
    });
    // Check if any nav rect overlaps the head rect
    const overlapsNav = navRects.some(navRect => rectsOverlap(headRect, navRect));
    navTargetRef.current[index] = overlapsNav;
    dragStartPos.current[index] = { x: point.clientX, y: point.clientY };
    setDragActive((prev) => ({ ...prev, [index]: false }));
  };

  const handlePointerMove = (index, e) => {
    if (dragActive[index]) return; // already active
    const point = e.touches ? e.touches[0] : e;
    const start = dragStartPos.current[index];
    if (!start) return;
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
      setDragActive((prev) => ({ ...prev, [index]: true }));
    }
  };

  const handlePointerUp = (index, e) => {
    const point = e.touches ? e.touches[0] : e;
    const start = dragStartPos.current[index];
    setDragActive((prev) => ({ ...prev, [index]: false }));
    dragStartPos.current[index] = null;
    // --- NAV CLICK LOGIC ---
    // Recompute overlap in case of scroll/move
    const headImg = e.currentTarget;
    const headRect = headImg.getBoundingClientRect();
    const navRects = [];
    document.querySelectorAll('.about-title, .works-main-title, .chevron-img').forEach(el => {
      navRects.push(el.getBoundingClientRect());
    });
    const overlapsNav = navRects.some(navRect => rectsOverlap(headRect, navRect));
    if (overlapsNav && start) {
      const dx = point.clientX - start.x;
      const dy = point.clientY - start.y;
      if (Math.sqrt(dx * dx + dy * dy) < NAV_CLICK_THRESHOLD) {
        if (typeof window.goToHome === 'function') {
          window.goToHome();
        }
      }
    }
    navTargetRef.current[index] = false;
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
      {/* Shared Head - Always Visible (like shared headers) */}
      {/* Always render the persistent head with layoutId */}
      <motion.img
        layoutId="shared-head"
                          src="/GlassyObjects/About/Head.webp"
        alt="Head"
        drag
        dragMomentum={false}
        dragElastic={0.5}
        style={{
          position: 'absolute',
          width: isHome
            ? (isMobile ? CONFIG.headSize.home.mobile : CONFIG.headSize.home.desktop)
            : (isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop),
          height: isHome
            ? (isMobile ? CONFIG.headSize.home.mobile : CONFIG.headSize.home.desktop)
            : (isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop),
          maxWidth: isHome
            ? (isMobile ? CONFIG.headSize.home.mobile : CONFIG.headSize.home.desktop)
            : (isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop),
          maxHeight: isHome
            ? (isMobile ? CONFIG.headSize.home.mobile : CONFIG.headSize.home.desktop)
            : (isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop),
          left: isHome ? `${homeHeadX}px` : `${sharedHeadPosition.x}px`,
          top: isHome ? `${homeHeadY}px` : `${waveHeadY}px`,
          opacity: isHome ? 1 : CONFIG.opacity,
          zIndex: 5,
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
          pointerEvents: 'auto',
          x: isHome ? sharedHeadMotion : headMotionValues[sharedHeadWaveIndex].x,
          y: isHome ? sharedHeadYMotion : headMotionValues[sharedHeadWaveIndex].y,
        }}
        onPointerDown={(e) => handlePointerDown(isHome ? 'home' : sharedHeadWaveIndex, e)}
        onPointerMove={(e) => handlePointerMove(isHome ? 'home' : sharedHeadWaveIndex, e)}
        onPointerUp={(e) => handlePointerUp(isHome ? 'home' : sharedHeadWaveIndex, e)}
        onDragStart={() => isHome ? handleDragStart('home') : handleDragStart(sharedHeadWaveIndex)}
        onDragEnd={() => isHome ? handleSharedHeadDragEnd() : handleDragEnd(sharedHeadWaveIndex)}
        onDrag={(e, info) => {
          if (isHome) {
            sharedHeadMotion.set(scale(info.offset.x));
            sharedHeadYMotion.set(scale(info.offset.y));
          } else {
            handleDrag(sharedHeadWaveIndex, e, info);
          }
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
              left: isMobile
                ? `calc(43vw)` // Center the body under the head (60vw/2)
                : `${homeHeadX - 10}px`,
              top: isMobile
                ? `${homeHeadY + (CONFIG.headSize.home.mobile * 0.94)}px` // Slightly more spacing for mobile
                : `${homeHeadY + (CONFIG.headSize.home.desktop * 0.85)}px`,
              width: isMobile ? '60vw' : 'auto',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {/* Body */}
            <motion.img
              src="/GlassyObjects/About/Body.webp"
              alt="Body"
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: isMobile ? '60vw' : CONFIG.bodySize.desktop,
                maxHeight: isMobile ? '50vh' : CONFIG.bodySize.desktop * 1.33,
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
              if (index === sharedHeadWaveIndex) return null;
              const isDragged = draggedIndex === index;
              return (
                <motion.img
                  key={`head-${index}`}
                  src="/GlassyObjects/About/Head.webp"
                  alt="Head"
                  drag
                  onPointerDown={(e) => handlePointerDown(index, e)}
                  onPointerMove={(e) => handlePointerMove(index, e)}
                  onPointerUp={(e) => handlePointerUp(index, e)}
                  style={{
                    position: 'absolute',
                    width: isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop,
                    height: isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop,
                    maxWidth: isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop,
                    maxHeight: isMobile ? CONFIG.headSize.mobile : CONFIG.headSize.desktop,
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    opacity: CONFIG.opacity,
                    zIndex: isDragged ? 20 : 5,
                    cursor: 'grab',
                    userSelect: 'none',
                    touchAction: 'none',
                    pointerEvents: 'auto',
                    x: headMotionValues[index].x,
                    y: headMotionValues[index].y,
                  }}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={() => handleDragEnd(index)}
                  onDrag={(e, info) => handleDrag(index, e, info)}
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