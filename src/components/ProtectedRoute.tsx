// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import Loader from './screens/loader';

const ProtectedRoute: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div><Loader/></div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
