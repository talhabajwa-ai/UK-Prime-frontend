import { useState, useEffect } from 'react';
import api from '../../config/axios';

const statusColors = {
  pending: 'bg-yellow-500',
  preparing: 'bg-blue-500',
  ready: 'bg-green-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['pending', 'preparing', 'ready', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">Order Management</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 border-l-4 border-yellow-500">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-white">{pendingOrders.length}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-500">
          <p className="text-gray-400 text-sm">Preparing</p>
          <p className="text-2xl font-bold text-white">{preparingOrders.length}</p>
        </div>
        <div className="card p-4 border-l-4 border-green-500">
          <p className="text-gray-400 text-sm">Ready</p>
          <p className="text-2xl font-bold text-white">{readyOrders.length}</p>
        </div>
        <div className="card p-4 border-l-4 border-gray-500">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400">No orders to display</p>
          </div>
        ) : (
          orders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            return (
              <div key={order._id} className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {order.user?.name?.charAt(0).toUpperCase() || 'G'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">{order.user?.name || 'Guest'}</p>
                      <p className="text-gray-400 text-sm">{order.user?.phone || 'No phone provided'}</p>
                      <p className="text-gray-500 text-xs">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-white font-medium ${statusColors[order.status]}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {order.items.length} items • £{order.totalAmount.toFixed(2)}
                    </span>
                    
                    {order.status !== 'cancelled' && order.status !== 'delivered' && nextStatus && (
                      <button
                        onClick={() => updateStatus(order._id, nextStatus)}
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        → {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                      </button>
                    )}
                    
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateStatus(order._id, 'delivered')}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        ✓ Complete Delivery
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, index) => (
                      <span
                        key={index}
                        className="bg-dark-100 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="mt-3 text-sm text-gray-400">
                    📍 {order.deliveryAddress.street}, {order.deliveryAddress.city} {order.deliveryAddress.postcode}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
