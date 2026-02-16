import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const PRINT_SIZES = [
  { id: 'small', name: '8x10"', price: 43, dimensions: '8" × 10"' },
  { id: 'medium', name: '11x14"', price: 50, dimensions: '11" × 14"' },
  { id: 'large', name: '16x20"', price: 81, dimensions: '16" × 20"' },
  { id: 'xlarge', name: '24x36"', price: 156, dimensions: '24" × 36"' }
];

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const { artwork, size, quantity = 1 } = action.payload;
      const sizeObj = PRINT_SIZES.find(s => s.id === size);
      const price = sizeObj.price;

      const cartItem = {
        id: `${artwork.id}-${size}`,
        artwork,
        size: sizeObj,
        quantity,
        price,
        totalPrice: price * quantity
      };

      const existingItemIndex = state.items.findIndex(item => item.id === cartItem.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity;
        return {
          ...state,
          items: updatedItems
        };
      }

      return {
        ...state,
        items: [...state.items, cartItem]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      const { itemId, newQuantity } = action.payload;
      if (newQuantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });

  // Persist cart to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('artworkCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach(item => {
          dispatch({ type: 'ADD_TO_CART', payload: {
            artwork: item.artwork,
            size: item.size.id,
            quantity: item.quantity
          }});
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('artworkCart', JSON.stringify(state));
  }, [state]);

  const addToCart = (artwork, size, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { artwork, size, quantity }
    });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId, newQuantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, newQuantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    PRINT_SIZES
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { PRINT_SIZES };
