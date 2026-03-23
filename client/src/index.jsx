import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

import Navbar       from './components/layout/Navbar';
import Footer       from './components/layout/Footer';
import HomePage     from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage  from './pages/ProductPage';
import CartPage     from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage  from './pages/AccountPage';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/"             element={<HomePage />} />
                  <Route path="/products"     element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductPage />} />
                  <Route path="/cart"         element={<PrivateRoute><CartPage /></PrivateRoute>} />
                  <Route path="/checkout"     element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                  <Route path="/account"      element={<PrivateRoute><AccountPage /></PrivateRoute>} />
                  <Route path="/login"        element={<LoginPage />} />
                  <Route path="/register"     element={<RegisterPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                className: '',
                style: { borderRadius: '4px', fontSize: '14px' },
                success: { className: 'toast-success' },
                error:   { className: 'toast-error' },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
