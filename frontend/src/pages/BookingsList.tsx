import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

// If in mock mode, import mock restaurants for lookup
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "Mock Italian Bistro",
  },
  {
    id: 2,
    name: "Sushi Place",
  },
];

const getRestaurantName = (id: number) => {
  if (process.env.REACT_APP_USE_MOCK === 'true') {
    const found = MOCK_RESTAURANTS.find(r => r.id === id);
    return found ? found.name : `Restaurant #${id}`;
  }
  return `Restaurant #${id}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BookingsList: React.FC = () => {
  const { bookings } = useSelector((state: RootState) => state.booking);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Only show bookings for the logged-in user (mock mode)
  const filteredBookings = process.env.REACT_APP_USE_MOCK === 'true' && user
    ? bookings.filter((b: any) => b.username === user.username)
    : bookings;

  return (
    <div className="container mx-auto mt-4 mb-4">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <button className="border px-4 py-2 rounded mb-2" onClick={() => navigate('/')}>Back to Home</button>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Restaurant</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Party Size</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking: any) => (
              <tr key={booking.id}>
                <td className="px-4 py-2">{getRestaurantName(booking.restaurant)}</td>
                <td className="px-4 py-2">{booking.date || booking.booking_date}</td>
                <td className="px-4 py-2">{booking.time || booking.booking_time}</td>
                <td className="px-4 py-2">{booking.party_size}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(booking.status)}`}>{booking.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <div className="p-4 text-center">No bookings found.</div>
        )}
      </div>
    </div>
  );
};

export default BookingsList; 