"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_KEY = "shree-shyam-cart";
const CartContext = createContext(null);

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setCart(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    function addToCart(product, size, qty = 1) {
      setCart((current) => {
        const key = `${product.id}-${size}`;
        const existing = current.find((item) => item.key === key);
        if (existing) {
          return current.map((item) =>
            item.key === key ? { ...item, qty: Math.min(8, item.qty + qty) } : item
          );
        }
        return [
          ...current,
          {
            key,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size,
            qty,
          },
        ];
      });
      setOrder(null);
      setToast(`${product.name} added to your bag`);
    }

    function updateQty(key, qty) {
      setCart((current) =>
        current.map((item) => (item.key === key ? { ...item, qty } : item))
      );
    }

    function removeItem(key) {
      setCart((current) => current.filter((item) => item.key !== key));
    }

    function checkout() {
      if (!cart.length) return;
      setOrder({
        id: `SSE${Date.now().toString().slice(-6)}`,
        pieces: count,
        total: subtotal,
      });
      setCart([]);
    }

    return {
      cart,
      count,
      subtotal,
      cartOpen,
      setCartOpen,
      toast,
      setToast,
      order,
      setOrder,
      addToCart,
      updateQty,
      removeItem,
      checkout,
    };
  }, [cart, cartOpen, order, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return value;
}
