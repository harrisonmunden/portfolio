import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddToCartModal from './AddToCartModal';
import './ImageCarousel.css';

const ImageCarousel = ({ artwork, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [dominantColor, setDominantColor] = useState('#4ebd8b');
  const [dominantColorDark, setDominantColorDark] = useState('#3a9d73');
  const canvasRef = useRef(null);
  
  // For now, we'll create duplicates of the same image as requested
  // Later you can replace the second image with actual alternate views
  const images = [
    { src: artwork?.src, alt: artwork?.alt },
    { src: artwork?.src, alt: `${artwork?.alt} - Alternative View` } // Duplicate for now
  ];

  // Function to extract dominant color from image
  const extractDominantColor = (imageSrc) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = 1;
      canvas.height = 1;
      
      // Draw image scaled down to 1x1 pixel
      ctx.drawImage(img, 0, 0, 1, 1);
      
      // Get the color data
      const imageData = ctx.getImageData(0, 0, 1, 1);
      const [r, g, b] = imageData.data;
      
      // Convert to hex
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      
      // Adjust brightness to ensure good contrast
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const adjustedColor = brightness > 128 ? 
        `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})` :
        `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`;
      
      // Create darker variant for gradient
      const darkerColor = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;
      
      setDominantColor(adjustedColor);
      setDominantColorDark(darkerColor);
    };
    
    img.src = imageSrc;
  };

  // Comprehensive scroll prevention - but allow scrolling within modals
  const preventScroll = (e) => {
    // Allow scrolling within modal elements
    const target = e.target;
    const isModal = target.closest('.add-to-cart-modal') || 
                   target.closest('.checkout-modal') ||
                   target.closest('.modal-content');
    
    if (isModal) {
      return; // Allow scrolling within modals
    }
    
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Disable/enable body scroll when carousel opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Prevent all scroll events (but allow within modals)
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('keydown', preventScroll, { passive: false });
      
      // Prevent scroll on the carousel overlay itself
      const overlay = document.querySelector('.carousel-overlay');
      if (overlay) {
        overlay.addEventListener('wheel', preventScroll, { passive: false });
        overlay.addEventListener('touchmove', preventScroll, { passive: false });
      }
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Remove scroll event listeners
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventScroll);
      
      // Remove overlay scroll listeners
      const overlay = document.querySelector('.carousel-overlay');
      if (overlay) {
        overlay.removeEventListener('wheel', preventScroll);
        overlay.removeEventListener('touchmove', preventScroll);
      }
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && artwork) {
      setCurrentImageIndex(0);
      setImageLoaded(false);
      // Extract color from the current image
      extractDominantColor(artwork.src);
    }
  }, [isOpen, artwork]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setImageLoaded(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageLoaded(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    // Allow only specific keys for carousel navigation
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevImage();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextImage();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else {
      // Prevent all other key events
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !artwork) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="carousel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="carousel-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hidden canvas for color extraction */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* Close button */}
          <button className="carousel-close" onClick={onClose}>
            ×
          </button>

          {/* Title in top left */}
          <div className="carousel-title-bar">
            <h2 className="carousel-title">{artwork.title}</h2>
            {images.length > 1 && (
              <div className="carousel-counter">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Main content area */}
          <div className="carousel-main-content">
            {/* Image container */}
            <div className="carousel-image-container">
              {!imageLoaded && (
                <div className="carousel-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading...</p>
                </div>
              )}
              
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                className={`carousel-image ${imageLoaded ? 'loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: imageLoaded ? 1 : 0, x: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button className="carousel-nav prev" onClick={prevImage}>
                    ‹
                  </button>
                  <button className="carousel-nav next" onClick={nextImage}>
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Bottom panel with controls */}
            <div className="carousel-bottom-panel">
              <div className="carousel-controls">
                {/* Thumbnail navigation */}
                {images.length > 1 && (
                  <div className="carousel-thumbnails">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={`carousel-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setImageLoaded(false);
                        }}
                      >
                        <img src={artwork.thumbnailSrc} alt={`View ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  className="carousel-add-to-cart"
                  onClick={() => setShowAddToCart(true)}
                  style={{ 
                    '--button-color': dominantColor,
                    '--button-color-dark': dominantColorDark
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add to Cart Modal */}
        <AddToCartModal
          artwork={artwork}
          isOpen={showAddToCart}
          onClose={() => setShowAddToCart(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageCarousel;
