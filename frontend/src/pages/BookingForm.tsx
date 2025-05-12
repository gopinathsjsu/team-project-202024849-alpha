import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { createBooking } from '../store/slices/bookingSlice';
import { RootState } from '../store';

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRestaurant: restaurant, loading: restaurantLoading } = useSelector((state: RootState) => state.restaurant);
  const { loading: bookingLoading, error: bookingError } = useSelector((state: RootState) => state.booking);
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [form, setForm] = useState({
    table: '',
    date: '',
    time: '',
    party_size: 2,
    special_requests: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(Number(id)) as any);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (restaurant && restaurant.tables) {
      setAvailableTables(restaurant.tables.filter((table: any) => table.is_available));
    }
  }, [restaurant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bookingData = {
      restaurant: id ? Number(id) : 0,
      table: form.table,
      date: form.date,
      time: form.time,
      party_size: form.party_size,
      special_requests: form.special_requests,
    };
    const result = await dispatch(createBooking(bookingData) as any);
    if (!result.error) {
      navigate('/bookings');
    }
  };

  if (restaurantLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span>Loading...</span>
      </div>
    );
  }

  console.log('BookingForm restaurant:', restaurant);

  if (!restaurant) {
    return (
      <div className="container mx-auto mt-4">
        <div className="bg-red-100 text-red-700 p-2 rounded">Restaurant not found or not loaded.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-4 mb-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Book a Table at {restaurant.name}</h2>
        {bookingError && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2">
            {typeof bookingError === 'string' ? bookingError : 'An error occurred while creating the booking'}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Table</label>
            <select
              name="table"
              value={form.table}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Select a table</option>
              {availableTables.map((table) => (
                <option key={table.id} value={table.id}>
                  Table {table.table_number} (Capacity: {table.capacity})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Party Size</label>
            <input
              type="number"
              name="party_size"
              value={form.party_size}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              min={1}
              max={20}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Special Requests</label>
            <textarea
              name="special_requests"
              value={form.special_requests}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={bookingLoading}
          >
            {bookingLoading ? 'Booking...' : 'Book Table'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 