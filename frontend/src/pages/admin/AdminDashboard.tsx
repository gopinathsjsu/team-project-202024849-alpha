import React, { useState, useEffect } from 'react';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  approved: boolean;
  owner: string;
}

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: 1, name: 'Italian Bistro', address: '123 Main St, Cityville', approved: true, owner: 'manager1' },
  { id: 2, name: 'Sushi Place', address: '456 Sushi Ave, Townsville', approved: true, owner: 'manager2' },
  { id: 3, name: 'Ramen King', address: '789 Ramen Rd, Noodle City', approved: false, owner: 'manager3' },
];

const today = new Date();
const mockAnalytics = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(today);
  date.setDate(today.getDate() - (29 - i));
  return {
    date: date.toISOString().slice(0, 10),
    reservations: Math.floor(Math.random() * 10) + 1,
  };
});

const initialMockRestaurants = [
  {
    id: 1,
    name: 'Italian Bistro',
    cuisine: 'Italian',
    city: 'San Francisco',
    state: 'CA',
    address: '601 Mission St',
    cost_rating: 3,
    average_rating: 4.5,
    total_reviews: 120,
    description: 'A cozy Italian bistro with homemade pasta and a great wine list.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['18:00', '18:30', '19:00', '19:30', '20:00'],
    times_booked_today: 5,
    approved: true,
    owner: 'manager1',
  },
  {
    id: 2,
    name: 'Sushi Place',
    cuisine: 'Japanese',
    city: 'Oakland',
    state: 'CA',
    address: '123 Broadway',
    cost_rating: 2,
    average_rating: 4.2,
    total_reviews: 80,
    description: 'Fresh sushi and sashimi with a modern twist.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['17:30', '18:00', '18:30', '19:00'],
    times_booked_today: 3,
    approved: true,
    owner: 'manager2',
  },
  {
    id: 3,
    name: 'Ramen King',
    cuisine: 'Japanese',
    city: 'New York',
    state: 'NY',
    address: '52 W 8th St',
    cost_rating: 2,
    average_rating: 4.7,
    total_reviews: 95,
    description: 'Authentic ramen with rich broth and hand-pulled noodles.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['17:30', '18:30', '19:30', '20:30'],
    times_booked_today: 7,
    approved: false,
    owner: 'manager3',
  },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'approve' | 'remove'>('dashboard');
  const [restaurants, setRestaurants] = useState(initialMockRestaurants);

  const pendingRestaurants = restaurants.filter(r => !r.approved);
  const approvedRestaurants = restaurants.filter(r => r.approved);

  const handleApprove = (id: number) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, approved: true } : r));
  };

  const handleRemove = (id: number) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* Admin Section Tabs */}
      <div className="flex space-x-4 mb-8 border-b pb-2">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'approve' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('approve')}
        >
          Approve
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'remove' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('remove')}
        >
          Remove
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <>
          <h2 className="text-xl font-semibold mb-2 mt-4">Reservations Analytics (Last 30 Days)</h2>
          <div className="bg-white rounded shadow p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">Date</th>
                    <th className="px-2 py-1 text-left">Reservations</th>
                    <th className="px-2 py-1 text-left">Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAnalytics.map((d) => (
                    <tr key={d.date}>
                      <td className="px-2 py-1">{d.date}</td>
                      <td className="px-2 py-1">{d.reservations}</td>
                      <td className="px-2 py-1">
                        <div style={{ background: '#2563eb', height: '12px', width: `${d.reservations * 15}px` }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {activeTab === 'approve' && (
        <>
          <h2 className="text-xl font-semibold mb-2 mt-4">Pending Restaurants for Approval</h2>
          <div className="grid gap-4 mb-8">
            {pendingRestaurants.length === 0 && <div className="text-gray-500">No pending restaurants.</div>}
            {pendingRestaurants.map(r => (
              <div key={r.id} className="bg-yellow-50 border-l-4 border-yellow-400 rounded shadow p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{r.name}</h3>
                  <div className="text-gray-600">{r.address}</div>
                  <div className="text-yellow-700 font-semibold mt-2">Pending approval</div>
                </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => handleApprove(r.id)}>
                    Approve
                  </button>
              </div>
            ))}
          </div>
        </>
      )}
      {activeTab === 'remove' && (
        <>
          <h2 className="text-xl font-semibold mb-2 mt-4">All Restaurants (Remove)</h2>
          <div className="grid gap-4 mb-8">
            {restaurants.length === 0 && <div className="text-gray-500">No restaurants available.</div>}
            {restaurants.map(r => (
              <div key={r.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{r.name}</h3>
                  <div className="text-gray-600">{r.address}</div>
                  <div className={r.approved ? 'text-green-600' : 'text-yellow-600'}>
                    {r.approved ? 'Approved' : 'Pending Approval'}
                  </div>
                </div>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleRemove(r.id)}>
                    Remove
                  </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard; 