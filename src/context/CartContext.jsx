import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing cart from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product && item.product._id === product._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.product && item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product && item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product && item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => {
      if (item && item.product && typeof item.product.price === 'number') {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const getCartCount = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((count, item) => {
      if (item && typeof item.quantity === 'number') {
        return count + item.quantity;
      }
      return count;
    }, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    cartTotal: getCartTotal(),
    cartCount: getCartCount()
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
