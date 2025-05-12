import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { register, clearError } from '../store/slices/authSlice';
import { RootState } from '../store';

const validationSchema = yup.object({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password1: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  password2: yup.string().oneOf([yup.ref('password1')], 'Passwords must match').required('Confirm password is required'),
  role: yup.string().required('Role is required'),
  phone_number: yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number'),
});

const roles = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'RESTAURANT_MANAGER', label: 'Restaurant Manager' },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password1: '',
      password2: '',
      role: 'CUSTOMER',
      phone_number: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(register({
        username: values.username,
        email: values.email,
        password: values.password1,
        first_name: '',
        last_name: '',
        role: values.role,
        // phone_number: values.phone_number, // Only if backend supports it
      }) as any);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign up</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">
            {typeof error === 'string' ? error : 'An error occurred during registration'}
          </div>
        )}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
              autoComplete="username"
              autoFocus
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-sm">{formik.errors.username}</div>
            )}
          </div>
          <div>
            <label className="block mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
              autoComplete="email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password1"
              value={formik.values.password1}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
              autoComplete="new-password"
            />
            {formik.touched.password1 && formik.errors.password1 && (
              <div className="text-red-500 text-sm">{formik.errors.password1}</div>
            )}
          </div>
          <div>
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formik.values.password2}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
              autoComplete="new-password"
            />
            {formik.touched.password2 && formik.errors.password2 && (
              <div className="text-red-500 text-sm">{formik.errors.password2}</div>
            )}
          </div>
          <div>
            <label className="block mb-1">Role</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
            >
              {roles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 text-sm">{formik.errors.role}</div>
            )}
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1"
              autoComplete="tel"
            />
            {formik.touched.phone_number && formik.errors.phone_number && (
              <div className="text-red-500 text-sm">{formik.errors.phone_number}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <button
            type="button"
            className="w-full text-blue-600 underline mt-2"
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 