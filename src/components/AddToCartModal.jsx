import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import './AddToCartModal.css';

const AddToCartModal = ({ artwork, isOpen, onClose }) => {
  const { addToCart, getSizesForArtwork } = useCart();
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);

  const availableSizes = getSizesForArtwork(artwork);

  const handleAddToCart = () => {
    addToCart(artwork, selectedSize, quantity);
    onClose();
  };

  const selectedSizeObj = availableSizes.find(s => s.id === selectedSize);
  const totalPrice = selectedSizeObj.price * quantity;

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
                    {availableSizes.map(size => (
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
