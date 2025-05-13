import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchRestaurants } from '../store/slices/restaurantSlice';
import { RootState } from '../store';

const cuisineTypes = [
  'Italian',
  'Japanese',
  'Chinese',
  'Indian',
  'Mexican',
  'Thai',
  'American',
  'French',
  'Mediterranean',
  'Korean',
];

const RestaurantList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector((state: RootState) => state.restaurant);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState<number | ''>('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [costRating, setCostRating] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants({
      page,
      search: searchQuery,
      cuisine,
      date,
      time: time === 'ALL' ? undefined : time,
      party_size: partySize === '' ? undefined : partySize,
      city,
      state: stateVal,
      zip_code: zipCode,
      cost_range: costRating === '' ? undefined : String(costRating),
      min_rating: minRating === '' ? undefined : Number(minRating),
    }) as any);
  }, [dispatch, page, searchQuery, cuisine, date, time, partySize, city, stateVal, zipCode, costRating, minRating]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'search': setSearchQuery(value); break;
      case 'cuisine': setCuisine(value); break;
      case 'date': setDate(value); break;
      case 'time': setTime(value); break;
      case 'partySize': setPartySize(value === '' ? '' : Number(value)); break;
      case 'city': setCity(value); break;
      case 'state': setStateVal(value); break;
      case 'zipCode': setZipCode(value); break;
      case 'costRating': setCostRating(value); break;
      case 'minRating': setMinRating(value); break;
      default: break;
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCuisine('');
    setDate('');
    setTime('ALL');
    setPartySize('');
    setCity('');
    setStateVal('');
    setZipCode('');
    setCostRating('');
    setMinRating('');
    setPage(1);
  };

  const handleRestaurantClick = (id: number) => {
    navigate(`/restaurants/${id}`);
  };

  const handleBookTime = (restaurantId: number, time: string) => {
    navigate(`/book/${restaurantId}?time=${encodeURIComponent(time)}`);
  };

  const mockRestaurants = [
    {
      id: 1,
      name: 'Italian Bistro',
      cuisine: 'Italian',
      city: 'San Francisco',
      state: 'CA',
      cost_rating: 3,
      average_rating: 4.5,
      total_reviews: 120,
      description: 'A cozy Italian bistro with homemade pasta and a great wine list.',
      primary_image: '/restaurant-placeholder.jpg',
      available_times: ['18:00', '18:30', '19:00', '19:30', '20:00'],
      times_booked_today: 5,
    },
    {
      id: 2,
      name: 'Sushi Place',
      cuisine: 'Japanese',
      city: 'Oakland',
      state: 'CA',
      cost_rating: 2,
      average_rating: 4.2,
      total_reviews: 80,
      description: 'Fresh sushi and sashimi with a modern twist.',
      primary_image: '/restaurant-placeholder.jpg',
      available_times: ['17:30', '18:00', '18:30', '19:00'],
      times_booked_today: 3,
    },
    {
      id: 3,
      name: 'Ramen King',
      cuisine: 'Japanese',
      city: 'Noodle City',
      state: 'NY',
      cost_rating: 2,
      average_rating: 4.7,
      total_reviews: 95,
      description: 'Authentic ramen with rich broth and hand-pulled noodles.',
      primary_image: '/restaurant-placeholder.jpg',
      available_times: ['17:30', '18:30', '19:30', '20:30'],
      times_booked_today: 7,
    },
    {
      id: 4,
      name: 'Taco Fiesta',
      cuisine: 'Mexican',
      city: 'Los Angeles',
      state: 'CA',
      cost_rating: 1,
      average_rating: 4.0,
      total_reviews: 60,
      description: 'Colorful taqueria with street-style tacos and margaritas.',
      primary_image: '/restaurant-placeholder.jpg',
      available_times: ['18:00', '19:00', '20:00'],
      times_booked_today: 2,
    },
    {
      id: 5,
      name: 'Curry House',
      cuisine: 'Indian',
      city: 'Fremont',
      state: 'CA',
      cost_rating: 2,
      average_rating: 4.3,
      total_reviews: 70,
      description: 'Traditional Indian curries and tandoori specialties.',
      primary_image: '/restaurant-placeholder.jpg',
      available_times: ['17:00', '18:00', '19:00', '20:00'],
      times_booked_today: 4,
    },
    {
      id: 6,
      name: 'Burger Joint',
      cuisine: 'American',
      city: 'San Jose',
      state: 'CA',
      cost_rating: 1,
      average_rating: 4.1,
      total_reviews: 110,
      description: 'Classic burgers, fries, and shakes in a retro setting.',
      primary_image: '/restaurant-placeholder.jpg',
      available_times: ['18:00', '19:00', '20:00'],
      times_booked_today: 6,
    },
    {
      id: 7,
      name: 'Le Petit Paris',
      cuisine: 'French',
      city: 'San Francisco',
      state: 'CA',
      cost_rating: 4,
      average_rating: 4.8,
      total_reviews: 50,
      description: 'Elegant French dining with a romantic atmosphere.',
      primary_image: '/restaurant-placeholder.jpg',
      available_times: ['17:30', '18:30', '19:30'],
      times_booked_today: 1,
    },
    {
      id: 8,
      name: 'Dragon Wok',
      cuisine: 'Chinese',
      city: 'Daly City',
      state: 'CA',
      cost_rating: 2,
      average_rating: 4.0,
      total_reviews: 90,
      description: 'Family-style Chinese food with all the classics.',
      primary_image: '/restaurant-placeholder.jpg',
      available_times: ['18:00', '19:00', '20:00'],
      times_booked_today: 8,
    },
  ];

  if (loading && !restaurants.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters */}
        <div className="md:w-1/4 w-full">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Filters</h2>
            <div className="mb-2">
              <input
                className="w-full border rounded px-2 py-1"
                placeholder="Search"
                name="search"
                value={searchQuery}
                onChange={handleFilterChange}
              />
            </div>
            <div className="mb-2">
              <select
                className="w-full border rounded px-2 py-1"
                name="cuisine"
                value={cuisine}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                {cuisineTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <input
                className="w-full border rounded px-2 py-1"
                type="date"
                name="date"
                value={date}
                onChange={handleFilterChange}
                placeholder="Date"
              />
            </div>
            <div className="mb-2">
              <select
                className="w-full border rounded px-2 py-1"
                name="time"
                value={time}
                onChange={handleFilterChange}
              >
                <option value="ALL">All Times</option>
                <option value="17:00">17:00</option>
                <option value="17:30">17:30</option>
                <option value="18:00">18:00</option>
                <option value="18:30">18:30</option>
                <option value="19:00">19:00</option>
                <option value="19:30">19:30</option>
                <option value="20:00">20:00</option>
                <option value="20:30">20:30</option>
                <option value="21:00">21:00</option>
              </select>
            </div>
            <div className="mb-2">
              <input
                className="w-full border rounded px-2 py-1"
                type="number"
                name="partySize"
                value={partySize}
                onChange={handleFilterChange}
                placeholder="# People"
                min={1}
                max={20}
              />
            </div>
            <div className="mb-2">
              <input
                className="w-full border rounded px-2 py-1"
                name="city"
                value={city}
                onChange={handleFilterChange}
                placeholder="City"
              />
            </div>
            <div className="mb-2">
              <input
                className="w-full border rounded px-2 py-1"
                name="state"
                value={stateVal}
                onChange={handleFilterChange}
                placeholder="State"
              />
            </div>
            <div className="mb-2">
              <input
                className="w-full border rounded px-2 py-1"
                name="zipCode"
                value={zipCode}
                onChange={handleFilterChange}
                placeholder="Zip Code"
              />
            </div>
            <div className="mb-2">
              <select
                className="w-full border rounded px-2 py-1"
                name="costRating"
                value={costRating}
                onChange={handleFilterChange}
              >
                <option value="">All Cost Ratings</option>
                <option value="1">$</option>
                <option value="2">$$</option>
                <option value="3">$$$</option>
                <option value="4">$$$$</option>
              </select>
            </div>
            <div className="mb-2">
              <select
                className="w-full border rounded px-2 py-1"
                name="minRating"
                value={minRating}
                onChange={handleFilterChange}
              >
                <option value="">All Customer Ratings</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5</option>
              </select>
            </div>
            <button
              className="w-full mt-2 border rounded px-2 py-1"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
        {/* Restaurant List */}
        <div className="md:w-3/4 w-full">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-2">
              {typeof error === 'string' ? error : 'An error occurred while fetching restaurants'}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRestaurants.map((restaurant: any) => (
              <div
                key={restaurant.id}
                className="bg-white rounded shadow cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
              >
                <img
                  src={restaurant.primary_image || '/restaurant-placeholder.jpg'}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-t"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 cursor-pointer" onClick={() => handleRestaurantClick(restaurant.id)}>{restaurant.name}</h3>
                    <p className="text-gray-600 mb-1">{restaurant.cuisine}</p>
                    <p className="text-gray-500 mb-1">{restaurant.city}, {restaurant.state}</p>
                    <p className="text-gray-500 mb-1">{'$'.repeat(restaurant.cost_rating || 1)}</p>
                    <p className="text-gray-700 mb-1">{restaurant.description}</p>
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{restaurant.average_rating || 'N/A'}</span>
                      <span className="ml-2 text-gray-500">({restaurant.total_reviews || 0} reviews)</span>
                    </div>
                    <div className="text-sm text-blue-700 mb-1">Booked {restaurant.times_booked_today || 0} times today</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {restaurant.available_times && restaurant.available_times.map((t: string) => (
                      <button
                        key={t}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                        onClick={() => handleBookTime(restaurant.id, t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList; 