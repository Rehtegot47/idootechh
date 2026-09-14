import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'idootech_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add = (product, qty=1) => {
    setItems(prev => {
      const found = prev.find(p=>p.id===product.id);
      if (found) return prev.map(p=>p.id===product.id?{...p, qty: p.qty+qty}:p);
      return [...prev, { id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.image, qty }];
    });
  };
  const remove = (id) => setItems(prev=>prev.filter(p=>p.id!==id));
  const updateQty = (id, qty) => setItems(prev=>prev.map(p=>p.id===id?{...p, qty: Math.max(1,qty)}:p));
  const clear = () => setItems([]);
  const total = items.reduce((s,p)=>s+p.price*p.qty,0);
  const count = items.reduce((s,p)=>s+p.qty,0);

  return <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count }}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
