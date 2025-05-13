import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import BookingList from './pages/BookingList';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import BookingForm from './pages/BookingForm';
import ManagerRestaurants from './pages/manager/ManagerRestaurants';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const App: React.FC = () =>
{
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/book/:id" element={<BookingForm />} />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <BookingList />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/manager/restaurants" element={user?.role === 'manager' ? <ManagerRestaurants /> : <Navigate to="/unauthorized" />} />
            <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/unauthorized" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 