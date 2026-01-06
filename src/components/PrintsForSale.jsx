import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import AddToCartModal from './AddToCartModal';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../components/Works.css';

const PrintsForSale = ({ goTo, hideNav, onModelViewerOpenChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [addToCartOpen, setAddToCartOpen] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState(null);
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [imagePositions, setImagePositions] = useState([]);
  const gridRef = useRef(null);
  
  // Refs for scroll-to-home functionality
  const hasScrolledUp = useRef(false);
  const scrollUpCount = useRef(0);
  const lastScrollY = useRef(0);
  
  // Use custom scroll restoration hook
  useScrollToTop();

  // Notify parent when carousel opens/closes to fade navigation
  useEffect(() => {
    if (onModelViewerOpenChange) {
      onModelViewerOpenChange(carouselOpen);
    }
  }, [carouselOpen, onModelViewerOpenChange]);

  // 3D Artwork data - All images from 3DArtwork folder
  const artwork = [
    { id: 1, src: '/3DArtwork/AppleTree-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/AppleTree-compressed.webp', alt: 'Apple Tree', title: 'Apple Tree', priority: 8 },
    { id: 3, src: '/3DArtwork/Chess4 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Chess4 copy.webp', alt: 'Chess 4', title: 'Chess 4', priority: 3 },
    { id: 4, src: '/3DArtwork/Chess5 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Chess5 copy.webp', alt: 'Chess 5', title: 'Chess 5', priority: 38 },
    { id: 5, src: '/3DArtwork/Computer4 copy-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Computer4 copy-compressed.webp', alt: 'Computer 4', title: 'Computer 4', priority: 39 },
    { id: 6, src: '/3DArtwork/Crown.png', thumbnailSrc: '/3DArtwork/thumbnails/Crown.webp', alt: 'Crown', title: 'Crown', priority: 36 },
    { id: 8, src: '/3DArtwork/feathers3 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/feathers3 copy.webp', alt: 'Feathers 3', title: 'Feathers 3', priority: 9 },
    { id: 9, src: '/3DArtwork/Flower.png', thumbnailSrc: '/3DArtwork/thumbnails/Flower.webp', alt: 'Flower', title: 'Flower', priority: 22 },
    { id: 10, src: '/3DArtwork/GoldenHill.png', thumbnailSrc: '/3DArtwork/thumbnails/GoldenHill.webp', alt: 'Golden Hill', title: 'Golden Hill', priority: 18 },
    { id: 11, src: '/3DArtwork/Grass.png', thumbnailSrc: '/3DArtwork/thumbnails/Grass.webp', alt: 'Grass', title: 'Grass', priority: 42 },
    { id: 12, src: '/3DArtwork/H6.png', thumbnailSrc: '/3DArtwork/thumbnails/H6.webp', alt: 'H6', title: 'H6', priority: 20 },
    { id: 13, src: '/3DArtwork/hawk.png', thumbnailSrc: '/3DArtwork/thumbnails/hawk.webp', alt: 'Hawk', title: 'Hawk', priority: 15 },
    { id: 14, src: '/3DArtwork/HerProfilePhoto.png', thumbnailSrc: '/3DArtwork/thumbnails/HerProfilePhoto.webp', alt: 'Her Profile Photo', title: 'Her Profile Photo', priority: 21 },
    { id: 15, src: '/3DArtwork/Hfinal.png', thumbnailSrc: '/3DArtwork/thumbnails/Hfinal.webp', alt: 'Hfinal', title: 'Hfinal', priority: 10 },
    { id: 16, src: '/3DArtwork/JulipCD.png', thumbnailSrc: '/3DArtwork/thumbnails/JulipCD.webp', alt: 'Julip CD', title: 'Julip CD', priority: 48 },
    { id: 17, src: '/3DArtwork/MODELWALK.png', thumbnailSrc: '/3DArtwork/thumbnails/MODELWALK.webp', alt: 'Model Walk', title: 'Model Walk', priority: 5 },
    { id: 18, src: '/3DArtwork/PeacockSide.png', thumbnailSrc: '/3DArtwork/thumbnails/PeacockSide.webp', alt: 'Peacock Side', title: 'Peacock Side', priority: 33 },
    { id: 19, src: '/3DArtwork/PrayingMantis.png', thumbnailSrc: '/3DArtwork/thumbnails/PrayingMantis.webp', alt: 'Praying Mantis', title: 'Praying Mantis', priority: 62 },
    { id: 20, src: '/3DArtwork/profile.png', thumbnailSrc: '/3DArtwork/thumbnails/profile.webp', alt: 'Profile', title: 'Profile', priority: 41 },
    { id: 21, src: '/3DArtwork/ROCKET.png', thumbnailSrc: '/3DArtwork/thumbnails/ROCKET.webp', alt: 'Rocket', title: 'Rocket', priority: 19 },
    { id: 22, src: '/3DArtwork/ROCKETLAVALAMP.png', thumbnailSrc: '/3DArtwork/thumbnails/ROCKETLAVALAMP.webp', alt: 'Rocket Lava Lamp', title: 'Rocket Lava Lamp', priority: 2 },
    { id: 23, src: '/3DArtwork/Squid.png', thumbnailSrc: '/3DArtwork/thumbnails/Squid.webp', alt: 'Squid', title: 'Squid', priority: 49 },
    { id: 24, src: '/3DArtwork/starcanvas.png', thumbnailSrc: '/3DArtwork/thumbnails/starcanvas.webp', alt: 'Star Canvas', title: 'Star Canvas', priority: 26 },
    { id: 25, src: '/3DArtwork/Tiger-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Tiger-compressed.webp', alt: 'Tiger', title: 'Tiger', priority: 40 },
    { id: 26, src: '/3DArtwork/Trees.png', thumbnailSrc: '/3DArtwork/thumbnails/Trees.webp', alt: 'Trees', title: 'Trees', priority: 23 },
    { id: 27, src: '/3DArtwork/Vases.png', thumbnailSrc: '/3DArtwork/thumbnails/Vases.webp', alt: 'Vases', title: 'Vases', priority: 31 },
    { id: 28, src: '/3DArtwork/WormSong.png', thumbnailSrc: '/3DArtwork/thumbnails/WormSong.webp', alt: 'Worm Song', title: 'Worm Song', priority: 35 },
    { id: 29, src: '/3DArtwork/ArchStairsFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/ArchStairsFinal-compressed.webp', alt: 'Arch Stairs Final', title: 'Arch Stairs', priority: 37 },
    { id: 30, src: '/3DArtwork/LoudSpeakersFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/LoudSpeakersFinal-compressed.webp', alt: 'Loud Speakers Final', title: 'Loud Speakers', priority: 27 },
    { id: 31, src: '/3DArtwork/MundenTowers-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MundenTowers-compressed.webp', alt: 'Munden Towers', title: 'Munden Towers', priority: 6 },
    { id: 32, src: '/3DArtwork/IMG_8617-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/IMG_8617-compressed.webp', alt: 'Architectural Detail', title: 'Architectural Detail', priority: 16 },
    { id: 33, src: '/3DArtwork/VerdeRoomMain-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/VerdeRoomMain-compressed.webp', alt: 'Verde Room Main', title: 'Verde Room', priority: 7 },
    { id: 34, src: '/3DArtwork/curtains-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/curtains-compressed.webp', alt: 'Curtains', title: 'Curtains', priority: 63 },
    { id: 35, src: '/3DArtwork/MUNDENchair-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MUNDENchair-compressed.webp', alt: 'Munden Chair', title: 'Munden Chair', priority: 44 },
    { id: 36, src: '/3DArtwork/LightsHangingFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/LightsHangingFinal-compressed.webp', alt: 'Hanging Lights Final', title: 'Hanging Lights', priority: 45 },
    { id: 37, src: '/3DArtwork/OrangeBlurRaw-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/OrangeBlurRaw-compressed.webp', alt: 'Orange Blur Raw', title: 'Orange Blur', priority: 12 },
    { id: 38, src: '/3DArtwork/HairyRoomExteriorFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/HairyRoomExteriorFinal-compressed.webp', alt: 'Hairy Room Exterior Final', title: 'Hairy Room Exterior', priority: 32 },
    { id: 39, src: '/3DArtwork/HairyChair-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/HairyChair-compressed.webp', alt: 'Hairy Chair', title: 'Hairy Chair', priority: 50 },
    { id: 40, src: '/3DArtwork/BlueRoomWCarpet-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/BlueRoomWCarpet-compressed.webp', alt: 'Blue Room with Carpet', title: 'Blue Room with Carpet', priority: 4 },
    { id: 41, src: '/3DArtwork/Harrison_Stick-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/Harrison_Stick-compressed.webp', alt: 'Harrison Stick', title: 'Harrison Stick', priority: 30 },
    { id: 42, src: '/3DArtwork/adirn-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/adirn-compressed.webp', alt: 'Adirn', title: 'Adirn', priority: 25 },
    { id: 43, src: '/3DArtwork/Rainbow-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Rainbow-compressed.webp', alt: 'Rainbow', title: 'Rainbow', priority: 34 },
    { id: 44, src: '/3DArtwork/MUNDEN_YELLOW-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MUNDEN_YELLOW-compressed.webp', alt: 'Munden Yellow', title: 'Munden Yellow', priority: 43 },
    { id: 45, src: '/3DArtwork/Glass2-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/Glass2-compressed.webp', alt: 'Glass 2', title: 'Glass 2', priority: 47 },
    { id: 46, src: '/3DArtwork/FullSizeRender2-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/FullSizeRender2-compressed.webp', alt: 'Full Size Render 2', title: 'Full Size Render', priority: 17 },
    { id: 47, src: '/3DArtwork/comingalongmaybe-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/comingalongmaybe-compressed.webp', alt: 'Coming Along Maybe', title: 'Coming Along Maybe', priority: 58 },
    { id: 49, src: '/3DArtwork/HM_Room2FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room2FinalEdited-compressed.webp', alt: 'HM Room 2 Final Edited', title: 'HM Room 2', priority: 29 },
    { id: 50, src: '/3DArtwork/HM_Room3FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room3FinalEdited-compressed.webp', alt: 'HM Room 3 Final Edited', title: 'HM Room 3', priority: 24 },
    { id: 51, src: '/3DArtwork/HM_Room1FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room1FinalEdited-compressed.webp', alt: 'HM Room 1 Final Edited', title: 'HM Room 1', priority: 1 },
    { id: 52, src: '/3DArtwork/SFalternate1-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/SFalternate1-compressed.webp', alt: 'SF Alternate 1', title: 'SF Alternate', priority: 13 },
    { id: 53, src: '/3DArtwork/Falcon.png', thumbnailSrc: '/3DArtwork/thumbnails/Falcon.webp', alt: 'Falcon', title: 'Falcon', priority: 51 },
    { id: 54, src: '/3DArtwork/BusyGirlCover.png', thumbnailSrc: '/3DArtwork/thumbnails/BusyGirlCover.webp', alt: 'Busy Girl Cover Art', title: 'Busy Girl Cover', priority: 52 },
    { id: 55, src: '/3DArtwork/BlurCoralInverted.png', thumbnailSrc: '/3DArtwork/thumbnails/BlurCoralInverted.webp', alt: 'Blur Coral Inverted', title: 'Blur Coral Inverted', priority: 53 },
    { id: 56, src: '/3DArtwork/CowBootsGood copy.png', thumbnailSrc: '/3DArtwork/thumbnails/CowBootsGood copy.webp', alt: 'Cow Boots Good', title: 'Cow Boots Good', priority: 54 },
    { id: 58, src: '/3DArtwork/Screen Shot 2021-11-24 at 3.50.01 PM copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Screen Shot 2021-11-24 at 3.50.01 PM copy.webp', alt: 'Screen Shot Copy', title: 'Screen Shot Copy', priority: 56 },
    { id: 59, src: '/3DArtwork/curtains copy.png', thumbnailSrc: '/3DArtwork/thumbnails/curtains copy.webp', alt: 'Curtains Copy', title: 'Curtains Copy', priority: 57 },
    { id: 60, src: '/3DArtwork/CantFind.png', thumbnailSrc: '/3DArtwork/thumbnails/CantFind.webp', alt: 'Cant Find', title: 'Cant Find', priority: 46 },
    { id: 61, src: '/3DArtwork/DentistChair.png', thumbnailSrc: '/3DArtwork/thumbnails/DentistChair.webp', alt: 'Dentist Chair', title: 'Dentist Chair', priority: 59 },
    { id: 62, src: '/3DArtwork/LeafStem.png', thumbnailSrc: '/3DArtwork/thumbnails/LeafStem.webp', alt: 'Leaf Stem', title: 'Leaf Stem', priority: 60 },
    { id: 63, src: '/3DArtwork/LoveLetter.png', thumbnailSrc: '/3DArtwork/thumbnails/LoveLetter.webp', alt: 'Love Letter', title: 'Love Letter', priority: 61 },
    { id: 64, src: '/3DArtwork/Roots.png', thumbnailSrc: '/3DArtwork/thumbnails/Roots.webp', alt: 'Roots', title: 'Roots', priority: 11 },
    { id: 65, src: '/3DArtwork/aeroplane.png', thumbnailSrc: '/3DArtwork/thumbnails/aeroplane.webp', alt: 'Aeroplane', title: 'Aeroplane', priority: 28 }
  ];

  // Memoize sorted artwork to prevent recalculation on every render
  const sortedArtwork = useMemo(() => {
    return [...artwork].sort((a, b) => a.priority - b.priority);
  }, []);

  // Calculate actual positions of images after CSS columns renders them
  const calculateImagePositions = useCallback(() => {
    if (!gridRef.current) return;
    
    const cards = gridRef.current.querySelectorAll('.artwork-card');
    if (cards.length === 0) return;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const positions = [];
    
    // Use a more efficient loop
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      positions.push({
        index: i,
        top: rect.top - gridRect.top,
        id: sortedArtwork[i].id
      });
    }
    
    // Sort by actual vertical position (top coordinate)
    positions.sort((a, b) => a.top - b.top);
    setImagePositions(positions);
    
    // Show first 3 images by actual position immediately
    const firstThree = new Set(positions.slice(0, 3).map(pos => pos.index));
    setVisibleImages(firstThree);
  }, [sortedArtwork]);

  // Measure positions after images load and layout settles
  useEffect(() => {
    // Initial calculation after component mounts
    const timer = setTimeout(() => {
      calculateImagePositions();
    }, 100);

    // Recalculate on window resize
    const handleResize = () => {
      setTimeout(calculateImagePositions, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateImagePositions]);

  // Progressive loading based on actual vertical positions
  useEffect(() => {
    if (imagePositions.length === 0) return;

    let currentBatch = 1; // Start with batch 1 (after initial 3)
    
    const loadNextBatch = () => {
      const startIndex = currentBatch * 3;
      const endIndex = Math.min(startIndex + 3, imagePositions.length);
      
      if (startIndex >= imagePositions.length) return;
      
      setVisibleImages(prev => {
        const newVisible = new Set(prev);
        for (let i = startIndex; i < endIndex; i++) {
          newVisible.add(imagePositions[i].index);
        }
        return newVisible;
      });
      
      currentBatch++;
    };

    // Set up progressive loading timers
    const timers = [];
    const totalBatches = Math.ceil((imagePositions.length - 3) / 3);
    
    for (let i = 0; i < totalBatches; i++) {
      const timer = setTimeout(() => {
        loadNextBatch();
      }, (i + 1) * 200); // 200ms delay between each batch
      timers.push(timer);
    }
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [imagePositions]);

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

  // Memoize position mapping for better performance
  const positionMap = useMemo(() => {
    const map = new Map();
    imagePositions.forEach((pos, index) => {
      map.set(pos.index, Math.floor(index / 3) * 0.1);
    });
    return map;
  }, [imagePositions]);

  const openImageCarousel = (img) => {
    setSelectedImage(img);
    setCarouselOpen(true);
  };

  const handleImageMouseMove = useCallback((event, imageId) => {
    // Cache rect calculations for better performance
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width * 0.5;
    const centerY = rect.height * 0.5;
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
  }, []);

  const handleImageLeave = () => {
    setHoveredImageId(null);
  };

  const openAddToCartModal = (img) => {
    setSelectedImage(img);
    setAddToCartOpen(true);
  };

  return (
    <div className="works-page">
      {/* 3D Artwork Section */}
      <div className="artwork-grid" ref={gridRef}>
        {sortedArtwork.map((img, i) => {
          const isHovered = hoveredImageId === img.id;
          const isDimmed = hoveredImageId && hoveredImageId !== img.id;
          const isVisible = visibleImages.has(i);
          
          // Use pre-calculated stagger delay for better performance
          const staggerDelay = positionMap.get(i) || 0;

          return (
            <div
              key={img.id}
              className={`artwork-card${isHovered ? ' hovered' : ''}${isDimmed ? ' dimmed' : ''}`}
              onMouseMove={(e) => handleImageMouseMove(e, img.id)}
              onMouseLeave={handleImageLeave}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                transition: `opacity 0.6s cubic-bezier(.33,1.02,.57,.99) ${staggerDelay}s, transform 0.6s cubic-bezier(.33,1.02,.57,.99) ${staggerDelay}s`
              }}
            >
              <img
                src={img.thumbnailSrc}
                alt={img.alt}
                className="artwork-img fade-in-visible"
                onClick={() => openImageCarousel(img)}
                loading={staggerDelay < 0.6 ? "eager" : "lazy"} // Load first 6 by position eagerly
                onLoad={() => {
                  // Recalculate positions when images finish loading
                  if (i < 5) { // Only recalculate for first few images to avoid excessive calls
                    setTimeout(calculateImagePositions, 50);
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Image Carousel */}
      {carouselOpen && (
        <ImageCarousel
          artwork={selectedImage}
          isOpen={carouselOpen}
          onClose={() => {
            setCarouselOpen(false);
            setSelectedImage(null);
          }}
        />
      )}

      {/* Add to Cart Modal */}
      {addToCartOpen && (
        <AddToCartModal
          isOpen={addToCartOpen}
          artwork={selectedImage}
          onClose={() => {
            setAddToCartOpen(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

export default PrintsForSale;
