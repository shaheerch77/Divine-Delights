'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients: string[];
}

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [heroVisible, setHeroVisible] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  // Fetch featured products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/catalog');
        const data: Product[] = await response.json();

        setFeaturedProducts(data.slice(0, 6));
        const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Hero entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product, quantity?: number) => {
    const qty = quantity ?? quantities[product._id] ?? 1;

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: qty,
    });

    setToast({
      message: `Added ${qty} × ${product.name} to your cart`,
      visible: true,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2000);
  };

  // Use first featured product image as hero fallback
  const heroImage =
    featuredProducts[0]?.image || '/images/hero-cake.jpg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 text-gray-900 relative">
      {/* HERO SECTION */}
      <section
        className={`w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 pt-16 pb-12 gap-10 transform transition-all duration-700 ease-out ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* LEFT SIDE */}
        <div className="max-w-xl space-y-6">
          <p className="inline-flex items-center text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full shadow-sm">
            ✨ Freshly baked daily • Delivery in Lahore
          </p>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
            Divine Delights –{' '}
            <span className="text-rose-600 block">Heaven in Every Bite</span>
          </h1>

          <p className="text-gray-700 text-lg">
            From rich fudge cakes to delicate pastries, every treat is crafted
            with love, premium ingredients, and a touch of magic.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/catalog')}
              className="bg-rose-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-rose-700 hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              Order Now
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="border border-rose-600 text-rose-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-rose-50 transition"
            >
              View Cart
            </button>
          </div>

          <div className="flex gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧁</span>
              <span>Custom cakes & cupcakes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚚</span>
              <span>Same-day delivery (T&amp;C apply)</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative group w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-rose-200 to-orange-200 blur-2xl opacity-40 group-hover:opacity-60 transition" />
            <div className="relative rounded-3xl shadow-2xl overflow-hidden">
              <img
                src={heroImage}
                alt="Delicious Cake"
                className="w-full h-64 sm:h-72 md:h-80 object-cover transform group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-6 md:px-12 lg:px-20 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Featured Delights</h2>
          <button
            onClick={() => router.push('/catalog')}
            className="text-rose-600 hover:text-rose-700 text-sm font-medium"
          >
            View full catalog →
          </button>
        </div>

        {loading ? (
          // Skeletons
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-4 animate-pulse"
              >
                <div className="h-44 w-full bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-4" />
                <div className="flex justify-between items-center mt-2">
                  <div className="h-5 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const qty = quantities[product._id] ?? 1;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
                >
                  <div className="relative h-44 w-full mb-4 overflow-hidden rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-1 text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-rose-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(product._id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product._id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product, qty)}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-rose-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🛒</span> Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CATEGORY LIST */}
      <section className="px-6 md:px-12 lg:px-20 pb-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Shop by Category
        </h2>

        {categories.length === 0 ? (
          <p className="text-gray-600 text-sm">Categories will appear here.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => router.push(`/catalog?category=${category}`)}
                className="px-6 py-3 rounded-full bg-white shadow text-gray-800 font-medium hover:bg-rose-50 hover:text-rose-700 transition whitespace-nowrap"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* TOAST */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2">
            <span>✅</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
