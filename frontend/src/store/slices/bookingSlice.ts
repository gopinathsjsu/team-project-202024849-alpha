import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Restaurant
{
  id: number;
  name: string;
}

interface Booking
{
  id: number;
  restaurant: Restaurant;
  date: string;
  time: string;
  party_size: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BookingState
{
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getMockBookings = () => {
  const stored = localStorage.getItem('mock_bookings');
  return stored ? JSON.parse(stored) : [];
};
const setMockBookings = (bookings: any[]) => {
  localStorage.setItem('mock_bookings', JSON.stringify(bookings));
};

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (_, { rejectWithValue }) =>
  {
    if (process.env.REACT_APP_USE_MOCK === 'true') {
      // Return all mock bookings for the current user
      const token = localStorage.getItem('token');
      const user = token ? token.replace('mock-token-', '') : null;
      const allBookings = getMockBookings();
      const userBookings = user ? allBookings.filter((b: any) => b.username === user) : [];
      return userBookings;
    }
    try
    {
      const response = await axios.get(`${API_URL}/bookings/`);
      return response.data;
    } catch (error: any)
    {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch bookings');
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: {
    restaurant: number;
    date: string;
    time: string;
    party_size: number;
  }, { rejectWithValue }) =>
  {
    if (process.env.REACT_APP_USE_MOCK === 'true') {
      const token = localStorage.getItem('token');
      const username = token ? token.replace('mock-token-', '') : 'customer1';
      const newBooking = {
        id: Date.now(),
        restaurant: bookingData.restaurant,
        date: bookingData.date,
        time: bookingData.time,
        party_size: bookingData.party_size,
        status: 'CONFIRMED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username,
      };
      const allBookings = getMockBookings();
      allBookings.unshift(newBooking);
      setMockBookings(allBookings);
      return newBooking;
    }
    try
    {
      const response = await axios.post(`${API_URL}/bookings/`, bookingData);
      return response.data;
    } catch (error: any)
    {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (bookingId: number, { rejectWithValue }) =>
  {
    try
    {
      const response = await axios.delete(`${API_URL}/bookings/${bookingId}/`);
      return bookingId;
    } catch (error: any)
    {
      return rejectWithValue(error.response?.data?.detail || 'Failed to cancel booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) =>
    {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
  {
    builder
      .addCase(fetchBookings.pending, (state) =>
      {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) =>
      {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.pending, (state) =>
      {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) =>
      {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelBooking.pending, (state) =>
      {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) =>
      {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer; 