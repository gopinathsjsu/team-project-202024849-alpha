import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Restaurant
{
  id: number;
  name: string;
  description: string;
  cuisine: string;
  cost_range: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  opening_hours: string;
  created_at: string;
  updated_at: string;
  primary_image?: string;
  state?: string;
  cost_rating?: number;
  average_rating?: number;
  total_reviews?: number;
  zip_code?: string;
  tables?: any[];
  available_times?: string[];
  times_booked_today?: number;
  reviews?: { id: number; user: string; rating: number; comment: string; date: string }[];
  latitude?: number;
  longitude?: number;
}

interface Filters
{
  search?: string;
  cuisine?: string;
  cost_range?: string;
  cuisine_type?: string;
  city?: string;
  state?: string;
  min_rating?: number | null;
  max_rating?: number | null;
  min_cost?: number | null;
  max_cost?: number | null;
}

interface RestaurantState
{
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  filters: Filters;
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
  totalCount: 0,
  filters: {
    search: '',
    cuisine: '',
    cost_range: '',
    cuisine_type: '',
    city: '',
    state: '',
    min_rating: null,
    max_rating: null,
    min_cost: null,
    max_cost: null,
  },
};

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "Mock Italian Bistro",
    description: "A cozy Italian bistro with homemade pasta and a great wine list.",
    cuisine: "Italian",
    cost_range: "$$$",
    city: "San Francisco",
    address: "123 Main St",
    phone: "555-1234",
    email: "info@italianbistro.com",
    website: "http://italianbistro.com",
    opening_hours: "10:00-22:00",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    primary_image: "/restaurant-placeholder.jpg",
    state: "CA",
    cost_rating: 3,
    average_rating: 4.5,
    total_reviews: 12,
    zip_code: "94101",
    tables: [
      { id: 1, table_number: 1, capacity: 2, is_available: true },
      { id: 2, table_number: 2, capacity: 4, is_available: true }
    ],
    available_times: ["18:00", "18:30", "19:00", "19:30", "20:00"],
    times_booked_today: 5,
    reviews: [
      { id: 1, user: "Alice", rating: 5, comment: "Amazing food!", date: "2023-05-01" },
      { id: 2, user: "Bob", rating: 4, comment: "Great atmosphere.", date: "2023-05-02" }
    ],
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: 2,
    name: "Sushi Place",
    description: "Fresh sushi and sashimi with a modern twist.",
    cuisine: "Japanese",
    cost_range: "$$",
    city: "Oakland",
    address: "456 Elm St",
    phone: "555-5678",
    email: "info@sushiplace.com",
    website: "http://sushiplace.com",
    opening_hours: "11:00-23:00",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    primary_image: "/restaurant-placeholder.jpg",
    state: "CA",
    cost_rating: 2,
    average_rating: 4.2,
    total_reviews: 8,
    zip_code: "94607",
    tables: [
      { id: 3, table_number: 1, capacity: 2, is_available: true },
      { id: 4, table_number: 2, capacity: 4, is_available: false }
    ],
    available_times: ["17:30", "18:00", "18:30", "19:00"],
    times_booked_today: 3,
    reviews: [
      { id: 3, user: "Carol", rating: 5, comment: "Best sushi in town!", date: "2023-05-03" },
      { id: 4, user: "Dave", rating: 4, comment: "Very fresh fish.", date: "2023-05-04" }
    ],
    latitude: 37.8044,
    longitude: -122.2712,
  },
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (params: Filters & { page?: number; date?: string; time?: string; party_size?: number; city?: string; state?: string; zip_code?: string } = {}, { rejectWithValue }) =>
  {
    if (process.env.REACT_APP_USE_MOCK === 'true') {
      let filtered = MOCK_RESTAURANTS;
      if (params.search) {
        filtered = filtered.filter(r =>
          r.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      if (params.cuisine) {
        filtered = filtered.filter(r =>
          r.cuisine.toLowerCase() === params.cuisine!.toLowerCase()
        );
      }
      if (params.city) {
        filtered = filtered.filter(r =>
          r.city.toLowerCase().includes(params.city!.toLowerCase())
        );
      }
      if (params.state) {
        filtered = filtered.filter(r =>
          r.state && r.state.toLowerCase().includes(params.state!.toLowerCase())
        );
      }
      if (params.zip_code) {
        filtered = filtered.filter(r =>
          r.zip_code && r.zip_code.includes(params.zip_code!)
        );
      }
      if (params.cost_range) {
        filtered = filtered.filter(r =>
          String(r.cost_rating) === String(params.cost_range)
        );
      }
      if (params.min_rating) {
        filtered = filtered.filter(r =>
          r.average_rating && r.average_rating >= Number(params.min_rating)
        );
      }
      const partySize = params.party_size;
      if (typeof partySize === 'number' && !isNaN(partySize)) {
        filtered = filtered.filter(r =>
          r.tables && r.tables.some(table => table.capacity >= partySize)
        );
      }
      if (params.time) {
        filtered = filtered.filter(r =>
          r.available_times && r.available_times.some(t => Math.abs(parseInt(t.replace(':', '')) - parseInt(params.time!.replace(':', ''))) <= 30)
        );
      }
      return { results: filtered, count: filtered.length };
    }
    try
    {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) =>
      {
        if (value !== undefined && value !== null && value !== '')
        {
          searchParams.append(key, String(value));
        }
      });
      const response = await axios.get(`${API_URL}/restaurants/?${searchParams.toString()}`);
      return { results: response.data, count: response.data.length };
    } catch (error: any)
    {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurant/fetchRestaurantById',
  async (id: number, { rejectWithValue }) =>
  {
    if (process.env.REACT_APP_USE_MOCK === 'true') {
      const restaurant = MOCK_RESTAURANTS.find(r => r.id === Number(id));
      if (restaurant) return restaurant;
      return rejectWithValue({ detail: 'Restaurant not found' });
    }
    try
    {
      const response = await axios.get(`${API_URL}/restaurants/${id}/`);
      return response.data;
    } catch (error: any)
    {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch restaurant');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) =>
    {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) =>
    {
      state.filters = initialState.filters;
    },
    clearCurrentRestaurant: (state) =>
    {
      state.currentRestaurant = null;
    },
    clearError: (state) =>
    {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
  {
    builder
      .addCase(fetchRestaurants.pending, (state) =>
      {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.restaurants = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchRestaurants.rejected, (state, action) =>
      {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRestaurantById.pending, (state) =>
      {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) =>
      {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentRestaurant, clearError } = restaurantSlice.actions;
export default restaurantSlice.reducer; 