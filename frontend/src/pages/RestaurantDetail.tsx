import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { RootState } from '../store';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRestaurant: restaurant, loading, error } = useSelector((state: RootState) => state.restaurant);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(Number(id)) as any);
    }
  }, [dispatch, id]);

  const handleBookTable = () => {
    navigate(`/book/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-4">
        <div className="bg-red-100 text-red-700 p-2 rounded">
          {typeof error === 'string' ? error : 'An error occurred while fetching restaurant details'}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  const googleMapsUrl = restaurant.latitude && restaurant.longitude
    ? `https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&z=15&output=embed`
    : null;

  return (
    <div className="container mx-auto mt-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Restaurant Images */}
        <div className="md:w-1/2 w-full">
          <div className="relative h-96 bg-white rounded shadow">
            <img
              src={restaurant.primary_image || '/restaurant-placeholder.jpg'}
              alt={restaurant.name}
              className="w-full h-96 object-cover rounded"
            />
            {/* Add image carousel/selector if multiple images */}
          </div>
        </div>
        {/* Restaurant Info */}
        <div className="md:w-1/2 w-full bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 mr-2">★</span>
            <span>{restaurant.average_rating || 'N/A'}</span>
            <span className="ml-2 text-gray-500">({restaurant.total_reviews || 0} reviews)</span>
          </div>
          <div className="mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{restaurant.cuisine}</span>
            <span className="text-gray-700">{'$'.repeat(restaurant.cost_rating || 1)}</span>
          </div>
          <p className="mb-2">{restaurant.description}</p>
          <div className="mb-2">
            <strong>Location:</strong> {restaurant.address}, {restaurant.city}, {restaurant.state} {restaurant.zip_code}
          </div>
          <div className="mb-2">
            <strong>Contact:</strong> {restaurant.phone} | {restaurant.email}
          </div>
          {restaurant.website && (
            <div className="mb-2">
              <strong>Website:</strong> <a href={restaurant.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{restaurant.website}</a>
            </div>
          )}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
            onClick={handleBookTable}
          >
            Book a Table
          </button>
        </div>
      </div>
      {/* Reviews Section */}
      <div className="mt-8 bg-white p-4 rounded shadow max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
        {restaurant.reviews && restaurant.reviews.length > 0 ? (
          <ul className="space-y-4">
            {restaurant.reviews.map((review: any) => (
              <li key={review.id} className="border-b pb-2">
                <div className="flex items-center mb-1">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold">{review.rating}</span>
                  <span className="ml-2 text-gray-700">by {review.user}</span>
                  <span className="ml-2 text-gray-400 text-xs">{review.date}</span>
                </div>
                <div className="text-gray-800">{review.comment}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No reviews yet.</div>
        )}
      </div>
      {/* Google Maps Section */}
      {googleMapsUrl && (
        <div className="mt-8 bg-white p-4 rounded shadow max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-4">Location Map</h3>
          <div className="w-full h-80">
            <iframe
              title="Google Maps"
              src={googleMapsUrl}
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail; 