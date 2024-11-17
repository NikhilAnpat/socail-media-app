// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import LogIn from './components/auth/login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/auth/signUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard';
import UserProfile from './components/screens/userProfile';
import SuggestionFrd from './components/screens/suggestionFrd';
import ProtectedRoute from './components/ProtectedRoute';
import Post from './components/screens/post';
import Loader from './components/screens/loader';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 100); 

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="">
      <Router>
        <div className="relative">
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 flex justify-center items-center">
              <Loader />
            </div>
          )}

          <Routes>
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/friends" element={<SuggestionFrd />} />
              <Route path="/post" element={<Post />} />
            </Route>
          </Routes>
        </div>
        <ToastContainer />
      </Router>
    </div>
  );
}

export default App;
