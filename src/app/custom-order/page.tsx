'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const cakeTypes = [
  'Birthday Cake',
  'Wedding Cake',
  'Anniversary Cake',
  'Custom Design',
  'Cupcakes',
  'Cheesecake',
  'Theme Cake',
];

const cakeFlavors = [
  'Chocolate Fudge',
  'Vanilla Bean',
  'Red Velvet',
  'Lemon Zest',
  'Strawberry',
  'Coffee Mocha',
  'Caramel Crunch',
];

const cakeSizes = ['6 inch', '8 inch', '10 inch', '12 inch', 'Tiered Custom'];

const occasions = [
  'Birthday',
  'Wedding',
  'Anniversary',
  'Baby Shower',
  'Graduation',
  'Corporate Event',
  'Other',
];

interface CustomOrderForm {
  name: string;
  email: string;
  phone: string;
  cakeType: string;
  flavor: string;
  size: string;
  occasion: string;
  designDescription: string;
  deliveryDate: string;
  budget: string;
  specialInstructions: string;
}

export default function CustomOrderPage() {
  const router = useRouter();

  const [form, setForm] = useState<CustomOrderForm>({
    name: '',
    email: '',
    phone: '',
    cakeType: '',
    flavor: '',
    size: '',
    occasion: '',
    designDescription: '',
    deliveryDate: '',
    budget: '',
    specialInstructions: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [heroVisible, setHeroVisible] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.cakeType || !form.deliveryDate) {
      setError('Please fill in your name, phone, cake type, and delivery date.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Optional: get logged-in user from localStorage (same pattern as cart)
      let user: { _id?: string; email?: string; name?: string } | null = null;
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

      // Build payload for /api/orders
      const orderPayload = {
        orderType: 'custom', // so you can distinguish in admin
        userId: user?._id || null,
        userEmail: user?.email || form.email || null,
        customerName: form.name,
        customerPhone: form.phone,
        budget: form.budget ? Number(form.budget) : null,
        customOrderDetails: {
          cakeType: form.cakeType,
          flavor: form.flavor || null,
          size: form.size || null,
          occasion: form.occasion || null,
          designDescription: form.designDescription,
          deliveryDate: form.deliveryDate,
          specialInstructions: form.specialInstructions || null,
        },
        // keep items empty – orderUtils will set totals to 0
        items: [],
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit custom order');
      }

      setSuccess(true);
      setToast({
        message: data.orderNumber
          ? `Custom order placed! Order #${data.orderNumber}`
          : 'Your custom order request has been submitted! We will contact you soon.',
        visible: true,
      });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 2500);

      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        cakeType: '',
        flavor: '',
        size: '',
        occasion: '',
        designDescription: '',
        deliveryDate: '',
        budget: '',
        specialInstructions: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 text-gray-900 relative">
      {/* Outer container */}
      <div
        className={`max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-16 transform transition-all duration-700 ease-out ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Header / Hero Section */}
        <section className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <p className="inline-flex items-center text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full shadow-sm">
              🎂 Custom Creations • Designed Just for You
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">
              Create Your Dream Cake with{' '}
              <span className="text-rose-600">Divine Delights</span>
            </h1>
            <p className="text-gray-700 text-base sm:text-lg">
              Share your ideas, themes, and flavors — our artisans will turn
              your imagination into a beautiful, delicious centerpiece for your
              special day.
            </p>
            <div className="flex gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <span>Personalized designs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🚚</span>
                <span>Delivery all over Lahore</span>
              </div>
            </div>
          </div>

          {/* Right-side Hero Image */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative group w-full max-w-xs">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-rose-200 to-orange-200 blur-2xl opacity-40 group-hover:opacity-60 transition" />
              <div className="relative rounded-3xl shadow-2xl overflow-hidden">
                <img
  src="/images/custom-cake.jpeg"
  alt="Custom Cake"
  className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-500"
/>
              </div>
            </div>
          </div>
        </section>

        {/* Main content: form + info */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Custom Order Request Form
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill in the details below and our team will contact you to confirm
              design, pricing, and delivery time.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-2">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
                ✅ Your request has been received! We will get in touch shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row: Name + Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="03xx-xxxxxxx"
                    required
                  />
                </div>
              </div>

              {/* Row: Email + Occasion */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occasion
                  </label>
                  <select
                    name="occasion"
                    value={form.occasion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select an occasion</option>
                    {occasions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row: Cake Type + Flavor + Size */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cake Type *
                  </label>
                  <select
                    name="cakeType"
                    value={form.cakeType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
                    required
                  >
                    <option value="">Select type</option>
                    {cakeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flavor
                  </label>
                  <select
                    name="flavor"
                    value={form.flavor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select flavor</option>
                    {cakeFlavors.map((flavor) => (
                      <option key={flavor} value={flavor}>
                        {flavor}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select size</option>
                    {cakeSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row: Delivery date + Budget */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={form.deliveryDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (PKR)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="e.g. 5000–15000"
                  />
                </div>
              </div>

              {/* Design Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Design Details / Theme *
                </label>
                <textarea
                  name="designDescription"
                  value={form.designDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="Share colors, theme, message on cake, number of servings, etc."
                  required
                />
              </div>

              {/* Special instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions (optional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={form.specialInstructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  placeholder="Allergies, delivery time preference, writing on cake, etc."
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-rose-600 to-orange-500 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-rose-700 hover:to-orange-600 transition disabled:opacity-60"
                >
                  {loading ? 'Submitting...' : 'Submit Custom Order'}
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/catalog')}
                  className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                >
                  Browse ready-made cakes →
                </button>
              </div>
            </form>
          </div>

          {/* Info panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              How Custom Orders Work
            </h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 mb-4">
              <li>Fill in the form with your cake details and delivery date.</li>
              <li>Our team will contact you via call or WhatsApp for confirmation.</li>
              <li>We finalize design, price and advance payment.</li>
              <li>Your cake is crafted fresh and delivered on the selected date.</li>
            </ol>

            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900">Lead Time</p>
                <p>• 24–48 hours for simple cakes</p>
                <p>• 3–5 days for 3D / wedding / tiered designs</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">Delivery & Pickup</p>
                <p>• Delivery available across Lahore</p>
                <p>• Pickup available from our kitchen outlet</p>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900 mb-1">Need urgent help?</p>
                <p className="text-rose-600 font-semibold">📞 03xx-xxxxxxx</p>
                <p className="text-gray-700 text-sm mt-1">
                  Mon–Sun: 8:00 AM – 10:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
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
