import React from 'react';
import { Link } from 'react-router-dom';

interface RestaurantCardProps
{
  id: number;
  name: string;
  description: string;
  cuisine: string;
  cost_range: string;
  city: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  description,
  cuisine,
  cost_range,
  city,
}) =>
{
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
            {cuisine}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {cost_range}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            {city}
          </span>
        </div>
        <Link
          to={`/restaurants/${id}`}
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard; 