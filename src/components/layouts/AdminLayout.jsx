import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '🍕' },
    { path: '/admin/orders', label: 'Orders', icon: '📋' },
    { path: '/admin/sales', label: 'Sales Report', icon: '💰' }
  ];

  return (
    <div className="min-h-screen bg-dark-300 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-200 shadow-lg">
        <div className="p-6">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-3xl">🍕</span>
            <span className="text-xl font-bold text-white">
              UK Prime <span className="text-primary-600">Pizza</span>
            </span>
          </Link>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white border-r-4 border-white'
                  : 'text-gray-400 hover:bg-dark-100 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-gray-400 text-sm capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-dark-100 hover:bg-dark-300 text-white py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
          <Link
            to="/"
            className="block mt-2 text-center text-gray-400 hover:text-white py-2 rounded-lg transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
