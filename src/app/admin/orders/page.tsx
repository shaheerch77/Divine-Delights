'use client';

import { useEffect, useState } from 'react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface AdminOrder {
  _id: string;
  orderNumber?: string;
  userEmail?: string;
  userId?: string;
  items?: OrderItem[];
  total?: number;
  status?: string;
  createdAt?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Admin – Orders
        </h1>

        {loading && <p className="text-gray-800">Loading orders...</p>}

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full text-left text-sm text-gray-900">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Items
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Total
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b last:border-0 align-top">
                    <td className="px-4 py-3 font-mono text-xs text-gray-900">
                      {o.orderNumber || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {o.userEmail || o.userId || 'Guest'}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {o.items && o.items.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {o.items.map((it, idx) => (
                            <li key={idx}>
                              {it.name} × {it.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-rose-600">
                      {o.total ? `$${o.total.toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                        {o.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-gray-600"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
