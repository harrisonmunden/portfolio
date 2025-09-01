import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import './CartIcon.css';

const CartIcon = ({ onClick }) => {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <motion.div
      className="cart-icon-container"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="cart-icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H19M17 13H15M9 22C10.1 22 11 21.1 11 20C11 18.9 10.1 18 9 18C7.9 18 7 18.9 7 20C7 21.1 7.9 22 9 22ZM20 22C21.1 22 22 21.1 22 20C22 18.9 21.1 18 20 18C18.9 18 18 18.9 18 20C18 21.1 18.9 22 20 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {itemCount > 0 && (
          <motion.div
            className="cart-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {itemCount}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CartIcon;
