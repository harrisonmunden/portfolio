import React from 'react';
import { useCart } from '../contexts/CartContext';
import './CartIcon.css';

const CartIcon = ({ onClick }) => {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <button className="cart-icon" onClick={onClick}>
      <img 
        src="/src/assets/GlassyObjects/CartIcon.png" 
        alt="Shopping Cart" 
        className="cart-icon-image"
      />
      {itemCount > 0 && (
        <span className="cart-badge">{itemCount}</span>
      )}
    </button>
  );
};

export default CartIcon;
