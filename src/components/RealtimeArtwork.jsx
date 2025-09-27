import React, { useState, useRef, useEffect } from 'react';
import './Works.css';
import { motion } from 'framer-motion';
import ModelViewer from './ModelViewer';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

const videoGames = [
  { id: 1, src: '/VideoGameAssets/PaparazziEscapeCover.png', thumbnailSrc: '/VideoGameAssets/PaparazziEscapeCover-compressed.webp', alt: 'Paparazzi Escape', title: 'Paparazzi Escape', route: '/game/paparazzi-escape' },
  { id: 2, src: '/VideoGameAssets/BusyGirlCover.png', thumbnailSrc: '/VideoGameAssets/BusyGirlCover-compressed.webp', alt: 'Busy Girl', title: 'Busy Girl', route: '/game/busy-girl' },
  { id: 3, src: '/VideoGameAssets/MaestroCover.png', thumbnailSrc: '/VideoGameAssets/MaestroCover-compressed.webp', alt: 'Maestro', title: 'Maestro', route: '/game/maestro' },
];

const modelTiles = [
  {
    id: 1,
    label: 'Car Model',
    title: 'Car Model',
    img: '/3DModels/CarCover-compressed.webp',
    modelPath: '/3DModels/Car.glb',
    texturePath: '/3DModels/CarAlbedo.png'
  },
  {
    id: 2,
    label: 'Motorcycle Model',
    title: 'Motorcycle Model',
    img: '/3DModels/MotorcycleCover-compressed.webp',
    modelPath: '/3DModels/Motorcycle.glb',
    texturePath: '/3DModels/MotorcycleAlbedo.png'
  },
  {
    id: 3,
    label: 'Flowers Model',
    title: 'Flowers Model',
    img: '/3DModels/FlowersCover-compressed.webp',
    modelPath: '/3DModels/Flowers.glb',
    texturePath: '/3DModels/FlowersTexture.png'
  },
  {
    id: 4,
    label: 'Purse Model',
    title: 'Purse Model',
    img: '/3DModels/PurseCover-compressed.webp',
    modelPath: '/3DModels/Purse1.glb',
    texturePath: '/3DModels/Purse1Texture.png'
  },
];

const RealtimeArtwork = ({ goTo, hideNav, onModelViewerOpenChange }) => {
  const navigate = useNavigate();
  const [modelViewerOpen, setModelViewerOpen] = useState(false);
  const [modelViewerProps, setModelViewerProps] = useState({});
  
  // Refs for scroll-to-home functionality
  const hasScrolledUp = useRef(false);
  const scrollUpCount = useRef(0);
  const lastScrollY = useRef(0);
  
  // Use custom scroll restoration hook
  useScrollToTop();

  // Moderately controlled scroll-to-home: Only when AT TOP + two aggressive scroll ups
  useEffect(() => {
    let scrollUpCount = 0;
    let resetTimeout = null;
    
    const handleWheel = (e) => {
      // Only when already at the very top of the page
      if (window.scrollY > 0) {
        scrollUpCount = 0;
        return;
      }
      
      // Detect aggressive scroll up (moderate threshold)
      if (e.deltaY < -80) { // Moderate threshold (between -50 and -120)
        scrollUpCount++;
        
        // Clear any existing timeout
        if (resetTimeout) {
          clearTimeout(resetTimeout);
        }
        
        // Require TWO aggressive scroll ups
        if (scrollUpCount >= 2) {
          if (goTo) {
            goTo('home');
          }
          scrollUpCount = 0; // Reset after successful trigger
        } else {
          // Moderate timeout - reasonable timing
          resetTimeout = setTimeout(() => {
            scrollUpCount = 0;
          }, 1200); // Moderate timing between 800ms and 2000ms
        }
      }
    };

    const handleScroll = () => {
      // Reset immediately if user scrolls down from top
      if (window.scrollY > 0) {
        scrollUpCount = 0;
        if (resetTimeout) {
          clearTimeout(resetTimeout);
          resetTimeout = null;
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, [goTo]);

  useEffect(() => {
    if (onModelViewerOpenChange) {
      onModelViewerOpenChange(modelViewerOpen);
    }
  }, [modelViewerOpen, onModelViewerOpenChange]);

  return (
    <div className="works-page">
      {/* Header */}
      <div className="works-header">
        {!hideNav && (
          <motion.h1
            className="works-main-title"
            onClick={() => goTo && goTo('home')}
            style={{ 
              cursor: goTo ? 'pointer' : 'default', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px'
            }}
          >
            <span>Realtime Artwork</span>
            <motion.img 
              src="/GlassyObjects/About/Chevron.png" 
              alt="chevron" 
              className="chevron-img"
            />
          </motion.h1>
        )}
      </div>

      {/* Interactive 3D Models Section */}
      <h2 className="section-title models-title">Interactive 3D Models</h2>
      <div className="models-row">
        {modelTiles.map((tile) => (
          <div
            key={tile.id}
            className="model-tile"
            onClick={() => {
              setModelViewerProps({ 
                modelPath: tile.modelPath, 
                texturePath: tile.texturePath,
                title: tile.title
              });
              setModelViewerOpen(true);
            }}
          >
            <img src={tile.img} alt={tile.label} className="model-tile-img" loading="lazy" />
          </div>
        ))}
      </div>
      {modelViewerOpen && (
        <ModelViewer
          modelPath={modelViewerProps.modelPath}
          texturePath={modelViewerProps.texturePath}
          onClose={() => setModelViewerOpen(false)}
          title={modelViewerProps.title || "3D Model Viewer"}
        />
      )}

      {/* Video Games Section */}
      <h2 className="section-title video-games-title">Video Games</h2>
      <div className="video-games-row">
        {videoGames.map((game) => (
          <div
            key={game.id}
            className="video-game-tile"
            onClick={() => navigate(game.route)}
            style={{ cursor: 'pointer' }}
          >
            <img src={game.thumbnailSrc} alt={game.alt} className="model-tile-img" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealtimeArtwork;

