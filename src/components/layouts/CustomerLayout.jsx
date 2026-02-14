import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/menu', label: 'Menu', icon: '🍕' },
    { path: '/cart', label: 'Cart', icon: '🛒', badge: cartCount },
    { path: '/orders', label: 'Orders', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-dark-300">
      {/* Navigation */}
      <nav className="bg-dark-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">🍕</span>
              <span className="text-xl font-bold text-white">
                UK Prime <span className="text-primary-600">Pizza</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-dark-100 hover:text-white'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white hidden md:block">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-700">
          <div className="flex justify-around py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex flex-col items-center px-3 py-2 rounded-lg ${
                  location.pathname === link.path
                    ? 'text-primary-600'
                    : 'text-gray-400'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-xs mt-1">{link.label}</span>
                {link.badge > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🍕</span>
            <span className="text-lg font-bold text-white">
              UK Prime <span className="text-primary-600">Pizza</span>
            </span>
          </div>
          <p className="text-gray-400">
            © 2026 UK Prime Pizza. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Best pizza in town! Fast delivery, great taste.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
