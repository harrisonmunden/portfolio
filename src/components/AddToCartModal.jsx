import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import './AddToCartModal.css';

const AddToCartModal = ({ artwork, isOpen, onClose }) => {
  const { addToCart, PRINT_SIZES, PRINT_QUALITIES } = useCart();
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedQuality, setSelectedQuality] = useState('standard');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(artwork, selectedSize, selectedQuality, quantity);
    onClose();
  };

  const selectedSizeObj = PRINT_SIZES.find(s => s.id === selectedSize);
  const selectedQualityObj = PRINT_QUALITIES.find(q => q.id === selectedQuality);
  const totalPrice = Math.round(selectedSizeObj.price * selectedQualityObj.priceMultiplier * quantity);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="add-to-cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="add-to-cart-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose}>×</button>
            
            <div className="modal-content">
              <div className="artwork-preview">
                <img src={artwork.thumbnailSrc} alt={artwork.alt} />
                <h3>{artwork.title}</h3>
              </div>

              <div className="print-options">
                <div className="option-group">
                  <h4>Print Size</h4>
                  <div className="size-options">
                    {PRINT_SIZES.map(size => (
                      <label key={size.id} className={`size-option ${selectedSize === size.id ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="size"
                          value={size.id}
                          checked={selectedSize === size.id}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        />
                        <div className="size-info">
                          <span className="size-name">{size.name}</span>
                          <span className="size-dimensions">{size.dimensions}</span>
                          <span className="size-price">${size.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="option-group">
                  <h4>Print Quality</h4>
                  <div className="quality-options">
                    {PRINT_QUALITIES.map(quality => (
                      <label key={quality.id} className={`quality-option ${selectedQuality === quality.id ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="quality"
                          value={quality.id}
                          checked={selectedQuality === quality.id}
                          onChange={(e) => setSelectedQuality(e.target.value)}
                        />
                        <div className="quality-info">
                          <span className="quality-name">{quality.name}</span>
                          <span className="quality-description">{quality.description}</span>
                          <span className="quality-multiplier">
                            {quality.priceMultiplier === 1 ? 'Base price' : `+${Math.round((quality.priceMultiplier - 1) * 100)}%`}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="quantity-group">
                  <h4>Quantity</h4>
                  <div className="quantity-selector">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                <div className="price-summary">
                  <div className="total-price">
                    Total: ${totalPrice}
                  </div>
                </div>

                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartModal;
