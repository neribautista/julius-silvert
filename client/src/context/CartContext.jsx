import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart when user signs in
  useEffect(() => {
    if (user) {
      cartAPI.get().then(({ data }) => setItems(data)).catch(() => {});
    } else {
      setItems([]);
    }
  }, [user]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setItems(data);
    } finally { setLoading(false); }
  }, []);

  const removeItem = useCallback(async (productId) => {
    const { data } = await cartAPI.remove(productId);
    setItems(data);
  }, []);

  const clearCart = useCallback(async () => {
    await cartAPI.clear();
    setItems([]);
  }, []);

  const itemCount  = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal   = items.reduce((s, i) => s + (i.product?.pricePerLb || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, itemCount, subtotal, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
