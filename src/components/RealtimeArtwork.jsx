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
  
  // Use custom scroll restoration hook
  useScrollToTop();

  // Add sticky scroll-to-home functionality
  useEffect(() => {
    if (!goTo) return;

    let scrollUpCount = 0;
    const threshold = 30; // Pixels above the page to trigger transition

    const handleWheel = (e) => {
      if (hasScrolledUp.current) return;
      
      // Track scroll up beyond the top of the page
      if (e.deltaY < 0 && window.scrollY === 0) {
        const scrollAbovePage = Math.abs(e.deltaY);
        
        if (scrollAbovePage >= threshold) {
          scrollUpCount++;
          
          if (scrollUpCount >= 3) {
            hasScrolledUp.current = true;
            goTo('home');
          }
        }
      } else if (e.deltaY > 0 || window.scrollY > 0) {
        // Reset count if scrolling down or not at top
        scrollUpCount = 0;
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    
    return () => {
      document.removeEventListener('wheel', handleWheel, { passive: false, capture: true });
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
