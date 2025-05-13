import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchRestaurantById } from '../../store/slices/restaurantSlice';

interface Restaurant
{
  id: number;
  name: string;
  cuisine: string;
  cost_range: string;
  description: string;
  address: string;
  city: string;
  opening_hours: string;
}

const RestaurantDetail: React.FC = () =>
{
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentRestaurant: restaurant, loading, error } = useSelector(
    (state: RootState) => state.restaurant
  );

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() =>
  {
    if (id)
    {
      dispatch(fetchRestaurantById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleBooking = (e: React.FormEvent) =>
  {
    e.preventDefault();
    // TODO: Implement booking functionality
    console.log('Booking:', { date, time, guests });
  };

  if (loading)
  {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !restaurant)
  {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error || 'Restaurant not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Restaurant Information */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{restaurant.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              {restaurant.cuisine}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {restaurant.cost_range}
            </span>
          </div>
          <p className="text-gray-600 mb-6">{restaurant.description}</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Address</h3>
              <p className="text-gray-600">{restaurant.address}</p>
              <p className="text-gray-600">{restaurant.city}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Opening Hours</h3>
              <p className="text-gray-600">
                {restaurant.opening_hours}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Make a Reservation</h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <select
                id="guests"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail; 