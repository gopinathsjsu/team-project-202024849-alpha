import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { RootState } from '../store';

const mockRestaurants = [
  {
    id: 1,
    name: 'Italian Bistro',
    cuisine: 'Italian',
    city: 'San Francisco',
    state: 'CA',
    address: '601 Mission St',
    zip_code: '94105',
    latitude: 37.787993,
    longitude: -122.399972,
    phone: '(415) 555-1234',
    email: 'info@italianbistro.com',
    website: 'https://italianbistro.com',
    cost_rating: 3,
    average_rating: 4.5,
    total_reviews: 120,
    description: 'A cozy Italian bistro with homemade pasta and a great wine list.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['18:00', '18:30', '19:00', '19:30', '20:00'],
    times_booked_today: 5,
    approved: true,
    owner: 'manager1',
    reviews: [
      { id: 1, user: 'Alice', rating: 5, comment: 'Amazing food!', date: '2023-05-01' },
      { id: 2, user: 'Bob', rating: 4, comment: 'Great atmosphere.', date: '2023-05-02' }
    ],
  },
  {
    id: 2,
    name: 'Sushi Place',
    cuisine: 'Japanese',
    city: 'Oakland',
    state: 'CA',
    address: '123 Broadway',
    zip_code: '94607',
    latitude: 37.798374,
    longitude: -122.276442,
    phone: '(510) 555-5678',
    email: 'info@sushiplace.com',
    website: 'https://sushiplace.com',
    cost_rating: 2,
    average_rating: 4.2,
    total_reviews: 80,
    description: 'Fresh sushi and sashimi with a modern twist.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['17:30', '18:00', '18:30', '19:00'],
    times_booked_today: 3,
    approved: true,
    owner: 'manager2',
    reviews: [
      { id: 3, user: 'Carol', rating: 5, comment: 'Best sushi in town!', date: '2023-05-03' },
      { id: 4, user: 'Dave', rating: 4, comment: 'Very fresh fish.', date: '2023-05-04' }
    ],
  },
  {
    id: 3,
    name: 'Ramen King',
    cuisine: 'Japanese',
    city: 'New York',
    state: 'NY',
    address: '52 W 8th St',
    zip_code: '10011',
    latitude: 40.732253,
    longitude: -73.997438,
    phone: '(212) 555-7890',
    email: 'info@ramenking.com',
    website: 'https://ramenking.com',
    cost_rating: 2,
    average_rating: 4.7,
    total_reviews: 95,
    description: 'Authentic ramen with rich broth and hand-pulled noodles.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['17:30', '18:30', '19:30', '20:30'],
    times_booked_today: 7,
    approved: true,
    owner: 'manager3',
    reviews: [
      { id: 5, user: 'Eve', rating: 5, comment: 'Best ramen outside Japan!', date: '2023-05-05' },
      { id: 6, user: 'Frank', rating: 4, comment: 'Loved the noodles.', date: '2023-05-06' }
    ],
  },
  {
    id: 4,
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    city: 'Los Angeles',
    state: 'CA',
    address: '2000 Sunset Blvd',
    zip_code: '90026',
    latitude: 34.078159,
    longitude: -118.260948,
    phone: '(213) 555-2345',
    email: 'info@tacofiesta.com',
    website: 'https://tacofiesta.com',
    cost_rating: 1,
    average_rating: 4.0,
    total_reviews: 60,
    description: 'Colorful taqueria with street-style tacos and margaritas.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['18:00', '19:00', '20:00'],
    times_booked_today: 2,
    approved: true,
    owner: 'manager4',
    reviews: [
      { id: 7, user: 'Grace', rating: 4, comment: 'Great tacos!', date: '2023-05-07' },
      { id: 8, user: 'Heidi', rating: 4, comment: 'Fun place.', date: '2023-05-08' }
    ],
  },
  {
    id: 5,
    name: 'Curry House',
    cuisine: 'Indian',
    city: 'Fremont',
    state: 'CA',
    address: '39116 State St',
    zip_code: '94538',
    latitude: 37.548539,
    longitude: -121.988583,
    phone: '(510) 555-3456',
    email: 'info@curryhouse.com',
    website: 'https://curryhouse.com',
    cost_rating: 2,
    average_rating: 4.3,
    total_reviews: 70,
    description: 'Traditional Indian curries and tandoori specialties.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['17:00', '18:00', '19:00', '20:00'],
    times_booked_today: 4,
    approved: true,
    owner: 'manager5',
    reviews: [
      { id: 9, user: 'Ivan', rating: 5, comment: 'Delicious curries!', date: '2023-05-09' },
      { id: 10, user: 'Judy', rating: 4, comment: 'Nice tandoori.', date: '2023-05-10' }
    ],
  },
  {
    id: 6,
    name: 'Burger Joint',
    cuisine: 'American',
    city: 'San Jose',
    state: 'CA',
    address: '98 S 2nd St',
    zip_code: '95113',
    latitude: 37.335480,
    longitude: -121.886921,
    phone: '(408) 555-4567',
    email: 'info@burgerjoint.com',
    website: 'https://burgerjoint.com',
    cost_rating: 1,
    average_rating: 4.1,
    total_reviews: 110,
    description: 'Classic burgers, fries, and shakes in a retro setting.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['18:00', '19:00', '20:00'],
    times_booked_today: 6,
    approved: true,
    owner: 'manager6',
    reviews: [
      { id: 11, user: 'Kim', rating: 4, comment: 'Great burgers!', date: '2023-05-11' },
      { id: 12, user: 'Leo', rating: 4, comment: 'Loved the shakes.', date: '2023-05-12' }
    ],
  },
  {
    id: 7,
    name: 'Le Petit Paris',
    cuisine: 'French',
    city: 'San Francisco',
    state: 'CA',
    address: '565 Sutter St',
    zip_code: '94102',
    latitude: 37.789409,
    longitude: -122.410157,
    phone: '(415) 555-6789',
    email: 'info@lepetitparis.com',
    website: 'https://lepetitparis.com',
    cost_rating: 4,
    average_rating: 4.8,
    total_reviews: 50,
    description: 'Elegant French dining with a romantic atmosphere.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['17:30', '18:30', '19:30'],
    times_booked_today: 1,
    approved: true,
    owner: 'manager7',
    reviews: [
      { id: 13, user: 'Mona', rating: 5, comment: 'So romantic!', date: '2023-05-13' },
      { id: 14, user: 'Nina', rating: 5, comment: 'Amazing French food.', date: '2023-05-14' }
    ],
  },
  {
    id: 8,
    name: 'Dragon Wok',
    cuisine: 'Chinese',
    city: 'Daly City',
    state: 'CA',
    address: '101 Southgate Ave',
    zip_code: '94015',
    latitude: 37.670208,
    longitude: -122.466898,
    phone: '(650) 555-7890',
    email: 'info@dragonwok.com',
    website: 'https://dragonwok.com',
    cost_rating: 2,
    average_rating: 4.0,
    total_reviews: 90,
    description: 'Family-style Chinese food with all the classics.',
    primary_image: '/restaurant-placeholder.jpg',
    available_times: ['18:00', '19:00', '20:00'],
    times_booked_today: 8,
    approved: true,
    owner: 'manager8',
    reviews: [
      { id: 15, user: 'Oscar', rating: 4, comment: 'Great for families.', date: '2023-05-15' },
      { id: 16, user: 'Pam', rating: 4, comment: 'Tasty food.', date: '2023-05-16' }
    ],
  },
];

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

  // Fallback: if restaurant is not found, look it up in mockRestaurants
  const fallbackRestaurant = !restaurant && id ? mockRestaurants.find(r => r.id === Number(id)) : null;
  const displayRestaurant = restaurant || fallbackRestaurant;

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

  if (!displayRestaurant) {
    return null;
  }

  const googleMapsUrl = displayRestaurant.latitude && displayRestaurant.longitude
    ? `https://www.google.com/maps?q=${displayRestaurant.latitude},${displayRestaurant.longitude}&z=15&output=embed`
    : null;

  return (
    <div className="container mx-auto mt-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Restaurant Images */}
        <div className="md:w-1/2 w-full">
          <div className="relative h-96 bg-white rounded shadow">
            <img
              src={displayRestaurant.primary_image || '/restaurant-placeholder.jpg'}
              alt={displayRestaurant.name}
              className="w-full h-96 object-cover rounded"
            />
            {/* Add image carousel/selector if multiple images */}
          </div>
        </div>
        {/* Restaurant Info */}
        <div className="md:w-1/2 w-full bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">{displayRestaurant.name}</h2>
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 mr-2">★</span>
            <span>{displayRestaurant.average_rating || 'N/A'}</span>
            <span className="ml-2 text-gray-500">({displayRestaurant.total_reviews || 0} reviews)</span>
          </div>
          <div className="mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{displayRestaurant.cuisine}</span>
            <span className="text-gray-700">{'$'.repeat(displayRestaurant.cost_rating || 1)}</span>
          </div>
          <p className="mb-2">{displayRestaurant.description}</p>
          <div className="mb-2">
            <strong>Location:</strong> {displayRestaurant.address}, {displayRestaurant.city}, {displayRestaurant.state} {displayRestaurant.zip_code}
          </div>
          <div className="mb-2">
            <strong>Contact:</strong> {displayRestaurant.phone} | {displayRestaurant.email}
          </div>
          {displayRestaurant.website && (
            <div className="mb-2">
              <strong>Website:</strong> <a href={displayRestaurant.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{displayRestaurant.website}</a>
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
        {displayRestaurant.reviews && displayRestaurant.reviews.length > 0 ? (
          <ul className="space-y-4">
            {displayRestaurant.reviews.map((review: any) => (
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