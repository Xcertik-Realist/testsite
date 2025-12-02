"use client";

import { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedStand?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: any) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React<|eos|>
