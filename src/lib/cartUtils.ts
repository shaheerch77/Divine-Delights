import { CartItem } from '@/types/cart';

// Calculate cart totals
export function calculateCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
}

// Generate unique cart session ID
export function generateSessionId() {
  return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Save cart to localStorage
export function saveCartToLocalStorage(cart: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// Load cart from localStorage
export function loadCartFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : null;
  }
  return null;
}

// Clear cart from localStorage
export function clearCartFromLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cart');
  }
}