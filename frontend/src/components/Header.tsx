import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header: FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary">
            BulkPlainTShirt
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for T-shirts..."
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/catalog" className="text-gray-600 hover:text-primary transition">Catalog</Link>
            <Link to="/enquiry" className="text-gray-600 hover:text-primary transition">Enquiry</Link>
            <Link to="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-primary transition" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary transition font-bold text-sm uppercase tracking-widest">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user?.username}</span>
                </Link>
                {user?.role === 'ROLE_ADMIN' && (
                  <Link to="/admin" className="text-primary hover:text-gray-800 transition font-black text-xs uppercase tracking-widest border-2 border-primary/10 px-4 py-2 rounded-xl">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
                <User className="h-6 w-6" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary transition"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-6 space-y-4">
          <Link to="/catalog" className="block text-lg font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
          <Link to="/enquiry" className="block text-lg font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>Enquiry</Link>
          <hr />
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="block text-lg font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>Profile ({user?.username})</Link>
              {user?.role === 'ROLE_ADMIN' && (
                <Link to="/admin" className="block text-lg font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left text-lg font-medium text-red-600">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
