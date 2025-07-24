import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Works.css';
import { motion } from 'framer-motion';
import { useFadeInOnVisible } from './hooks/useFadeInOnVisible';
import ModelViewer from './ModelViewer';

let globalVisibleCount = 8; // or your BATCH_SIZE

const videoGames = [
  { id: 1, src: '/src/assets/3DArtwork/BusyGirlCover.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/BusyGirlCover.webp', alt: 'Escape Game', border: 'blue' },
  { id: 2, src: '/src/assets/3DArtwork/Flower.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Flower.webp', alt: 'Flower Game', border: 'yellow' },
  { id: 3, src: '/src/assets/3DArtwork/HerProfilePhoto.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/HerProfilePhoto.webp', alt: 'Bossy Girl', border: 'pink' },
];

const artwork = [
  { id: 1, src: '/src/assets/3DArtwork/AppleTree.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/AppleTree.webp', alt: 'Apple Tree', title: 'Apple Tree', year: '2023' },
  { id: 2, src: '/src/assets/3DArtwork/BusyGirlCover.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/BusyGirlCover.webp', alt: 'Busy Girl Cover', title: 'Busy Girl Cover', year: '2023' },
  { id: 3, src: '/src/assets/3DArtwork/Chess4 copy.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Chess4 copy.webp', alt: 'Chess 4', title: 'Chess 4', year: '2023' },
  { id: 4, src: '/src/assets/3DArtwork/Chess5 copy.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Chess5 copy.webp', alt: 'Chess 5', title: 'Chess 5', year: '2023' },
  { id: 5, src: '/src/assets/3DArtwork/Computer4 copy.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Computer4 copy.webp', alt: 'Computer 4', title: 'Computer 4', year: '2023' },
  { id: 6, src: '/src/assets/3DArtwork/Crown.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Crown.webp', alt: 'Crown', title: 'Crown', year: '2023' },
  { id: 7, src: '/src/assets/3DArtwork/Falcon.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Falcon.webp', alt: 'Falcon', title: 'Falcon', year: '2023' },
  { id: 8, src: '/src/assets/3DArtwork/feathers3 copy.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/feathers3 copy.webp', alt: 'Feathers 3', title: 'Feathers 3', year: '2023' },
  { id: 9, src: '/src/assets/3DArtwork/Flower.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Flower.webp', alt: 'Flower', title: 'Flower', year: '2023' },
  { id: 10, src: '/src/assets/3DArtwork/GoldenHill.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/GoldenHill.webp', alt: 'Golden Hill', title: 'Golden Hill', year: '2023' },
  { id: 11, src: '/src/assets/3DArtwork/Grass.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Grass.webp', alt: 'Grass', title: 'Grass', year: '2023' },
  { id: 12, src: '/src/assets/3DArtwork/H6.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/H6.webp', alt: 'H6', title: 'H6', year: '2023' },
  { id: 13, src: '/src/assets/3DArtwork/hawk.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/hawk.webp', alt: 'Hawk', title: 'Hawk', year: '2023' },
  { id: 14, src: '/src/assets/3DArtwork/HerProfilePhoto.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/HerProfilePhoto.webp', alt: 'Her Profile Photo', title: 'Her Profile Photo', year: '2023' },
  { id: 15, src: '/src/assets/3DArtwork/Hfinal.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Hfinal.webp', alt: 'Hfinal', title: 'Hfinal', year: '2023' },
  { id: 16, src: '/src/assets/3DArtwork/JulipCD.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/JulipCD.webp', alt: 'Julip CD', title: 'Julip CD', year: '2023' },
  { id: 17, src: '/src/assets/3DArtwork/MODELWALK.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/MODELWALK.webp', alt: 'Model Walk', title: 'Model Walk', year: '2023' },
  { id: 18, src: '/src/assets/3DArtwork/PeacockSide.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/PeacockSide.webp', alt: 'Peacock Side', title: 'Peacock Side', year: '2023' },
  { id: 19, src: '/src/assets/3DArtwork/PrayingMantis.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/PrayingMantis.webp', alt: 'Praying Mantis', title: 'Praying Mantis', year: '2023' },
  { id: 20, src: '/src/assets/3DArtwork/profile.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/profile.webp', alt: 'Profile', title: 'Profile', year: '2023' },
  { id: 21, src: '/src/assets/3DArtwork/ROCKET.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/ROCKET.webp', alt: 'Rocket', title: 'Rocket', year: '2023' },
  { id: 22, src: '/src/assets/3DArtwork/ROCKETLAVALAMP.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/ROCKETLAVALAMP.webp', alt: 'Rocket Lava Lamp', title: 'Rocket Lava Lamp', year: '2023' },
  { id: 23, src: '/src/assets/3DArtwork/Squid.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Squid.webp', alt: 'Squid', title: 'Squid', year: '2023' },
  { id: 24, src: '/src/assets/3DArtwork/starcanvas.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/starcanvas.webp', alt: 'Star Canvas', title: 'Star Canvas', year: '2023' },
  { id: 25, src: '/src/assets/3DArtwork/Tiger.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Tiger.webp', alt: 'Tiger', title: 'Tiger', year: '2023' },
  { id: 26, src: '/src/assets/3DArtwork/Trees.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Trees.webp', alt: 'Trees', title: 'Trees', year: '2023' },
  { id: 27, src: '/src/assets/3DArtwork/Vases.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/Vases.webp', alt: 'Vases', title: 'Vases', year: '2023' },
  { id: 28, src: '/src/assets/3DArtwork/WormSong.png', thumbnailSrc: '/src/assets/3DArtwork/thumbnails/WormSong.webp', alt: 'Worm Song', title: 'Worm Song', year: '2023' },
];

const modelTiles = [
  {
    id: 1,
    label: 'Car Model',
    img: '/src/assets/3DArtwork/thumbnails/Car.webp', // Placeholder, update if you have a car thumbnail
    modelPath: '/src/assets/3DModels/Car.glb',
    texturePath: '/src/assets/3DModels/CarAlbedo.png',
  },
  {
    id: 2,
    label: 'Future Model',
    img: '/src/assets/3DArtwork/thumbnails/BusyGirlCover.webp', // Placeholder
    modelPath: '/src/assets/3DModels/Car.glb',
    texturePath: '/src/assets/3DModels/CarAlbedo.png',
  },
  {
    id: 3,
    label: 'Concept Model',
    img: '/src/assets/3DArtwork/thumbnails/Flower.webp', // Placeholder
    modelPath: '/src/assets/3DModels/Car.glb',
    texturePath: '/src/assets/3DModels/CarAlbedo.png',
  },
];

const BATCH_SIZE = 12;

const Works = ({ goTo, hideWorkNav }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxActive, setLightboxActive] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(globalVisibleCount);
  const [lightboxImageLoaded, setLightboxImageLoaded] = useState(false);
  const sentinelRef = useRef();
  const [modelViewerOpen, setModelViewerOpen] = useState(false);
  const [modelViewerProps, setModelViewerProps] = useState({});
  const [clickedModelTile, setClickedModelTile] = useState(null);

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

  return (
    <div className="works-page">
      {/* Header */}
      <div className="works-header">
        {!hideWorkNav && (
          <motion.h1
            className="works-main-title"
            onClick={() => goTo && goTo('home')}
            style={{ cursor: goTo ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '8px' }}
            layoutId="work-nav"
          >
            <span>Work</span>
            <motion.img src="/src/assets/GlassyObjects/About/Chevron.png" alt="chevron" className="chevron-img" layoutId="work-chevron" />
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
              setModelViewerProps({ modelPath: tile.modelPath, texturePath: tile.texturePath });
              setModelViewerOpen(true);
              setClickedModelTile(tile.id);
              setTimeout(() => setClickedModelTile(null), 250);
            }}
            style={{
              cursor: 'pointer',
              transform: clickedModelTile === tile.id ? 'scale(1.58)' : 'scale(1)',
              transition: 'transform 0.18s cubic-bezier(.4,2,.6,1)'
            }}
          >
            <img src={tile.img} alt={tile.label} className="model-tile-img" loading="lazy" />
            <div className="model-tile-label">{tile.label}</div>
          </div>
        ))}
      </div>
      {modelViewerOpen && (
        <ModelViewer
          modelPath={modelViewerProps.modelPath}
          texturePath={modelViewerProps.texturePath}
          onClose={() => setModelViewerOpen(false)}
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