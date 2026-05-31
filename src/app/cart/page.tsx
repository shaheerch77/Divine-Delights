'use client';

import { useCart } from '@/lib/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

interface LocalUser {
  _id?: string;
  email?: string;
  name?: string;
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalItems } =
    useCart();

  const router = useRouter();

  const [pageVisible, setPageVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  // Order modal + confetti
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageVisible(true), 40);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: msg, visible: false }), 2200);
  };

  const handleContinueShopping = () => {
    setShowOrderModal(false);
    router.push('/catalog');
  };

  const handleBackToCart = () => {
    setShowOrderModal(false);
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;

    setLoading(true);
    setShowConfetti(false);

    try {
      // optional user info from localStorage
      let user: LocalUser | null = null;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            user = JSON.parse(stored);
          } catch {
            user = null;
          }
        }
      }

      const orderPayload = {
        userId: user?._id || null,
        userEmail: user?.email || null,
        items: cart.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        tax: cart.tax,
        total: cart.total,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Order failed');
      }

      setOrderNumber(data.orderNumber || 'N/A');
      setShowOrderModal(true);
      setShowConfetti(true);
      clearCart(); // clear after success
    } catch (err: any) {
      console.error('Checkout error:', err);
      showToast(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const totalItems = getTotalItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 text-gray-900 relative">
      {/* Confetti on order success */}
      {showConfetti && (
        <Confetti recycle={false} numberOfPieces={350} gravity={0.9} />
      )}

      <div
        className={`max-w-6xl mx-auto px-4 py-12 transform transition-all duration-700 ease-out ${
          pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* IF CART EMPTY (but still allow modal on top) */}
        {totalItems === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-12 h-12 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-700 mb-8">
                Browse our delicious treats and fill your cart!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/catalog"
                  className="bg-rose-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-rose-700 transition"
                >
                  Browse Products
                </Link>
                <Link
                  href="/"
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Your Shopping Cart
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Cart Items ({totalItems})
                    </h2>
                    <button
                      onClick={() => {
                        clearCart();
                        showToast('Cart cleared');
                      }}
                      className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cart.items.map((item) => (
                      <div
                        key={item.productId}
                        className="p-6 flex flex-col sm:flex-row gap-6"
                      >
                        {/* Image */}
                        <div className="sm:w-32 sm:h-32 w-full h-48 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-700">
                                {item.category}
                              </p>
                              <p className="text-rose-600 font-bold text-xl">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                removeFromCart(item.productId);
                                showToast('Item removed');
                              }}
                              className="text-gray-500 hover:text-red-600 transition"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Quantity controls */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {/* MINUS */}
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1,
                                    );
                                    showToast('Quantity updated');
                                  }
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-400 transition shadow-sm"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14"
                                  />
                                </svg>
                              </button>

                              {/* Quantity number */}
                              <span className="min-w-[2rem] text-center text-lg font-semibold text-gray-900">
                                {item.quantity}
                              </span>

                              {/* PLUS */}
                              <button
                                onClick={() => {
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                  );
                                  showToast('Quantity updated');
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-400 transition shadow-sm"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 5v14M5 12h14"
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-gray-700">Item Total</p>
                              <p className="text-xl font-bold text-rose-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue shopping */}
                <button
                  onClick={() => router.push('/catalog')}
                  className="mt-6 flex items-center text-rose-600 hover:text-rose-700 font-medium transition"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue Shopping
                </button>
              </div>

              {/* Order summary */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ${cart.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Shipping</span>
                      <span className="font-medium text-gray-900">
                        {cart.shipping === 0
                          ? 'FREE'
                          : `$${cart.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tax (8%)</span>
                      <span className="font-medium text-gray-900">
                        ${cart.tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-rose-600">
                          ${cart.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={loading || totalItems === 0}
                    className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-rose-700 hover:to-orange-600 transition disabled:opacity-50"
                  >
                    {loading ? 'Processing…' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2">
            <span>🍰</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Order Modal (always rendered above everything) */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thanks for ordering! 🎉
            </h2>
            <p className="text-gray-700 mb-4">
              Your order has been placed successfully.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Your order number is:{' '}
              <span className="font-mono font-semibold text-rose-600">
                {orderNumber}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleContinueShopping}
                className="flex-1 bg-rose-600 text-white py-2 rounded-lg font-medium hover:bg-rose-700 transition"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleBackToCart}
                className="flex-1 border border-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Return to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
