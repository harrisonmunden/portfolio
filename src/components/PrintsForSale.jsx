import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ImageCarousel from './ImageCarousel';
import AddToCartModal from './AddToCartModal';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../components/Works.css';

// Responsive column count helper
const getColumnCount = (width) => {
  if (width <= 480) return 2;
  if (width <= 768) return 2;
  if (width <= 900) return 2;
  return 3;
};

// Responsive gap helper (matches CSS values)
const getGap = (width) => {
  if (width <= 480) return 14;
  if (width <= 600) return 14;
  if (width <= 768) return 20;
  if (width <= 1024) return 30;
  if (width <= 1200) return 35;
  return 40;
};

const PrintsForSale = ({ goTo, hideNav, onModelViewerOpenChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [addToCartOpen, setAddToCartOpen] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
  const gridRef = useRef(null);
  const cardRefs = useRef(new Map());

  // Use custom scroll restoration hook
  useScrollToTop();

  // Track window width with RAF throttling
  useEffect(() => {
    let rafId;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWindowWidth(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Notify parent when carousel opens/closes to fade navigation
  useEffect(() => {
    if (onModelViewerOpenChange) {
      onModelViewerOpenChange(carouselOpen);
    }
  }, [carouselOpen, onModelViewerOpenChange]);

  // 3D Artwork data with pre-computed dimensions (width, height from thumbnails)
  const artwork = [
    { id: 1, src: '/3DArtwork/AppleTree-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/AppleTree-compressed.webp', alt: 'Apple Tree', title: 'Apple Tree', priority: 8, w: 800, h: 800 },
    { id: 3, src: '/3DArtwork/Chess4 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Chess4 copy.webp', alt: 'Chess 4', title: 'Chess 4', priority: 3, w: 800, h: 800 },
    { id: 4, src: '/3DArtwork/Chess5 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Chess5 copy.webp', alt: 'Chess 5', title: 'Chess 5', priority: 38, w: 800, h: 790 },
    { id: 5, src: '/3DArtwork/Computer4 copy-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Computer4 copy-compressed.webp', alt: 'Computer 4', title: 'Computer 4', priority: 39, w: 800, h: 800 },
    { id: 6, src: '/3DArtwork/Crown.png', thumbnailSrc: '/3DArtwork/thumbnails/Crown.webp', alt: 'Crown', title: 'Crown', priority: 36, w: 800, h: 800 },
    { id: 8, src: '/3DArtwork/feathers3 copy.png', thumbnailSrc: '/3DArtwork/thumbnails/feathers3 copy.webp', alt: 'Feathers 3', title: 'Feathers 3', priority: 9, w: 800, h: 451 },
    { id: 9, src: '/3DArtwork/Flower.png', thumbnailSrc: '/3DArtwork/thumbnails/Flower.webp', alt: 'Flower', title: 'Flower', priority: 22, w: 800, h: 800 },
    { id: 10, src: '/3DArtwork/GoldenHill.png', thumbnailSrc: '/3DArtwork/thumbnails/GoldenHill.webp', alt: 'Golden Hill', title: 'Golden Hill', priority: 18, w: 800, h: 800 },
    { id: 11, src: '/3DArtwork/Grass.png', thumbnailSrc: '/3DArtwork/thumbnails/Grass.webp', alt: 'Grass', title: 'Grass', priority: 42, w: 629, h: 800 },
    { id: 12, src: '/3DArtwork/H6.png', thumbnailSrc: '/3DArtwork/thumbnails/H6.webp', alt: 'H6', title: 'H6', priority: 20, w: 800, h: 800 },
    { id: 13, src: '/3DArtwork/hawk.png', thumbnailSrc: '/3DArtwork/thumbnails/hawk.webp', alt: 'Hawk', title: 'Hawk', priority: 15, w: 798, h: 800 },
    { id: 14, src: '/3DArtwork/HerProfilePhoto.png', thumbnailSrc: '/3DArtwork/thumbnails/HerProfilePhoto.webp', alt: 'Her Profile Photo', title: 'Her Profile Photo', priority: 21, w: 800, h: 800 },
    { id: 15, src: '/3DArtwork/Hfinal.png', thumbnailSrc: '/3DArtwork/thumbnails/Hfinal.webp', alt: 'Hfinal', title: 'Hfinal', priority: 10, w: 800, h: 800 },
    { id: 16, src: '/3DArtwork/JulipCD.png', thumbnailSrc: '/3DArtwork/thumbnails/JulipCD.webp', alt: 'Julip CD', title: 'Julip CD', priority: 48, w: 800, h: 800 },
    { id: 17, src: '/3DArtwork/MODELWALK.png', thumbnailSrc: '/3DArtwork/thumbnails/MODELWALK.webp', alt: 'Model Walk', title: 'Model Walk', priority: 5, w: 800, h: 800 },
    { id: 18, src: '/3DArtwork/PeacockSide.png', thumbnailSrc: '/3DArtwork/thumbnails/PeacockSide.webp', alt: 'Peacock Side', title: 'Peacock Side', priority: 33, w: 800, h: 800 },
    { id: 19, src: '/3DArtwork/PrayingMantis.png', thumbnailSrc: '/3DArtwork/thumbnails/PrayingMantis.webp', alt: 'Praying Mantis', title: 'Praying Mantis', priority: 62, w: 800, h: 781 },
    { id: 20, src: '/3DArtwork/profile.png', thumbnailSrc: '/3DArtwork/thumbnails/profile.webp', alt: 'Profile', title: 'Profile', priority: 41, w: 800, h: 800 },
    { id: 21, src: '/3DArtwork/ROCKET.png', thumbnailSrc: '/3DArtwork/thumbnails/ROCKET.webp', alt: 'Rocket', title: 'Rocket', priority: 19, w: 800, h: 800 },
    { id: 22, src: '/3DArtwork/ROCKETLAVALAMP.png', thumbnailSrc: '/3DArtwork/thumbnails/ROCKETLAVALAMP.webp', alt: 'Rocket Lava Lamp', title: 'Rocket Lava Lamp', priority: 2, w: 800, h: 800 },
    { id: 23, src: '/3DArtwork/Squid.png', thumbnailSrc: '/3DArtwork/thumbnails/Squid.webp', alt: 'Squid', title: 'Squid', priority: 49, w: 626, h: 800 },
    { id: 24, src: '/3DArtwork/starcanvas.png', thumbnailSrc: '/3DArtwork/thumbnails/starcanvas.webp', alt: 'Star Canvas', title: 'Star Canvas', priority: 26, w: 800, h: 800 },
    { id: 25, src: '/3DArtwork/Tiger-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Tiger-compressed.webp', alt: 'Tiger', title: 'Tiger', priority: 40, w: 800, h: 800 },
    { id: 26, src: '/3DArtwork/Trees.png', thumbnailSrc: '/3DArtwork/thumbnails/Trees.webp', alt: 'Trees', title: 'Trees', priority: 23, w: 800, h: 800 },
    { id: 27, src: '/3DArtwork/Vases.png', thumbnailSrc: '/3DArtwork/thumbnails/Vases.webp', alt: 'Vases', title: 'Vases', priority: 31, w: 800, h: 800 },
    { id: 28, src: '/3DArtwork/WormSong.png', thumbnailSrc: '/3DArtwork/thumbnails/WormSong.webp', alt: 'Worm Song', title: 'Worm Song', priority: 35, w: 800, h: 800 },
    { id: 29, src: '/3DArtwork/ArchStairsFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/ArchStairsFinal-compressed.webp', alt: 'Arch Stairs Final', title: 'Arch Stairs', priority: 37, w: 640, h: 800 },
    { id: 30, src: '/3DArtwork/LoudSpeakersFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/LoudSpeakersFinal-compressed.webp', alt: 'Loud Speakers Final', title: 'Loud Speakers', priority: 27, w: 640, h: 800 },
    { id: 31, src: '/3DArtwork/MundenTowers-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MundenTowers-compressed.webp', alt: 'Munden Towers', title: 'Munden Towers', priority: 6, w: 749, h: 800 },
    { id: 32, src: '/3DArtwork/IMG_8617-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/IMG_8617-compressed.webp', alt: 'Architectural Detail', title: 'Architectural Detail', priority: 16, w: 799, h: 800 },
    { id: 33, src: '/3DArtwork/VerdeRoomMain-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/VerdeRoomMain-compressed.webp', alt: 'Verde Room Main', title: 'Verde Room', priority: 7, w: 800, h: 450 },
    { id: 34, src: '/3DArtwork/curtains-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/curtains-compressed.webp', alt: 'Curtains', title: 'Curtains', priority: 63, w: 800, h: 450 },
    { id: 35, src: '/3DArtwork/MUNDENchair-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MUNDENchair-compressed.webp', alt: 'Munden Chair', title: 'Munden Chair', priority: 44, w: 800, h: 583 },
    { id: 36, src: '/3DArtwork/LightsHangingFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/LightsHangingFinal-compressed.webp', alt: 'Hanging Lights Final', title: 'Hanging Lights', priority: 45, w: 640, h: 800 },
    { id: 37, src: '/3DArtwork/OrangeBlurRaw-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/OrangeBlurRaw-compressed.webp', alt: 'Orange Blur Raw', title: 'Orange Blur', priority: 12, w: 800, h: 800 },
    { id: 38, src: '/3DArtwork/HairyRoomExteriorFinal-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/HairyRoomExteriorFinal-compressed.webp', alt: 'Hairy Room Exterior Final', title: 'Hairy Room Exterior', priority: 32, w: 800, h: 450 },
    { id: 39, src: '/3DArtwork/HairyChair-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/HairyChair-compressed.webp', alt: 'Hairy Chair', title: 'Hairy Chair', priority: 50, w: 800, h: 800 },
    { id: 40, src: '/3DArtwork/BlueRoomWCarpet-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/BlueRoomWCarpet-compressed.webp', alt: 'Blue Room with Carpet', title: 'Blue Room with Carpet', priority: 4, w: 640, h: 800 },
    { id: 41, src: '/3DArtwork/Harrison_Stick-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/Harrison_Stick-compressed.webp', alt: 'Harrison Stick', title: 'Harrison Stick', priority: 30, w: 800, h: 800 },
    { id: 42, src: '/3DArtwork/adirn-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/adirn-compressed.webp', alt: 'Adirn', title: 'Adirn', priority: 25, w: 800, h: 800 },
    { id: 43, src: '/3DArtwork/Rainbow-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/Rainbow-compressed.webp', alt: 'Rainbow', title: 'Rainbow', priority: 34, w: 800, h: 800 },
    { id: 44, src: '/3DArtwork/MUNDEN_YELLOW-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/MUNDEN_YELLOW-compressed.webp', alt: 'Munden Yellow', title: 'Munden Yellow', priority: 43, w: 800, h: 450 },
    { id: 45, src: '/3DArtwork/Glass2-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/Glass2-compressed.webp', alt: 'Glass 2', title: 'Glass 2', priority: 47, w: 800, h: 450 },
    { id: 46, src: '/3DArtwork/FullSizeRender2-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/FullSizeRender2-compressed.webp', alt: 'Full Size Render 2', title: 'Full Size Render', priority: 17, w: 800, h: 800 },
    { id: 47, src: '/3DArtwork/comingalongmaybe-compressed.jpg', thumbnailSrc: '/3DArtwork/thumbnails/comingalongmaybe-compressed.webp', alt: 'Coming Along Maybe', title: 'Coming Along Maybe', priority: 58, w: 800, h: 800 },
    { id: 49, src: '/3DArtwork/HM_Room2FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room2FinalEdited-compressed.webp', alt: 'HM Room 2 Final Edited', title: 'HM Room 2', priority: 29, w: 800, h: 481 },
    { id: 50, src: '/3DArtwork/HM_Room3FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room3FinalEdited-compressed.webp', alt: 'HM Room 3 Final Edited', title: 'HM Room 3', priority: 24, w: 800, h: 450 },
    { id: 51, src: '/3DArtwork/HM_Room1FinalEdited-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/HM_Room1FinalEdited-compressed.webp', alt: 'HM Room 1 Final Edited', title: 'HM Room 1', priority: 1, w: 800, h: 450 },
    { id: 52, src: '/3DArtwork/SFalternate1-compressed.png', thumbnailSrc: '/3DArtwork/thumbnails/SFalternate1-compressed.webp', alt: 'SF Alternate 1', title: 'SF Alternate', priority: 13, w: 613, h: 800 },
    { id: 53, src: '/3DArtwork/Falcon.png', thumbnailSrc: '/3DArtwork/thumbnails/Falcon.webp', alt: 'Falcon', title: 'Falcon', priority: 51, w: 800, h: 800 },
    { id: 54, src: '/3DArtwork/BusyGirlCover.png', thumbnailSrc: '/3DArtwork/thumbnails/BusyGirlCover.webp', alt: 'Busy Girl Cover Art', title: 'Busy Girl Cover', priority: 52, w: 800, h: 450 },
    { id: 55, src: '/3DArtwork/BlurCoralInverted.png', thumbnailSrc: '/3DArtwork/thumbnails/BlurCoralInverted.webp', alt: 'Blur Coral Inverted', title: 'Blur Coral Inverted', priority: 53, w: 800, h: 800 },
    { id: 56, src: '/3DArtwork/CowBootsGood copy.png', thumbnailSrc: '/3DArtwork/thumbnails/CowBootsGood copy.webp', alt: 'Cow Boots Good', title: 'Cow Boots Good', priority: 54, w: 800, h: 800 },
    { id: 58, src: '/3DArtwork/Screen Shot 2021-11-24 at 3.50.01 PM copy.png', thumbnailSrc: '/3DArtwork/thumbnails/Screen Shot 2021-11-24 at 3.50.01 PM copy.webp', alt: 'Screen Shot Copy', title: 'Screen Shot Copy', priority: 56, w: 800, h: 407 },
    { id: 59, src: '/3DArtwork/curtains copy.png', thumbnailSrc: '/3DArtwork/thumbnails/curtains copy.webp', alt: 'Curtains Copy', title: 'Curtains Copy', priority: 57, w: 800, h: 450 },
    { id: 60, src: '/3DArtwork/CantFind.png', thumbnailSrc: '/3DArtwork/thumbnails/CantFind.webp', alt: 'Cant Find', title: 'Cant Find', priority: 46, w: 800, h: 800 },
    { id: 61, src: '/3DArtwork/DentistChair.png', thumbnailSrc: '/3DArtwork/thumbnails/DentistChair.webp', alt: 'Dentist Chair', title: 'Dentist Chair', priority: 59, w: 800, h: 600 },
    { id: 62, src: '/3DArtwork/LeafStem.png', thumbnailSrc: '/3DArtwork/thumbnails/LeafStem.webp', alt: 'Leaf Stem', title: 'Leaf Stem', priority: 60, w: 800, h: 800 },
    { id: 63, src: '/3DArtwork/LoveLetter.png', thumbnailSrc: '/3DArtwork/thumbnails/LoveLetter.webp', alt: 'Love Letter', title: 'Love Letter', priority: 61, w: 800, h: 800 },
    { id: 64, src: '/3DArtwork/Roots.png', thumbnailSrc: '/3DArtwork/thumbnails/Roots.webp', alt: 'Roots', title: 'Roots', priority: 11, w: 784, h: 800 },
    { id: 65, src: '/3DArtwork/aeroplane.png', thumbnailSrc: '/3DArtwork/thumbnails/aeroplane.webp', alt: 'Aeroplane', title: 'Aeroplane', priority: 28, w: 800, h: 609 }
  ];

  // Sort by priority once
  const sortedArtwork = useMemo(() => {
    return [...artwork].sort((a, b) => a.priority - b.priority);
  }, []);

  // Compute masonry column assignments using shortest-column-first algorithm
  // This produces the same visual result as CSS column-count but we control placement order
  const columns = useMemo(() => {
    const numCols = getColumnCount(windowWidth);
    const gap = getGap(windowWidth);

    // Initialize columns with their accumulated heights
    const cols = Array.from({ length: numCols }, () => ({ items: [], height: 0 }));

    for (const item of sortedArtwork) {
      // Find shortest column
      let shortestIdx = 0;
      let shortestHeight = cols[0].height;
      for (let c = 1; c < numCols; c++) {
        if (cols[c].height < shortestHeight) {
          shortestIdx = c;
          shortestHeight = cols[c].height;
        }
      }

      // Place item in shortest column - use normalized height (height per unit width = aspect ratio inverted)
      const normalizedHeight = item.h / item.w;
      cols[shortestIdx].items.push(item);
      cols[shortestIdx].height += normalizedHeight + (gap / 100); // gap is approximate, just for balancing
    }

    return cols;
  }, [sortedArtwork, windowWidth]);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector('img[data-src]');
            if (img && img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before entering viewport
        threshold: 0
      }
    );

    // Observe all cards
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [columns]); // Re-observe when columns change (resize)

  // Moderately controlled scroll-to-home: Only when AT TOP + two aggressive scroll ups
  useEffect(() => {
    let scrollUpCount = 0;
    let resetTimeout = null;

    const handleWheel = (e) => {
      if (window.scrollY > 0) {
        scrollUpCount = 0;
        return;
      }

      if (e.deltaY < -80) {
        scrollUpCount++;

        if (resetTimeout) {
          clearTimeout(resetTimeout);
        }

        if (scrollUpCount >= 2) {
          if (goTo) {
            goTo('home');
          }
          scrollUpCount = 0;
        } else {
          resetTimeout = setTimeout(() => {
            scrollUpCount = 0;
          }, 1200);
        }
      }
    };

    const handleScroll = () => {
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

  const openImageCarousel = (img) => {
    setSelectedImage(img);
    setCarouselOpen(true);
  };

  const handleImageMouseMove = useCallback((event, imageId) => {
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

  // Determine how many items from each column are "above the fold" (first ~2 items per column)
  const EAGER_COUNT = 3; // First N items per column load eagerly

  const gap = getGap(windowWidth);

  // Track card ref for IntersectionObserver
  const setCardRef = useCallback((id, el) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  return (
    <div className="works-page">
      {/* Masonry Grid - rendered as flex columns */}
      <div
        className="masonry-grid"
        ref={gridRef}
        style={{
          display: 'flex',
          gap: `${gap}px`,
          width: '100%',
          marginTop: windowWidth <= 480 ? '60px' : windowWidth <= 768 ? '80px' : windowWidth <= 1024 ? '100px' : '120px',
          marginBottom: '24px',
        }}
      >
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className="masonry-column"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: `${gap}px`,
              minWidth: 0, // Allow flex shrink
            }}
          >
            {col.items.map((img, itemIdx) => {
              const isHovered = hoveredImageId === img.id;
              const isDimmed = hoveredImageId && hoveredImageId !== img.id;
              const isEager = itemIdx < EAGER_COUNT;

              return (
                <div
                  key={img.id}
                  ref={(el) => setCardRef(img.id, el)}
                  className={`artwork-card${isHovered ? ' hovered' : ''}${isDimmed ? ' dimmed' : ''}`}
                  onMouseMove={(e) => handleImageMouseMove(e, img.id)}
                  onMouseLeave={handleImageLeave}
                >
                  <img
                    src={isEager ? img.thumbnailSrc : undefined}
                    data-src={isEager ? undefined : img.thumbnailSrc}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    className="artwork-img"
                    onClick={() => openImageCarousel(img)}
                    loading={isEager ? 'eager' : 'lazy'}
                    decoding={isEager ? 'sync' : 'async'}
                    style={{
                      aspectRatio: `${img.w} / ${img.h}`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
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
