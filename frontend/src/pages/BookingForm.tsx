import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Divider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { createBooking } from '../store/slices/bookingSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { RootState, AppDispatch } from '../store';
import { BookingFormData, BookingData, Table } from '../types';

// Add mock restaurants for fallback
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "Mock Italian Bistro",
    tables: [
      { id: 1, table_number: 1, capacity: 2, is_available: true },
      { id: 2, table_number: 2, capacity: 4, is_available: true }
    ],
  },
  {
    id: 2,
    name: "Sushi Place",
    tables: [
      { id: 3, table_number: 1, capacity: 2, is_available: true },
      { id: 4, table_number: 2, capacity: 4, is_available: false }
    ],
  },
];

const validationSchema = yup.object({
  table: yup.string().required('Table selection is required'),
  booking_date: yup.date().required('Date is required'),
  booking_time: yup.date().required('Time is required'),
  party_size: yup
    .number()
    .required('Party size is required')
    .min(1, 'Party size must be at least 1')
    .max(20, 'Party size cannot exceed 20'),
  special_requests: yup.string(),
});

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentRestaurant: restaurant, loading: restaurantLoading } = useSelector(
    (state: RootState) => state.restaurant
  );
  const { loading: bookingLoading, error: bookingError } = useSelector(
    (state: RootState) => state.booking
  );

  const [availableTables, setAvailableTables] = useState<Table[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(Number(id)));
    }
  }, [dispatch, id]);

  // Fallback: if in mock mode and restaurant is not loaded, find it from mock data
  const fallbackRestaurant = process.env.REACT_APP_USE_MOCK === 'true' && !restaurant && id
    ? MOCK_RESTAURANTS.find(r => r.id === Number(id))
    : null;
  const displayRestaurant = restaurant || fallbackRestaurant;

  useEffect(() => {
    if (displayRestaurant && displayRestaurant.tables) {
      setAvailableTables(displayRestaurant.tables.filter((table: any) => table.is_available));
    }
  }, [displayRestaurant]);

  const formik = useFormik<BookingFormData>({
    initialValues: {
      table: '',
      booking_date: null,
      booking_time: null,
      party_size: 2,
      special_requests: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!values.booking_date || !values.booking_time) return;

      const bookingData: BookingData = {
        restaurant: id ? Number(id) : 0,
        table: values.table,
        date: values.booking_date.toISOString().split('T')[0],
        time: values.booking_time.toTimeString().split(' ')[0],
        party_size: values.party_size,
        special_requests: values.special_requests,
      };

      try {
        await dispatch(createBooking(bookingData));
        navigate('/bookings');
      } catch (error) {
        console.error('Booking failed:', error);
      }
    },
  });

  if (restaurantLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!displayRestaurant) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Restaurant not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom align="center">
          Reserve Your Table
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" align="center" mb={2}>
          {displayRestaurant.name}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {bookingError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof bookingError === 'string' ? bookingError : 'An error occurred while creating the booking'}
          </Alert>
        )}
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formik.values.booking_date}
                onChange={(value) => formik.setFieldValue('booking_date', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.booking_date && Boolean(formik.errors.booking_date),
                    helperText: formik.touched.booking_date && formik.errors.booking_date,
                  },
                }}
                minDate={new Date()}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Time"
                value={formik.values.booking_time}
                onChange={(value) => formik.setFieldValue('booking_time', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.booking_time && Boolean(formik.errors.booking_time),
                    helperText: formik.touched.booking_time && formik.errors.booking_time,
                  },
                }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Table</InputLabel>
              <Select
                name="table"
                value={formik.values.table}
                onChange={formik.handleChange}
                error={formik.touched.table && Boolean(formik.errors.table)}
                label="Table"
              >
                {availableTables.length === 0 && (
                  <MenuItem value="" disabled>
                    No tables available
                  </MenuItem>
                )}
                {availableTables.map((table) => (
                  <MenuItem key={table.id} value={table.id}>
                    Table {table.table_number} (Capacity: {table.capacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              name="party_size"
              label="Party Size"
              value={formik.values.party_size}
              onChange={formik.handleChange}
              error={formik.touched.party_size && Boolean(formik.errors.party_size)}
              helperText={formik.touched.party_size && formik.errors.party_size}
              inputProps={{ min: 1, max: 20 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              name="special_requests"
              label="Special Requests (optional)"
              value={formik.values.special_requests}
              onChange={formik.handleChange}
              error={
                formik.touched.special_requests &&
                Boolean(formik.errors.special_requests)
              }
              helperText={
                formik.touched.special_requests && formik.errors.special_requests
              }
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/restaurants/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={bookingLoading}
              >
                {bookingLoading ? <CircularProgress size={24} /> : 'Book Now'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingForm; 