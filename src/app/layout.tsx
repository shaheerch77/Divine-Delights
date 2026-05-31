import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/lib/CartContext';  // ✅ use lib here

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Divine Delights - Heavenly Baked Goods',
  description: 'Discover our delicious collection of cakes, pastries, cookies and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
