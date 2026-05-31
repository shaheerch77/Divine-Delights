'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useEffect, useState } from 'react';

interface AppUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: 'customer' | 'admin';
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems } = useCart();

  const [user, setUser] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAdmin(parsed.role === 'admin');
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
    setIsAdmin(false);
    router.push('/login');
  };

  const navLinkClass = (href: string) =>
    `text-sm font-medium ${
      pathname === href ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
    } transition`;

  const totalItems = getTotalItems();

  return (
    <header className="bg-white/80 backdrop-blur border-b border-rose-50 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-rose-600">Divine Delights</span>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={navLinkClass('/')}>
            Home
          </Link>
          <Link href="/catalog" className={navLinkClass('/catalog')}>
            Products
          </Link>
          <Link href="/custom-order" className={navLinkClass('/custom-order')}>
            Custom Order
          </Link>
          <Link href="/cart" className={navLinkClass('/cart')}>
            <span className="relative inline-flex items-center">
              Cart
              {totalItems > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-rose-600 text-white text-xs w-5 h-5">
                  {totalItems}
                </span>
              )}
            </span>
          </Link>

          {/* Admin-only nav links */}
          {isAdmin && (
            <>
              <Link href="/admin/users" className={navLinkClass('/admin/users')}>
                Users
              </Link>
              <Link href="/admin/orders" className={navLinkClass('/admin/orders')}>
                Orders
              </Link>
            </>
          )}
        </nav>

        {/* Right: Auth / Admin badge */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
              ADMIN
            </span>
          )}

          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-700">
                Hi, <span className="font-semibold">{user.name || 'User'}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-rose-600"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
