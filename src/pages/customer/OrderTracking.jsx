import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../config/axios';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: '📝' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready', icon: '✅' },
  { key: 'delivered', label: 'Delivered', icon: '🚗' }
];

const statusColors = {
  pending: 'bg-yellow-500',
  preparing: 'bg-blue-500',
  ready: 'bg-green-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500'
};

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    const index = statusSteps.findIndex((step) => step.key === status);
    return index >= 0 ? index : 0;
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

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
        <Link to="/orders" className="btn-primary inline-block">Back to Orders</Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      <Link to="/orders" className="text-gray-400 hover:text-white mb-4 inline-block">
        ← Back to Orders
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">Order Tracking</h1>

      {/* Order Status Banner */}
      <div className={`card p-6 mb-8 ${isCancelled ? 'bg-red-500/10 border border-red-500' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-gray-400 text-sm">Order ID</p>
            <p className="text-white font-mono text-lg">{order._id}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className={`px-4 py-2 rounded-full text-white font-medium ${statusColors[order.status]}`}>
              {isCancelled ? 'Cancelled' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className={`px-4 py-2 rounded-full text-white font-medium ${
              order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pay on Delivery'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      {!isCancelled && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Order Progress</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700 -z-10"></div>
            <div 
              className="absolute top-5 left-0 h-1 bg-primary-600 -z-10 transition-all duration-500"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
            ></div>
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${
                  index <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <p className={`mt-2 text-sm ${index <= currentStep ? 'text-white' : 'text-gray-400'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Order Date</p>
              <p className="text-white">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Payment Method</p>
              <p className="text-white capitalize">{order.paymentMethod}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-gray-400 text-sm">Notes</p>
                <p className="text-white">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Delivery Address</h2>
          {order.deliveryAddress && (
            <div className="space-y-2">
              <p className="text-white">{order.deliveryAddress.street}</p>
              <p className="text-white">{order.deliveryAddress.city} {order.deliveryAddress.postcode}</p>
              <p className="text-gray-400 text-sm mt-2">Phone: {order.deliveryAddress.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="card p-6 mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-0">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product?.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400 text-sm">Qty: {item.quantity} × £{item.price.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-white font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between">
          <span className="text-xl font-bold text-white">Total</span>
          <span className="text-xl font-bold text-primary-600">£{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
