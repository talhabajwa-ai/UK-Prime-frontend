import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axios';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postcode: '',
    phone: '',
    paymentMethod: 'cash',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        paymentMethod: formData.paymentMethod,
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          postcode: formData.postcode,
          phone: formData.phone
        },
        notes: formData.notes
      };

      const response = await api.post('/orders', orderData);
      
      clearCart();
      navigate(`/orders/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
        <Link to="/menu" className="btn-primary inline-block">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="card p-6 space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Delivery Details</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-2">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Postcode</label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'cash'
                    ? 'bg-primary-600 border-primary-600'
                    : 'border-gray-600 hover:border-gray-500'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-2xl">💵</span>
                  <span className="text-white font-medium">Cash</span>
                </label>
                <label className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'card'
                    ? 'bg-primary-600 border-primary-600'
                    : 'border-gray-600 hover:border-gray-500'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-2xl">💳</span>
                  <span className="text-white font-medium">Card</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Order Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field h-24 resize-none"
                placeholder="Any special instructions..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Place Order - £${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{item.product.name}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-white font-medium">
                    £{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>£{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-white text-lg font-bold">
                <span>Total</span>
                <span>£{getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-dark-100 rounded-lg">
              <p className="text-gray-400 text-sm">
                <span className="text-white font-medium">Delivery to:</span><br />
                {formData.street && `${formData.street}, `}
                {formData.city && `${formData.city} `}
                {formData.postcode && `(${formData.postcode})`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
