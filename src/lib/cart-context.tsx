"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { generateCartWhatsAppMessage, getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "./whatsapp";

export interface CartItemType {
  id: string; // productId
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  freeShippingRemaining: number;
  openCartWhatsApp: (customerName?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 3000;
const STANDARD_SHIPPING_FEE = 200;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("veloura_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("veloura_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItemType, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, item.stock);
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i));
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.stock || 1) }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    return acc + activePrice * item.quantity;
  }, 0);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const openCartWhatsApp = (customerName?: string) => {
    if (items.length === 0) return;
    const msg = generateCartWhatsAppMessage({
      customerName,
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.salePrice && i.salePrice > 0 ? i.salePrice : i.price,
      })),
      total,
    });
    window.open(getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER, msg), "_blank");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        shippingFee,
        total,
        freeShippingRemaining,
        openCartWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
