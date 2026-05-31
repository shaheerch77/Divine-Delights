'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

const sortOptions = [
  { id: 'newest', name: 'Newest' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'name', name: 'Name: A to Z' },
];

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('newest');

  const { addToCart } = useCart();

  const [pageVisible, setPageVisible] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/catalog');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPageVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    const sorted = [...list];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  }, [products, selectedCategory, sortBy]);

  const categories = [
    { id: 'all', name: 'All Products' },
    ...Array.from(new Set(products.map((p) => p.category))).map((c) => ({
      id: c,
      name: c.charAt(0).toUpperCase() + c.slice(1),
    })),
  ];

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
    });

    setToast({
      message: `Added ${product.name} to your cart`,
      visible: true,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div
          className={`max-w-7xl mx-auto px-6 md:px-12 py-8 transform transition-all duration-500 ${
            pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Our Bakery Collection
              </h1>
              <p className="text-gray-700">
                Discover {products.length} heavenly baked goods
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 text-gray-800 text-sm rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <Link
                href="/cart"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition"
              >
                View Cart →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`max-w-7xl mx-auto px-6 md:px-12 py-8 transform transition-all duration-500 ${
          pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const count =
                    category.id === 'all'
                      ? products.length
                      : products.filter((p) => p.category === category.id).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition ${
                        selectedCategory === category.id
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedCategory === category.id
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
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
            ) : filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
                  >
                    <div className="relative h-44 w-full mb-4 overflow-hidden rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-2xl font-bold text-rose-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  No products available in the selected category.
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-rose-600 hover:underline font-medium"
                >
                  View all products →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
