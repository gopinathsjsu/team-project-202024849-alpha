import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () =>
{
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Restaurant Finder</h1>
      <p className="text-xl mb-8">
        Discover and book the best restaurants in your area
      </p>
      <Link
        to="/restaurants"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Browse Restaurants
      </Link>
    </div>
  );
};

export default Home; 