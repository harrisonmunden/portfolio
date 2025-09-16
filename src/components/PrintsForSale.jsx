import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import AddToCartModal from './AddToCartModal';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../components/Works.css';

const PrintsForSale = ({ goTo, hideNav }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [addToCartOpen, setAddToCartOpen] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState(null);
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [imagePositions, setImagePositions] = useState([]);
  const gridRef = useRef(null);
  
  // Refs for scroll-to-home functionality
  const hasScrolledUp = useRef(false);
  
  // Use custom scroll restoration hook
  useScrollToTop();

  // 3D Artwork data
  const artwork = [
    { id: 24, src: "/3DArtwork/adirn-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/adirn.webp", alt: "adirn", title: "adirn", priority: 25 },
    { id: 4, src: "/3DArtwork/AppleTree-compressed.png", thumbnailSrc: "/3DArtwork/thumbnails/AppleTree.webp", alt: "Apple Tree", title: "Apple Tree", priority: 8 },
    { id: 25, src: "/3DArtwork/ArchStairsFinal-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/ArchStairsFinal.webp", alt: "Arch Stairs Final", title: "Arch Stairs Final", priority: 37 },
    { id: 26, src: "/3DArtwork/BlueRoomWCarpet-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/BlueRoomWCarpet.webp", alt: "Blue Room W Carpet", title: "Blue Room W Carpet", priority: 44 },
    { id: 3, src: "/3DArtwork/BusyGirlCover.png", thumbnailSrc: "/3DArtwork/thumbnails/BusyGirlCover.webp", alt: "Busy Girl Cover", title: "Busy Girl Cover", priority: 48 },
    { id: 5, src: "/3DArtwork/Chess4 copy.png", thumbnailSrc: "/3DArtwork/thumbnails/Chess4 copy.webp", alt: "Chess 4", title: "Chess 4", priority: 3 },
    { id: 6, src: "/3DArtwork/Chess5 copy.png", thumbnailSrc: "/3DArtwork/thumbnails/Chess5 copy.webp", alt: "Chess 5", title: "Chess 5", priority: 38 },
    { id: 27, src: "/3DArtwork/comingalongmaybe-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/comingalongmaybe.webp", alt: "Coming Along Maybe", title: "Coming Along Maybe", priority: 46 },
    { id: 7, src: "/3DArtwork/Computer4 copy-compressed.png", thumbnailSrc: "/3DArtwork/thumbnails/Computer4 copy.webp", alt: "Computer 4", title: "Computer 4", priority: 39 },
    { id: 8, src: "/3DArtwork/Crown.png", thumbnailSrc: "/3DArtwork/thumbnails/Crown.webp", alt: "Crown", title: "Crown", priority: 36 },
    { id: 9, src: "/3DArtwork/curtains-compressed.png", thumbnailSrc: "/3DArtwork/thumbnails/curtains.webp", alt: "Curtains", title: "Curtains", priority: 28 },
    { id: 10, src: "/3DArtwork/Falcon.png", thumbnailSrc: "/3DArtwork/thumbnails/Falcon.webp", alt: "Falcon", title: "Falcon", priority: 35 },
    { id: 11, src: "/3DArtwork/feathers3 copy.png", thumbnailSrc: "/3DArtwork/thumbnails/feathers3 copy.webp", alt: "Feathers 3", title: "Feathers 3", priority: 9 },
    { id: 12, src: "/3DArtwork/Flower.png", thumbnailSrc: "/3DArtwork/thumbnails/Flower.webp", alt: "Flower", title: "Flower", priority: 2 },
    { id: 28, src: "/3DArtwork/FullSizeRender2-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/FullSizeRender2.webp", alt: "Full Size Render 2", title: "Full Size Render 2", priority: 17 },
    { id: 29, src: "/3DArtwork/Glass2-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/Glass2.webp", alt: "Glass 2", title: "Glass 2", priority: 47 },
    { id: 13, src: "/3DArtwork/GoldenHill.png", thumbnailSrc: "/3DArtwork/thumbnails/GoldenHill.webp", alt: "Golden Hill", title: "Golden Hill", priority: 18 },
    { id: 14, src: "/3DArtwork/Grass.png", thumbnailSrc: "/3DArtwork/thumbnails/Grass.webp", alt: "Grass", title: "Grass", priority: 4 },
    { id: 15, src: "/3DArtwork/H6.png", thumbnailSrc: "/3DArtwork/thumbnails/H6.webp", alt: "H6", title: "H6", priority: 20 },
    { id: 30, src: "/3DArtwork/HairyChair-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/HairyChair.webp", alt: "Hairy Chair", title: "Hairy Chair", priority: 42 },
    { id: 31, src: "/3DArtwork/HairyRoomExteriorFinal-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/HairyRoomExteriorFinal.webp", alt: "Hairy Room Exterior Final", title: "Hairy Room Exterior Final", priority: 32 },
    { id: 32, src: "/3DArtwork/Harrison_Stick-compressed.jpg", thumbnailSrc: "/3DArtwork/thumbnails/Harrison_Stick.webp", alt: "Harrison Stick", title: "Harrison Stick", priority: 30 },
    { id: 16, src: "/3DArtwork/hawk.png", thumbnailSrc: "/3DArtwork/thumbnails/hawk.webp", alt: "Hawk", title: "Hawk", priority: 15 },
    { id: 17, src: "/3DArtwork/HerProfilePhoto.png", thumbnailSrc: "/3DArtwork/thumbnails/HerProfilePhoto.webp", alt: "Her Profile Photo", title: "Her Profile Photo", priority: 27 },
    { id: 18, src: "/3DArtwork/Hfinal.png", thumbnailSrc: "/3DArtwork/thumbnails/Hfinal.webp", alt: "H Final", title: "H Final", priority: 10 },
    { id: 19, src: "/3DArtwork/HM_Room1FinalEdited-compressed.png", thumbnailSrc: "/3DArtwork/thumbnails/HM_Room1FinalEdited.webp", alt: "HM Room 1 Final Edited", title: "HM Room 1 Final Edited", priority: 14 },
    { id: 20, src: "/3DArtwork/HM_Room2FinalEdited-compressed.png", thumbnailSrc: "/3DArtwork/thumbnails/HM_Room2FinalEdited.webp", alt: "HM Room 2 Final Edited", title: "HM Room 2 Final Edited", priority: 29 },
    { id: 21, src: "/3DArtwork/HM_Room3FinalEdited-compressed.png", thumbnailSrc: "/3DArtwork/thumbnails/HM_Room3FinalEdited.webp", alt: "HM Room 3 Final Edited", title: "HM Room 3 Final Edited", priority: 24 }
  ];

  // Sort artwork by priority (lowest number = highest priority = appears first)
  const sortedArtwork = artwork.sort((a, b) => a.priority - b.priority);

  // Calculate actual positions of images after CSS columns renders them
  const calculateImagePositions = () => {
    if (!gridRef.current) return;
    
    const cards = gridRef.current.querySelectorAll('.artwork-card');
    const positions = Array.from(cards).map((card, index) => {
      const rect = card.getBoundingClientRect();
      const gridRect = gridRef.current.getBoundingClientRect();
      return {
        index,
        top: rect.top - gridRect.top,
        id: sortedArtwork[index].id
      };
    });
    
    // Sort by actual vertical position (top coordinate)
    positions.sort((a, b) => a.top - b.top);
    setImagePositions(positions);
    
    // Show first 3 images by actual position immediately
    const firstThree = positions.slice(0, 3).map(pos => pos.index);
    setVisibleImages(new Set(firstThree));
  };

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
  }, []);

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

  // Scroll detection for going back to home
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0 && hasScrolledUp.current && goTo) {
        goTo('home');
      }
      
      if (window.scrollY > 0) {
        hasScrolledUp.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [goTo]);

  const openImageCarousel = (img) => {
    setSelectedImage(img);
    setCarouselOpen(true);
  };

  const handleImageMouseMove = (e, imageId) => {
    setHoveredImageId(imageId);
  };

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
          
          // Find this image's position in the sorted list for stagger timing
          const positionIndex = imagePositions.findIndex(pos => pos.index === i);
          const staggerDelay = positionIndex >= 0 ? Math.floor(positionIndex / 3) * 0.1 : 0;

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
                loading={positionIndex < 6 ? "eager" : "lazy"} // Load first 6 by position eagerly
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
          images={sortedArtwork}
          selectedImage={selectedImage}
          isOpen={carouselOpen}
          onClose={() => {
            setCarouselOpen(false);
            setSelectedImage(null);
          }}
          onAddToCart={openAddToCartModal}
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
