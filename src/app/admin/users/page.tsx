'use client';

import { useEffect, useState } from 'react';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Admin – Users
        </h1>

        {loading && <p className="text-gray-800">Loading users...</p>}

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
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-900">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-gray-600"
                    >
                      No users found.
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
