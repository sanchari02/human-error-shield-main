import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react'; // Make sure to import an icon for loading

import LandingPage from './pages/LandingPage'; 
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import History from './pages/History';

// --- Improved Protection Logic ---
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); // Ensure your AuthContext provides 'loading'

  // 1. If Firebase is still checking the user, show a loading spinner instead of redirecting
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  // 2. Once loading is done, if no user, redirect to Landing Page
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // 3. If user exists, show the protected page
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="h-full min-h-screen bg-gray-900 text-gray-100">
          <Routes>
            {/* PUBLIC ROUTE */}
            <Route path="/" element={<LandingPage />} />

            {/* PRIVATE ROUTES */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/history" 
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              } 
            />

            {/* CATCH-ALL */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}