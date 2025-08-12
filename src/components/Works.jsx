import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Works.css';
import { motion } from 'framer-motion';
import { useFadeInOnVisible } from './hooks/useFadeInOnVisible';
import ModelViewer from './ModelViewer';

let globalVisibleCount = 8; // or your BATCH_SIZE

const videoGames = [
  { id: 1, src: '/3DArtwork/BusyGirlCover.png', thumbnailSrc: '/3DArtwork/thumbnails/BusyGirlCover.webp', alt: 'Escape Game', border: 'blue' },
  { id: 2, src: '/3DArtwork/Flower.png', thumbnailSrc: '/3DArtwork/thumbnails/Flower.webp', alt: 'Flower Game', border: 'yellow' },
  { id: 3, src: '/3DArtwork/HerProfilePhoto.png', thumbnailSrc: '/3DArtwork/thumbnails/HerProfilePhoto.webp', alt: 'Bossy Girl', border: 'pink' },
];

const artwork = [
  { id: 1, src: '/3DArtwork/AppleTree-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/AppleTree.webp', alt: 'Apple Tree', title: 'Apple Tree', year: '2023' },
  { id: 2, src: '/3DArtwork/BusyGirlCover.png', thumbnailSrc: '/3DArtwork/thumbnails/BusyGirlCover.webp', alt: 'Busy Girl Cover', title: 'Busy Girl Cover', year: '2023' },
  { id: 3, src: '/3DArtwork/Chess4 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Chess4 copy.webp', alt: 'Chess 4', title: 'Chess 4', year: '2023' },
  { id: 4, src: '/3DArtwork/Chess5 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Chess5 copy.webp', alt: 'Chess 5', title: 'Chess 5', year: '2023' },
  { id: 5, src: '/3DArtwork/Computer4 copy-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Computer4 copy.webp', alt: 'Computer 4', title: 'Computer 4', year: '2023' },
  { id: 6, src: '/3DArtwork/Crown.png', thumbnailSrc: '/3DArtwork/thumbnails/Crown.webp', alt: 'Crown', title: 'Crown', year: '2023' },
  { id: 7, src: '/3DArtwork/Falcon.png', thumbnailSrc: '/3DArtwork/thumbnails/Falcon.webp', alt: 'Falcon', title: 'Falcon', year: '2023' },
  { id: 8, src: '/3DArtwork/feathers3 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/feathers3 copy.webp', alt: 'Feathers 3', title: 'Feathers 3', year: '2023' },
  { id: 9, src: '/3DArtwork/Flower.png', thumbnailSrc: '/3DArtwork/thumbnails/Flower.webp', alt: 'Flower', title: 'Flower', year: '2023' },
  { id: 10, src: '/3DArtwork/GoldenHill.png', thumbnailSrc: '/3DArtwork/thumbnails/GoldenHill.webp', alt: 'Golden Hill', title: 'Golden Hill', year: '2023' },
  { id: 11, src: '/3DArtwork/Grass.png', thumbnailSrc: '/3DArtwork/thumbnails/Grass.webp', alt: 'Grass', title: 'Grass', year: '2023' },
  { id: 12, src: '/3DArtwork/H6.png', thumbnailSrc: '/3DArtwork/thumbnails/H6.webp', alt: 'H6', title: 'H6', year: '2023' },
  { id: 13, src: '/3DArtwork/hawk.png', thumbnailSrc: '/3DArtwork/thumbnails/hawk.webp', alt: 'Hawk', title: 'Hawk', year: '2023' },
  { id: 14, src: '/3DArtwork/HerProfilePhoto.png', thumbnailSrc: '/3DArtwork/thumbnails/HerProfilePhoto.webp', alt: 'Her Profile Photo', title: 'Her Profile Photo', year: '2023' },
  { id: 15, src: '/3DArtwork/Hfinal.png', thumbnailSrc: '/3DArtwork/thumbnails/Hfinal.webp', alt: 'Hfinal', title: 'Hfinal', year: '2023' },
  { id: 16, src: '/3DArtwork/JulipCD.png', thumbnailSrc: '/3DArtwork/thumbnails/JulipCD.webp', alt: 'Julip CD', title: 'Julip CD', year: '2023' },
  { id: 17, src: '/3DArtwork/MODELWALK.png', thumbnailSrc: '/3DArtwork/thumbnails/MODELWALK.webp', alt: 'Model Walk', title: 'Model Walk', year: '2023' },
  { id: 18, src: '/3DArtwork/PeacockSide.png', thumbnailSrc: '/3DArtwork/thumbnails/PeacockSide.webp', alt: 'Peacock Side', title: 'Peacock Side', year: '2023' },
  { id: 19, src: '/3DArtwork/PrayingMantis.png', thumbnailSrc: '/3DArtwork/thumbnails/PrayingMantis.webp', alt: 'Praying Mantis', title: 'Praying Mantis', year: '2023' },
  { id: 20, src: '/3DArtwork/profile.png', thumbnailSrc: '/3DArtwork/thumbnails/profile.webp', alt: 'Profile', title: 'Profile', year: '2023' },
  { id: 21, src: '/3DArtwork/ROCKET.png', thumbnailSrc: '/3DArtwork/thumbnails/ROCKET.webp', alt: 'Rocket', title: 'Rocket', year: '2023' },
  { id: 22, src: '/3DArtwork/ROCKETLAVALAMP.png', thumbnailSrc: '/3DArtwork/thumbnails/ROCKETLAVALAMP.webp', alt: 'Rocket Lava Lamp', title: 'Rocket Lava Lamp', year: '2023' },
  { id: 23, src: '/3DArtwork/Squid.png', thumbnailSrc: '/3DArtwork/thumbnails/Squid.webp', alt: 'Squid', title: 'Squid', year: '2023' },
  { id: 24, src: '/3DArtwork/starcanvas.png', thumbnailSrc: '/3DArtwork/thumbnails/starcanvas.webp', alt: 'Star Canvas', title: 'Star Canvas', year: '2023' },
  { id: 25, src: '/3DArtwork/Tiger-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Tiger.webp', alt: 'Tiger', title: 'Tiger', year: '2023' },
  { id: 26, src: '/3DArtwork/Trees.png', thumbnailSrc: '/3DArtwork/thumbnails/Trees.webp', alt: 'Trees', title: 'Trees', year: '2023' },
  { id: 27, src: '/3DArtwork/Vases.png', thumbnailSrc: '/3DArtwork/thumbnails/Vases.webp', alt: 'Vases', title: 'Vases', year: '2023' },
  { id: 28, src: '/3DArtwork/WormSong.png', thumbnailSrc: '/3DArtwork/thumbnails/WormSong.webp', alt: 'Worm Song', title: 'Worm Song', year: '2023' },
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
    label: 'Flowers Model',
    title: 'Flowers Model',
    img: '/3DModels/FlowersCover-compressed.webp',
    modelPath: '/3DModels/Flowers.glb',
    texturePath: '/3DModels/FlowersTexture.png'
  },
  {
    id: 3,
    label: 'Motorcycle Model',
    title: 'Motorcycle Model',
    img: '/3DModels/MotorcycleCover-compressed.webp',
    modelPath: '/3DModels/Motorcycle.glb',
    texturePath: '/3DModels/MotorcycleAlbedo.png'
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

const BATCH_SIZE = 12;

const Works = ({ goTo, hideWorkNav, onModelViewerOpenChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxActive, setLightboxActive] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(globalVisibleCount);
  const [lightboxImageLoaded, setLightboxImageLoaded] = useState(false);
  const sentinelRef = useRef();
  const [modelViewerOpen, setModelViewerOpen] = useState(false);
  const [modelViewerProps, setModelViewerProps] = useState({});

  const openImage = (image) => {
    setSelectedImage(image);
    setLightboxActive(true);
    setLightboxImageLoaded(false);
  };

  const closeImage = () => {
    setLightboxActive(false);
    setTimeout(() => {
      setSelectedImage(null);
      setLightboxImageLoaded(false);
    }, 300);
  };

  const handleImageMouseMove = (event, imageId) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const boxHalf = 92.5;
    if (
      mouseX > centerX - boxHalf &&
      mouseX < centerX + boxHalf &&
      mouseY > centerY - boxHalf &&
      mouseY < centerY + boxHalf
    ) {
      setHoveredImageId(imageId);
    } else {
      setHoveredImageId(null);
    }
  };

  const handleImageLeave = () => {
    setHoveredImageId(null);
  };

  // Infinite scroll: load more images when sentinel is visible
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => {
      const next = Math.min(prev + BATCH_SIZE, artwork.length);
      globalVisibleCount = next;
      return next;
    });
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    if (visibleCount >= artwork.length) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < artwork.length) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, visibleCount]);

  // Never reset visibleCount to a lower value

  // No test button or debug logic

  useEffect(() => {
    if (onModelViewerOpenChange) {
      onModelViewerOpenChange(modelViewerOpen);
    }
  }, [modelViewerOpen, onModelViewerOpenChange]);

  return (
    <div className="works-page">
      {/* Header */}
      <div className={`works-header${modelViewerOpen ? ' faded' : ''}`}>
        {!hideWorkNav && (
          <motion.h1
            className="works-main-title"
            onClick={() => goTo && goTo('home')}
            style={{ cursor: goTo ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '8px' }}
            layoutId="work-nav"
          >
            <span>Work</span>
            <motion.img src="/GlassyObjects/About/Chevron.png" alt="chevron" className="chevron-img" layoutId="work-chevron" />
          </motion.h1>
        )}
      </div>

      {/* 3D Models Section (now first) */}
      <h2 className="section-title models-title">Load 3D Models</h2>
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
        {videoGames.map((img) => (
          <div key={img.id} className={`video-game-card border-${img.border}`}>
            <img
              src={img.thumbnailSrc}
              alt={img.alt}
              className="video-game-img"
              onClick={() => openImage(img)}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* 3D Artwork Section */}
      <h2 className="section-title artwork-title">3D Artwork</h2>
      <div className="artwork-grid">
        {artwork.map((img, i) => {
          const [ref, visible] = useFadeInOnVisible();
          const isHovered = hoveredImageId === img.id;
          const isDimmed = hoveredImageId && hoveredImageId !== img.id;

          if (i >= visibleCount) {
            return <div key={img.id} ref={ref} style={{ height: 0 }} />;
          }

          return (
            <div
              key={img.id}
              className={`artwork-card${isHovered ? ' hovered' : ''}${isDimmed ? ' dimmed' : ''}`}
              onMouseMove={(e) => handleImageMouseMove(e, img.id)}
              onMouseLeave={handleImageLeave}
            >
              <img
                ref={ref}
                src={img.thumbnailSrc}
                alt={img.alt}
                className={`artwork-img${visible ? ' fade-in-visible' : ''}`}
                onClick={() => openImage(img)}
                loading="lazy"
              />
            </div>
          );
        })}
        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>

      {/* Enhanced Lightbox */}
      {selectedImage && (
        <div className={`lightbox ${lightboxActive ? 'active' : ''}`} onClick={closeImage}>
          <span className="close" onClick={closeImage}>&times;</span>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {!lightboxImageLoaded && (
              <div className="lightbox-loading">
                <div className="loading-spinner"></div>
                <p>Loading full resolution...</p>
              </div>
            )}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className={`lightbox-image ${lightboxImageLoaded ? 'loaded' : ''}`}
              onLoad={() => setLightboxImageLoaded(true)}
              style={{ opacity: lightboxImageLoaded ? 1 : 0 }}
            />
            <div className="lightbox-text">
              <h2 className="lightbox-title">{selectedImage.title}</h2>
              <p className="lightbox-year">{selectedImage.year}</p>
              <p className="lightbox-description">
                This piece showcases the artist's unique perspective on digital art and 3D modeling techniques.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Works;