import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Print sizes organized by aspect ratio category
// Prices from Photoworks SF fine art prints (first print pricing)
const PRINT_SIZES_BY_ASPECT = {
  square: [
    { id: 'small', name: '8×8"', price: 30, dimensions: '8" × 8"' },
    { id: 'medium', name: '12×12"', price: 38, dimensions: '12" × 12"' },
    { id: 'large', name: '20×20"', price: 75, dimensions: '20" × 20"' },
    { id: 'xlarge', name: '30×30"', price: 130, dimensions: '30" × 30"' },
  ],
  portrait_4x5: [
    { id: 'small', name: '8×10"', price: 34, dimensions: '8" × 10"' },
    { id: 'medium', name: '11×14"', price: 40, dimensions: '11" × 14"' },
    { id: 'large', name: '16×20"', price: 65, dimensions: '16" × 20"' },
    { id: 'xlarge', name: '24×30"', price: 115, dimensions: '24" × 30"' },
  ],
  landscape_16x9: [
    { id: 'small', name: '9×6"', price: 28, dimensions: '9" × 6"' },
    { id: 'medium', name: '12×8"', price: 36, dimensions: '12" × 8"' },
    { id: 'large', name: '19×13"', price: 45, dimensions: '19" × 13"' },
    { id: 'xlarge', name: '40×20"', price: 125, dimensions: '40" × 20"' },
  ],
  landscape_4x3: [
    { id: 'small', name: '12×9"', price: 38, dimensions: '12" × 9"' },
    { id: 'medium', name: '16×12"', price: 40, dimensions: '16" × 12"' },
    { id: 'large', name: '24×18"', price: 75, dimensions: '24" × 18"' },
    { id: 'xlarge', name: '40×30"', price: 160, dimensions: '40" × 30"' },
  ],
};

// Default flat array for backward compatibility
const PRINT_SIZES = PRINT_SIZES_BY_ASPECT.square;

// Helper to get sizes for a specific artwork based on its aspectRatio field
const getSizesForArtwork = (artwork) => {
  if (artwork && artwork.aspectRatio && PRINT_SIZES_BY_ASPECT[artwork.aspectRatio]) {
    return PRINT_SIZES_BY_ASPECT[artwork.aspectRatio];
  }
  return PRINT_SIZES;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const { artwork, size, quantity = 1 } = action.payload;
      const artworkSizes = getSizesForArtwork(artwork);
      const sizeObj = artworkSizes.find(s => s.id === size);
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
    PRINT_SIZES,
    PRINT_SIZES_BY_ASPECT,
    getSizesForArtwork
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

export { PRINT_SIZES, PRINT_SIZES_BY_ASPECT, getSizesForArtwork };
