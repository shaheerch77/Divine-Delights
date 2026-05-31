'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ThankYouPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Thank You For Your Order!
        </h1>
        
        <p className="text-gray-700 text-lg mb-6">
          Your custom cake request has been received successfully. Our team is already working on your design.
        </p>
        
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">What's Next?</h3>
          <ul className="text-left text-gray-700 space-y-2">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-rose-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>You'll receive a confirmation email within 15 minutes</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-rose-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Our cake designer will call you within 24 hours</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-rose-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>We'll provide a detailed quote and design mockup</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition"
          >
            Return to Homepage
          </Link>
          
          <Link
            href="/catalog"
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Browse Regular Products
          </Link>
        </div>
        
        <p className="text-gray-600 text-sm mt-8">
          Redirecting to homepage in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}