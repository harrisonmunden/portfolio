import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './Works.css';
import { motion } from 'framer-motion';
import ModelViewer from './ModelViewer';
import ImageCarousel from './ImageCarousel';
import AddToCartModal from './AddToCartModal';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

const videoGames = [
  { id: 1, src: '/VideoGameAssets/PaparazziEscapeCover.png', thumbnailSrc: '/VideoGameAssets/PaparazziEscapeCover-compressed.webp', alt: 'Paparazzi Escape', title: 'Paparazzi Escape', route: '/game/paparazzi-escape' },
  { id: 2, src: '/VideoGameAssets/BusyGirlCover.png', thumbnailSrc: '/VideoGameAssets/BusyGirlCover-compressed.webp', alt: 'Busy Girl', title: 'Busy Girl', route: '/game/busy-girl' },
  { id: 3, src: '/VideoGameAssets/MaestroCover.png', thumbnailSrc: '/VideoGameAssets/MaestroCover-compressed.webp', alt: 'Maestro', title: 'Maestro', route: '/game/maestro' },
];

const artwork = [
  { id: 1, src: '/3DArtwork/AppleTree-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/AppleTree-compressed.webp', alt: 'Apple Tree', title: 'Apple Tree', priority: 8 },
  { id: 3, src: '/3DArtwork/Chess4 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Chess4 copy.webp', alt: 'Chess 4', title: 'Chess 4', priority: 3 },
  { id: 4, src: '/3DArtwork/Chess5 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Chess5 copy.webp', alt: 'Chess 5', title: 'Chess 5', priority: 38 },
  { id: 5, src: '/3DArtwork/Computer4 copy-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Computer4 copy-compressed.webp', alt: 'Computer 4', title: 'Computer 4', priority: 39 },
  { id: 6, src: '/3DArtwork/Crown.png', thumbnailSrc: '/3DArtwork/thumbnails/Crown.webp', alt: 'Crown', title: 'Crown', priority: 36 },
  { id: 8, src: '/3DArtwork/feathers3 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/feathers3 copy.webp', alt: 'Feathers 3', title: 'Feathers 3', priority: 9 },
  { id: 9, src: '/3DArtwork/Flower.png', thumbnailSrc: '/3DArtwork/thumbnails/Flower.webp', alt: 'Flower', title: 'Flower', priority: 2 },
  { id: 10, src: '/3DArtwork/GoldenHill.png', thumbnailSrc: '/3DArtwork/thumbnails/GoldenHill.webp', alt: 'Golden Hill', title: 'Golden Hill', priority: 18 },
  { id: 11, src: '/3DArtwork/Grass.png', thumbnailSrc: '/3DArtwork/thumbnails/Grass.webp', alt: 'Grass', title: 'Grass', priority: 4 },
  { id: 12, src: '/3DArtwork/H6.png', thumbnailSrc: '/3DArtwork/thumbnails/H6.webp', alt: 'H6', title: 'H6', priority: 20 },
  { id: 13, src: '/3DArtwork/hawk.png', thumbnailSrc: '/3DArtwork/thumbnails/hawk.webp', alt: 'Hawk', title: 'Hawk', priority: 15 },
  { id: 14, src: '/3DArtwork/HerProfilePhoto.png', thumbnailSrc: '/3DArtwork/thumbnails/HerProfilePhoto.webp', alt: 'Her Profile Photo', title: 'Her Profile Photo', priority: 27 },
  { id: 15, src: '/3DArtwork/Hfinal.png', thumbnailSrc: '/3DArtwork/thumbnails/Hfinal.webp', alt: 'Hfinal', title: 'Hfinal', priority: 10 },
  { id: 16, src: '/3DArtwork/JulipCD.png', thumbnailSrc: '/3DArtwork/thumbnails/JulipCD.webp', alt: 'Julip CD', title: 'Julip CD', priority: 48 },
  { id: 17, src: '/3DArtwork/MODELWALK.png', thumbnailSrc: '/3DArtwork/thumbnails/MODELWALK.webp', alt: 'Model Walk', title: 'Model Walk', priority: 22 },
  { id: 18, src: '/3DArtwork/PeacockSide.png', thumbnailSrc: '/3DArtwork/thumbnails/PeacockSide.webp', alt: 'Peacock Side', title: 'Peacock Side', priority: 33 },
  { id: 19, src: '/3DArtwork/PrayingMantis.png', thumbnailSrc: '/3DArtwork/thumbnails/PrayingMantis.webp', alt: 'Praying Mantis', title: 'Praying Mantis', priority: 26 },
  { id: 20, src: '/3DArtwork/profile.png', thumbnailSrc: '/3DArtwork/thumbnails/profile.webp', alt: 'Profile', title: 'Profile', priority: 41 },
  { id: 21, src: '/3DArtwork/ROCKET.png', thumbnailSrc: '/3DArtwork/thumbnails/ROCKET.webp', alt: 'Rocket', title: 'Rocket', priority: 19 },
  { id: 22, src: '/3DArtwork/ROCKETLAVALAMP.png', thumbnailSrc: '/3DArtwork/thumbnails/ROCKETLAVALAMP.webp', alt: 'Rocket Lava Lamp', title: 'Rocket Lava Lamp', priority: 5 },
  { id: 23, src: '/3DArtwork/Squid.png', thumbnailSrc: '/3DArtwork/thumbnails/Squid.webp', alt: 'Squid', title: 'Squid', priority: 49 },
  { id: 24, src: '/3DArtwork/starcanvas.png', thumbnailSrc: '/3DArtwork/thumbnails/starcanvas.webp', alt: 'Star Canvas', title: 'Star Canvas', priority: 11 },
  { id: 25, src: '/3DArtwork/Tiger-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Tiger-compressed.webp', alt: 'Tiger', title: 'Tiger', priority: 40 },
  { id: 26, src: '/3DArtwork/Trees.png', thumbnailSrc: '/3DArtwork/thumbnails/Trees.webp', alt: 'Trees', title: 'Trees', priority: 23 },
  { id: 27, src: '/3DArtwork/Vases.png', thumbnailSrc: '/3DArtwork/thumbnails/Vases.webp', alt: 'Vases', title: 'Vases', priority: 31 },
  { id: 28, src: '/3DArtwork/WormSong.png', thumbnailSrc: '/3DArtwork/thumbnails/WormSong.webp', alt: 'Worm Song', title: 'Worm Song', priority: 35 },
  // New images
  { id: 29, src: '/3DArtwork/ArchStairsFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/ArchStairsFinal-compressed.webp', alt: 'Arch Stairs Final', title: 'Arch Stairs', priority: 37 },
  { id: 30, src: '/3DArtwork/LoudSpeakersFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/LoudSpeakersFinal-compressed.webp', alt: 'Loud Speakers Final', title: 'Loud Speakers', priority: 21 },
  { id: 31, src: '/3DArtwork/MundenTowers-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MundenTowers-compressed.webp', alt: 'Munden Towers', title: 'Munden Towers', priority: 6 },
  { id: 32, src: '/3DArtwork/IMG_8617-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/IMG_8617-compressed.webp', alt: 'Architectural Detail', title: 'Architectural Detail', priority: 16 },
  { id: 33, src: '/3DArtwork/VerdeRoomMain-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/VerdeRoomMain-compressed.webp', alt: 'Verde Room Main', title: 'Verde Room', priority: 7 },
  { id: 34, src: '/3DArtwork/curtains-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/curtains-compressed.webp', alt: 'Curtains', title: 'Curtains', priority: 28 },
  { id: 35, src: '/3DArtwork/MUNDENchair-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MUNDENchair-compressed.webp', alt: 'Munden Chair', title: 'Munden Chair', priority: 43 },
  { id: 36, src: '/3DArtwork/LightsHangingFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/LightsHangingFinal-compressed.webp', alt: 'Hanging Lights Final', title: 'Hanging Lights', priority: 45 },
  { id: 37, src: '/3DArtwork/OrangeBlurRaw-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/OrangeBlurRaw-compressed.webp', alt: 'Orange Blur Raw', title: 'Orange Blur', priority: 12 },
  { id: 38, src: '/3DArtwork/HairyRoomExteriorFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/HairyRoomExteriorFinal-compressed.webp', alt: 'Hairy Room Exterior Final', title: 'Hairy Room Exterior', priority: 32 },
  { id: 39, src: '/3DArtwork/HairyChair-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/HairyChair-compressed.webp', alt: 'Hairy Chair', title: 'Hairy Chair', priority: 42 },
  { id: 40, src: '/3DArtwork/BlueRoomWCarpet-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/BlueRoomWCarpet-compressed.webp', alt: 'Blue Room with Carpet', title: 'Blue Room with Carpet', priority: 44 },
  { id: 41, src: '/3DArtwork/Harrison_Stick-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/Harrison_Stick-compressed.webp', alt: 'Harrison Stick', title: 'Harrison Stick', priority: 30 },
  { id: 42, src: '/3DArtwork/adirn-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/adirn-compressed.webp', alt: 'Adirn', title: 'Adirn', priority: 25 },
  { id: 43, src: '/3DArtwork/Rainbow-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Rainbow-compressed.webp', alt: 'Rainbow', title: 'Rainbow', priority: 34 },
  { id: 44, src: '/3DArtwork/MUNDEN_YELLOW-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MUNDEN_YELLOW-compressed.webp', alt: 'Munden Yellow', title: 'Munden Yellow', priority: 50 },
  { id: 45, src: '/3DArtwork/Glass2-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/Glass2-compressed.webp', alt: 'Glass 2', title: 'Glass 2', priority: 47 },
  { id: 46, src: '/3DArtwork/FullSizeRender2-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/FullSizeRender2-compressed.webp', alt: 'Full Size Render 2', title: 'Full Size Render', priority: 17 },
  { id: 47, src: '/3DArtwork/comingalongmaybe-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/comingalongmaybe-compressed.webp', alt: 'Coming Along Maybe', title: 'Coming Along Maybe', priority: 46 },
  { id: 48, src: '/3DArtwork/ScreenShot-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/ScreenShot-compressed.webp', alt: 'Screen Shot 2021-11-24', title: 'Screen Shot', priority: 13 },
  { id: 49, src: '/3DArtwork/HM_Room2FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room2FinalEdited-compressed.webp', alt: 'HM Room 2 Final Edited', title: 'HM Room 2', priority: 29 },
  { id: 50, src: '/3DArtwork/HM_Room3FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room3FinalEdited-compressed.webp', alt: 'HM Room 3 Final Edited', title: 'HM Room 3', priority: 24 },
  { id: 51, src: '/3DArtwork/HM_Room1FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room1FinalEdited-compressed.webp', alt: 'HM Room 1 Final Edited', title: 'HM Room 1', priority: 14 },
  { id: 52, src: '/3DArtwork/SFalternate1-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/SFalternate1-compressed.webp', alt: 'SF Alternate 1', title: 'SF Alternate', priority: 1 },
  // Missing images that were found in thumbnails directory
  { id: 53, src: '/3DArtwork/Falcon.png', thumbnailSrc: '/3DArtwork/thumbnails/Falcon.webp', alt: 'Falcon', title: 'Falcon', priority: 51 },
  { id: 54, src: '/3DArtwork/BusyGirlCover.png', thumbnailSrc: '/3DArtwork/thumbnails/BusyGirlCover.webp', alt: 'Busy Girl Cover Art', title: 'Busy Girl Cover', priority: 52 },
  // New images from compression script
  { id: 55, src: '/3DArtwork/BlurCoralInverted.png', thumbnailSrc: '/3DArtwork/thumbnails/BlurCoralInverted.webp', alt: 'Blur Coral Inverted', title: 'Blur Coral Inverted', priority: 53 },
  { id: 56, src: '/3DArtwork/CowBootsGood copy.png', thumbnailSrc: '/3DArtwork/thumbnails/CowBootsGood copy.webp', alt: 'Cow Boots Good', title: 'Cow Boots Good', priority: 54 },
  { id: 57, src: '/3DArtwork/Rainbow copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Rainbow copy.webp', alt: 'Rainbow Copy', title: 'Rainbow Copy', priority: 55 },
  { id: 58, src: '/3DArtwork/Screen Shot 2021-11-24 at 3.50.01 PM copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Screen Shot 2021-11-24 at 3.50.01 PM copy.webp', alt: 'Screen Shot Copy', title: 'Screen Shot Copy', priority: 56 },
  { id: 59, src: '/3DArtwork/curtains copy.png', thumbnailSrc: '/3DArtwork/thumbnails/curtains copy.webp', alt: 'Curtains Copy', title: 'Curtains Copy', priority: 57 },
  // Newly added images
  { id: 60, src: '/3DArtwork/CantFind.png', thumbnailSrc: '/3DArtwork/thumbnails/CantFind.webp', alt: 'Cant Find', title: 'Cant Find', priority: 58 },
  { id: 61, src: '/3DArtwork/DentistChair.png', thumbnailSrc: '/3DArtwork/thumbnails/DentistChair.webp', alt: 'Dentist Chair', title: 'Dentist Chair', priority: 59 },
  { id: 62, src: '/3DArtwork/LeafStem.png', thumbnailSrc: '/3DArtwork/thumbnails/LeafStem.webp', alt: 'Leaf Stem', title: 'Leaf Stem', priority: 60 },
  { id: 63, src: '/3DArtwork/LoveLetter.png', thumbnailSrc: '/3DArtwork/thumbnails/LoveLetter.webp', alt: 'Love Letter', title: 'Love Letter', priority: 61 },
  { id: 64, src: '/3DArtwork/Roots.png', thumbnailSrc: '/3DArtwork/thumbnails/Roots.webp', alt: 'Roots', title: 'Roots', priority: 62 },
  { id: 65, src: '/3DArtwork/aeroplane.png', thumbnailSrc: '/3DArtwork/thumbnails/aeroplane.webp', alt: 'Aeroplane', title: 'Aeroplane', priority: 63 }
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


const Works = ({ goTo, hideWorkNav, onModelViewerOpenChange }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [addToCartOpen, setAddToCartOpen] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState(null);
  const [modelViewerOpen, setModelViewerOpen] = useState(false);
  const [modelViewerProps, setModelViewerProps] = useState({});
  
  // Sort artwork by priority (lowest number = highest priority = appears first)
  // Create fresh sorted array to ensure all images are included
  const sortedArtwork = useMemo(() => {
    return [...artwork].sort((a, b) => a.priority - b.priority);
  }, []);
  
  // Refs for scroll-to-home functionality
  const hasScrolledUp = useRef(false);
  
  // Use custom scroll restoration hook
  useScrollToTop();

  // Store the goTo function reference to help with debugging
  useEffect(() => {
    // Works component mounted - setup complete
  }, [goTo]);

  // SCROLL PROTECTION COMPLETELY DISABLED - No accidental home transitions
  useEffect(() => {
    // Scroll protection disabled - user must click navigation to go back to home
    return () => {
      // No scroll listeners - completely safe from accidental transitions
    };
  }, [goTo]);

  // Debug: Log artwork count
  useEffect(() => {
    console.log('=== WORKS COMPONENT DEBUG ===');
    console.log('Total artwork items:', sortedArtwork.length);
    console.log('Artwork items:', sortedArtwork.map(img => ({ id: img.id, title: img.title, thumbnail: img.thumbnailSrc })));
    console.log('============================');
  }, [sortedArtwork]);

  const openImageCarousel = (image) => {
    setSelectedImage(image);
    setCarouselOpen(true);
  };

  const closeImageCarousel = () => {
    setCarouselOpen(false);
    setTimeout(() => {
      setSelectedImage(null);
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
            style={{ 
              cursor: goTo ? 'pointer' : 'default', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px'
            }}
            layoutId="work-nav"
          >
            <span>Work</span>
            <motion.img 
              src="/GlassyObjects/About/Chevron.png" 
              alt="chevron" 
              className="chevron-img" 
              layoutId="work-chevron"
            />
          </motion.h1>
        )}
      </div>

      {/* 3D Models Section (now first) */}
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

      {/* 3D Artwork Section - Back to original clean grid */}
      <h2 className="section-title artwork-title">3D Artwork ({sortedArtwork.length} images)</h2>
      {/* Debug info - remove after testing */}
      {console.log('Rendering artwork grid with', sortedArtwork.length, 'items') || null}
      <div className="artwork-grid">
        {sortedArtwork.map((img, i) => {
          const isHovered = hoveredImageId === img.id;
          const isDimmed = hoveredImageId && hoveredImageId !== img.id;

          return (
            <div
              key={img.id}
              className={`artwork-card${isHovered ? ' hovered' : ''}${isDimmed ? ' dimmed' : ''}`}
              onMouseMove={(e) => handleImageMouseMove(e, img.id)}
              onMouseLeave={handleImageLeave}
            >
              <img
                src={img.thumbnailSrc}
                alt={img.alt}
                className="artwork-img fade-in-visible"
                onClick={() => openImageCarousel(img)}
              />
            </div>
          );
        })}
      </div>

      {/* Image Carousel with Add to Cart functionality */}
      <ImageCarousel
        artwork={selectedImage}
        isOpen={carouselOpen}
        onClose={closeImageCarousel}
      />

      {/* Add to Cart Modal */}
      <AddToCartModal
        artwork={selectedImage}
        isOpen={addToCartOpen}
        onClose={() => setAddToCartOpen(false)}
      />
    </div>
  );
};

export default Works;
