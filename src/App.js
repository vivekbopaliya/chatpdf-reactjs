import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/home-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthPage from './pages/auth-page';
import { api } from './lib/api';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

// Check authentication status
const isAuthenticated = async () => {
  try {
    const response = await api.get('/auth/me', {
      withCredentials: true,
    });
    console.log('Auth check response:', response.data);
    return true;
  } catch (error) {
    console.log('Auth check failed:', error);
    return false;
  }
};

// ProtectedRoute component to guard routes
const ProtectedRoute = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      console.log('Auth status:', isAuth);
      setAuthenticated(isAuth);
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  // If authenticated, render the protected content; otherwise, redirect to /auth
  return authenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/pdf/new" element={<HomePage />} />
            <Route path="/pdf/:pdfId" element={<HomePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/pdf/new" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;