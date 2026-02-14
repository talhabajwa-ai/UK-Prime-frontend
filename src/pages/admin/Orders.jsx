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
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
      const response = await api.get(url);
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
      year: 'numeric',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">All Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-48"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {order.user?.name?.charAt(0).toUpperCase() || 'G'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                    <p className="text-gray-400 text-sm">{order.user?.phone || 'No phone'}</p>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    order.paymentMethod === 'cash' ? 'bg-gray-500' : 'bg-green-500'
                  }`}>
                    {order.paymentMethod === 'cash' ? 'Cash' : 'Card'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Items:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-white">{item.name} x{item.quantity}</span>
                      <span className="text-gray-400">£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400">
                  <p>Order ID: <span className="font-mono text-gray-300">{order._id.slice(-8)}</span></p>
                  <p>Date: {formatDate(order.createdAt)}</p>
                  {order.deliveryAddress && (
                    <p className="mt-1">
                      Address: {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    </p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                  <span className="text-xl font-bold text-white">
                    £{order.totalAmount.toFixed(2)}
                  </span>
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      onClick={() => updateStatus(order._id, getNextStatus(order.status))}
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      Mark as {getNextStatus(order.status)?.charAt(0).toUpperCase() + getNextStatus(order.status)?.slice(1)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
