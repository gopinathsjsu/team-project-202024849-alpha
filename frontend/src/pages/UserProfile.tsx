import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <div className="container mx-auto mt-4 max-w-md">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">No user info available.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-4 max-w-md">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="space-y-2">
          <div><b>Username:</b> {user.username}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Role:</b> {user.role}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 