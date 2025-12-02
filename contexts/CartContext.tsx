"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedStand?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("scandi-cart");
      if (saved) setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("scandi-cart", JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (product: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i =>
        i.id === product.id &&
        i.selectedSize === product.selectedSize &&
        i.selectedStand === product.selectedStand
      );
      if (existing) {
        return prev.map(i => 
          i.id === product.id && i.selectedSize === product.selectedSize && i.selectedStand === product.selectedStand 
          ? { ...i, quantity: i.quantity + product.quantity } 
          : i
        );
      }
      return [...prev, { ...product }];
    });
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
