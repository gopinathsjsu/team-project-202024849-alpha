import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../auth/Register';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Register Page', () =>
{
  it('renders the registration form', () =>
  {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () =>
  {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    expect(await screen.findByText(/Passwords must match/i)).toBeInTheDocument();
  });

  it('submits registration form and calls API', async () =>
  {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'fake-token', user: { username: 'testuser' } }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'User' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() =>
    {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/users/register/',
        expect.objectContaining({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123',
          first_name: 'Test',
          last_name: 'User',
          role: expect.any(String)
        })
      );
    });
  });
});
