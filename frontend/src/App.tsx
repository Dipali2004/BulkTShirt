import { FC, ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import EnquiryForm from './components/EnquiryForm';
import WhatsAppContact from './components/WhatsAppContact';
import AdminDashboard from './components/AdminDashboard';
import GlobalToast from './components/GlobalToast';

const ProtectedRoute: FC<{ children: ReactNode; role?: string }> = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const HomePage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="mb-12 text-center">
      <h1 className="text-5xl font-black text-gray-800 mb-4 tracking-tight">Premium Plain T-Shirts</h1>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
        High-quality 100% cotton blank apparel for your printing business. 
        Ready stock with lightning fast delivery across India.
      </p>
    </div>
    <ProductList />
  </div>
);

const App: FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
          <div className="min-h-screen bg-accent selection:bg-primary selection:text-white">
            <GlobalToast />
            <Header />
            <main className="pb-24">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/catalog" element={<HomePage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute role="ROLE_ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/enquiry" element={<div className="py-12 px-4"><EnquiryForm /></div>} />
                {/* Add more routes as needed */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <WhatsAppContact />
            <footer className="bg-white border-t py-12 mt-12">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-black text-primary tracking-tighter mb-4 uppercase italic">BulkPlainTShirt</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">© 2026 BulkPlainTShirt. All rights reserved.</p>
              </div>
            </footer>
          </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
