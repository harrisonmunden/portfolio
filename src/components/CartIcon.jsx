import React from 'react';
import { useCart } from '../contexts/CartContext';
import './CartIcon.css';

const CartIcon = ({ onClick, isMobile = false }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  // Determine size based on context (navigation vs fixed floating)
  const isNavigation = isMobile !== undefined;
  const iconSize = isNavigation && isMobile ? 60 : isNavigation ? 80 : 120;

  return (
    <div 
      className="cart-icon" 
      onClick={onClick}
      style={isNavigation ? {
        position: 'relative',
        bottom: 'auto',
        right: 'auto',
        left: 'auto',
        top: 'auto',
        zIndex: 'auto'
      } : {}}
    >
      <img
        src="/GlassyObjects/About/CartIcon.svg"
        alt="Cart"
        className="cart-icon-image"
        style={{
          width: iconSize,
          height: iconSize,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          padding: isNavigation && isMobile ? 8 : isNavigation ? 10 : 15,
          boxShadow: '0 0 60px rgba(255, 255, 255, 0.3), 0 0 120px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.2)',
        }}
      />
      {totalItems > 0 && (
        <div 
          className="cart-badge"
          style={{
            width: isNavigation && isMobile ? 24 : isNavigation ? 30 : 40,
            height: isNavigation && isMobile ? 24 : isNavigation ? 30 : 40,
            fontSize: isNavigation && isMobile ? 12 : isNavigation ? 14 : 18,
            top: isNavigation && isMobile ? -5 : isNavigation ? -8 : -5,
            right: isNavigation && isMobile ? -2 : isNavigation ? 0 : 5,
          }}
        >
          {totalItems}
        </div>
      )}
    </div>
  );
};

export default CartIcon;
