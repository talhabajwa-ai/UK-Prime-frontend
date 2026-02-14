import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/axios';

const statusColors = {
  pending: 'bg-yellow-500',
  preparing: 'bg-blue-500',
  ready: 'bg-green-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500'
};

const statusLabels = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/myorders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="animate-fadeIn text-center py-16">
        <div className="text-6xl mb-6">📋</div>
        <h1 className="text-3xl font-bold text-white mb-4">No Orders Yet</h1>
        <p className="text-gray-400 mb-8">You haven't placed any orders yet.</p>
        <Link to="/menu" className="btn-primary inline-block">
          Order Now
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Order ID: <span className="text-white font-mono">{order._id.slice(-8)}</span></p>
                <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center space-x-3 mt-2 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                  order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pay on Delivery'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product?.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-white">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <span className="text-xl font-bold text-white">Total: £{order.totalAmount.toFixed(2)}</span>
                <Link
                  to={`/orders/${order._id}`}
                  className="btn-primary py-2 px-4 text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
