import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { fetchBookings, cancelBooking } from '../store/slices/bookingSlice';

const BookingList: React.FC = () =>
{
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, error } = useSelector((state: RootState) => state.booking);

  useEffect(() =>
  {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleCancelBooking = (bookingId: number) =>
  {
    if (window.confirm('Are you sure you want to cancel this booking?'))
    {
      dispatch(cancelBooking(bookingId));
    }
  };

  if (loading)
  {
    return <div className="text-center">Loading...</div>;
  }

  if (error)
  {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      {bookings && bookings.length > 0 ? (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    <Link
                      to={`/restaurants/${booking.restaurant.id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      {booking.restaurant.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Date: {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-2">Time: {booking.time}</p>
                  <p className="text-gray-600 mb-2">Party Size: {booking.party_size}</p>
                  <p className="text-gray-600">Status: {booking.status}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p>You haven't made any bookings yet.</p>
          <Link
            to="/restaurants"
            className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
          >
            Browse Restaurants
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookingList; 