import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get('/orders?status=pending'),
        api.get('/orders/stats/all')
      ]);
      setRecentOrders(ordersRes.data.data.slice(0, 5));
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales',
      value: `£${stats?.totalSales?.total?.toFixed(2) || '0.00'}`,
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: stats?.totalSales?.count || 0,
      icon: '📋',
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Orders',
      value: recentOrders.filter((o) => o.status === 'pending').length,
      icon: '⏳',
      color: 'bg-yellow-500'
    },
    {
      title: 'Products',
      value: 16,
      icon: '🍕',
      color: 'bg-primary-500'
    }
  ];

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <span className={`text-4xl ${stat.color} bg-opacity-20 rounded-full p-3`}>
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-500 text-sm">
              View All →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No pending orders</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-0">
                  <div>
                    <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                    <p className="text-gray-400 text-sm">{order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">£{order.totalAmount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-500 text-white' :
                      order.status === 'preparing' ? 'bg-blue-500 text-white' :
                      order.status === 'ready' ? 'bg-green-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-6">Orders by Status</h2>
          <div className="space-y-4">
            {stats?.ordersByStatus?.map((status) => (
              <div key={status._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${
                    status._id === 'pending' ? 'bg-yellow-500' :
                    status._id === 'preparing' ? 'bg-blue-500' :
                    status._id === 'ready' ? 'bg-green-500' :
                    status._id === 'delivered' ? 'bg-gray-500' :
                    'bg-red-500'
                  }`}></span>
                  <span className="text-white capitalize">{status._id}</span>
                </div>
                <span className="text-white font-bold">{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card p-6 mt-8">
        <h2 className="text-xl font-bold text-white mb-6">Top Selling Products</h2>
        {stats?.topProducts?.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No sales data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Product</th>
                  <th className="text-left py-3 px-4 text-gray-400">Quantity Sold</th>
                  <th className="text-left py-3 px-4 text-gray-400">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats?.topProducts?.slice(0, 5).map((product, index) => (
                  <tr key={index} className="border-b border-gray-700 last:border-0">
                    <td className="py-3 px-4 text-white">{product.name}</td>
                    <td className="py-3 px-4 text-gray-400">{product.totalQuantity}</td>
                    <td className="py-3 px-4 text-green-500 font-medium">£{product.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
