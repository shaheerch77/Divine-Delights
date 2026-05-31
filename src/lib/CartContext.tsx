"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  quantity: number;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface CartContextType {
  cart: CartData;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

// Create empty context
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calculate totals
  const calculateTotals = (updatedItems: CartItem[]) => {
    const subtotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = subtotal > 0 ? 5 : 0; // or your rule
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  // Add product
  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);

      const updated = existing
        ? prev.map((i) =>
            i.productId === newItem.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...prev, { ...newItem, quantity: 1 }];

      return updated;
    });
  };

  // Remove product
  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);

    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  // Clear cart
  const clearCart = () => setItems([]);

  // Total count
  const getTotalItems = () =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const totals = calculateTotals(items);

  return (
    <CartContext.Provider
      value={{
        cart: {
          items,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
        },
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
