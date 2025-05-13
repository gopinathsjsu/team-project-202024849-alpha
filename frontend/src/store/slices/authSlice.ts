import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User
{
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthState
{
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'customer1',
    email: 'customer1@example.com',
    first_name: 'Alice',
    last_name: 'Customer',
    role: 'customer',
  },
  {
    id: 2,
    username: 'manager1',
    email: 'manager1@example.com',
    first_name: 'Bob',
    last_name: 'Manager',
    role: 'manager',
  },
  {
    id: 3,
    username: 'admin1',
    email: 'admin1@example.com',
    first_name: 'Carol',
    last_name: 'Admin',
    role: 'admin',
  },
];

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) =>
  {
    if (process.env.REACT_APP_USE_MOCK === 'true') {
      // Accept password 'password' for all mock users
      const user = MOCK_USERS.find(u => u.username === credentials.username);
      if (user && credentials.password === 'password') {
        const token = `mock-token-${user.username}`;
        localStorage.setItem('token', token);
        return { token, user };
      } else {
        throw new Error('Invalid mock username or password');
      }
    }
    const response = await axios.post(`${API_URL}/users/login/`, credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { token, user };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
  }) =>
  {
    const response = await axios.post(`${API_URL}/users/register/`, userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { token, user };
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: { first_name: string; last_name: string; email: string }) =>
  {
    const response = await axios.patch('/api/auth/profile/', profileData, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async () =>
{
  localStorage.removeItem('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
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
      // Login
      .addCase(login.pending, (state) =>
      {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) =>
      {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) =>
      {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) =>
      {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) =>
      {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) =>
      {
        state.loading = false;
        state.error = action.error.message || 'Profile update failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) =>
      {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 