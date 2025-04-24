import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/home-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/pdf/new"
          element={<HomePage />}
        />
        <Route
          path="/pdf/:pdfId"
          element={<HomePage />}
        />
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;