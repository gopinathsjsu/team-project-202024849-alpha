import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  contact: string;
  hours: string;
  bookingTimes: string[];
  tableSizes: number[];
  description: string;
  photos: string[];
  approved: boolean;
  owner: string;
}

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: 'Italian Bistro',
    address: '123 Main St, Cityville',
    contact: '555-1234',
    hours: 'Mon-Sun 11:00-22:00',
    bookingTimes: ['17:00', '18:00', '19:00', '20:00'],
    tableSizes: [2, 4, 6],
    description: 'A cozy Italian restaurant.',
    photos: [],
    approved: true,
    owner: 'manager1',
  },
  {
    id: 2,
    name: 'Sushi Place',
    address: '456 Sushi Ave, Townsville',
    contact: '555-5678',
    hours: 'Mon-Sun 11:00-22:00',
    bookingTimes: ['17:00', '18:00', '19:00', '20:00'],
    tableSizes: [2, 4, 6],
    description: 'Fresh sushi and sashimi with a modern twist.',
    photos: [],
    approved: true,
    owner: 'manager2',
  },
  {
    id: 3,
    name: 'Ramen King',
    address: '789 Ramen Rd, Noodle City',
    contact: '555-9999',
    hours: 'Mon-Sun 11:00-23:00',
    bookingTimes: ['17:30', '18:30', '19:30', '20:30'],
    tableSizes: [2, 4],
    description: 'Authentic ramen with rich broth and hand-pulled noodles.',
    photos: [],
    approved: false,
    owner: 'manager3',
  },
];

const ManagerRestaurants: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  // Only show restaurants owned by this manager
  const myRestaurants = MOCK_RESTAURANTS.filter(r => r.owner === user?.username);
  const pendingRestaurants = myRestaurants.filter(r => !r.approved);
  const approvedRestaurants = myRestaurants.filter(r => r.approved);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Restaurant> & { bookingTimes?: string; tableSizes?: string }>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddClick = () => {
    setShowForm(true);
    setForm({});
    setEditingId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditClick = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setShowForm(true);
    setForm({
      ...restaurant,
      bookingTimes: (restaurant.bookingTimes || []).join(', '),
      tableSizes: (restaurant.tableSizes || []).join(', '),
    } as Partial<Restaurant> & { bookingTimes: string; tableSizes: string });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !user) return;
    if (editingId) {
      // Implementation of editing a restaurant
    } else {
      // Implementation of adding a new restaurant
    }
    setShowForm(false);
    setForm({});
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      {/* Pending Approval Section */}
      <h2 className="text-xl font-semibold mb-2">Pending Approval</h2>
      {pendingRestaurants.length === 0 && <div className="mb-4 text-gray-500">No pending restaurants.</div>}
      <div className="grid gap-4 mb-8">
        {pendingRestaurants.map(r => (
          <div key={r.id} className="bg-yellow-50 border-l-4 border-yellow-400 rounded shadow p-4">
            <h2 className="text-xl font-semibold">{r.name}</h2>
            <div className="text-gray-600">{r.address}</div>
            <div className="text-gray-600">Contact: {r.contact}</div>
            <div className="text-gray-600">Hours: {r.hours}</div>
            <div className="text-gray-600">Booking Times: {r.bookingTimes.join(', ')}</div>
            <div className="text-gray-600">Table Sizes: {Array.isArray(r.tableSizes) ? r.tableSizes.join(', ') : r.tableSizes}</div>
            <div className="text-gray-600">{r.description}</div>
            <div className="text-yellow-700 font-semibold mt-2">Pending admin approval</div>
          </div>
        ))}
      </div>
      {/* Add/Edit Restaurant Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Restaurants</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddClick}
        >
          Add Restaurant
        </button>
      </div>
      {showForm && (
        <form className="mb-6 p-4 bg-white rounded shadow" onSubmit={handleFormSubmit}>
          <div className="mb-2">
            <label className="block font-semibold">Name</label>
            <input name="name" value={form.name || ''} onChange={handleFormChange} className="border rounded px-2 py-1 w-full" required />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Address</label>
            <input name="address" value={form.address || ''} onChange={handleFormChange} className="border rounded px-2 py-1 w-full" required />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Contact</label>
            <input name="contact" value={form.contact || ''} onChange={handleFormChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Hours</label>
            <input name="hours" value={form.hours || ''} onChange={handleFormChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Available Booking Times (comma separated)</label>
            <input name="bookingTimes" value={form.bookingTimes || ''} onChange={handleFormChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Table Sizes (comma separated)</label>
            <input name="tableSizes" value={form.tableSizes || ''} onChange={handleFormChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleFormChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Save</button>
          <button className="ml-2 px-4 py-2 rounded border" type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
        </form>
      )}
      <div className="grid gap-4">
        {approvedRestaurants.map(r => (
          <div key={r.id} className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">{r.name}</h2>
            <div className="text-gray-600">{r.address}</div>
            <div className="text-gray-600">Contact: {r.contact}</div>
            <div className="text-gray-600">Hours: {r.hours}</div>
            <div className="text-gray-600">Booking Times: {r.bookingTimes.join(', ')}</div>
            <div className="text-gray-600">Table Sizes: {Array.isArray(r.tableSizes) ? r.tableSizes.join(', ') : r.tableSizes}</div>
            <div className="text-gray-600">{r.description}</div>
            <button className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEditClick(r)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerRestaurants; 