import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import CheckoutModal from './CheckoutModal';
import './CartPage.css';

const CartPage = ({ goTo, onCheckoutOpenChange }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  // Ensure scrolling is enabled when cart page loads
  useEffect(() => {
    // Reset any scroll locks that might be active
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Remove any scroll event listeners that might be preventing scroll
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    document.removeEventListener('wheel', preventScroll);
    document.removeEventListener('touchmove', preventScroll);
    document.removeEventListener('keydown', preventScroll);
    
    // Cleanup function to ensure scroll is restored when leaving cart
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Notify parent when checkout opens/closes to fade navigation
  useEffect(() => {
    if (onCheckoutOpenChange) {
      onCheckoutOpenChange(showCheckout);
    }
  }, [showCheckout, onCheckoutOpenChange]);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <motion.h1
            className="cart-title"
            onClick={() => goTo && goTo('prints-for-sale')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Cart</span>
            <motion.img 
              src="/GlassyObjects/About/Chevron.png" 
              alt="chevron" 
              className="chevron-img"
              style={{ width: 55, transform: 'rotate(90deg)' }}
            />
          </motion.h1>
        </div>

        <div className="empty-cart">
          <div className="empty-cart-content">
            <h2>Your cart is empty</h2>
            <p>Discover beautiful artwork to add to your collection</p>
            <button 
              className="browse-artwork-btn"
              onClick={() => goTo && goTo('prints-for-sale')}
            >
              Browse Artwork
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <motion.h1
          className="cart-title"
          onClick={() => goTo && goTo('prints-for-sale')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>Cart</span>
          <motion.img 
            src="/GlassyObjects/About/Chevron.png" 
            alt="chevron" 
            className="chevron-img"
            style={{ width: 55, transform: 'rotate(90deg)' }}
          />
        </motion.h1>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="cart-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="item-image">
                <img src={item.artwork.thumbnailSrc} alt={item.artwork.title} />
              </div>
              
              <div className="item-details">
                <h3 className="item-title">{item.artwork.title}</h3>
                <div className="item-specs">
                  <span className="spec">Size: {item.size.name}</span>
                  <span className="spec">Quality: {item.quality.name}</span>
                </div>
                <div className="item-price">${item.price.toFixed(2)}</div>
              </div>
              
              <div className="item-controls">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="summary-row">
            <span>Items ({getTotalItems()})</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          
          <button
            className="checkout-btn"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          items={items}
          total={getTotalPrice()}
        />
      )}
    </div>
  );
};

export default CartPage;
