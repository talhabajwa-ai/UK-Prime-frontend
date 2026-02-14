import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  // Filter out invalid cart items
  const validCartItems = cart.filter((item) => item && item.product && item.product._id);

  if (validCartItems.length === 0) {
    return (
      <div className="animate-fadeIn text-center py-16">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/menu" className="btn-primary py-3 px-8 inline-block">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {validCartItems.map((item) => (
            <div key={item.product._id} className="card p-4 flex items-center space-x-4">
              <img
                src={item.product.image || 'https://via.placeholder.com/96'}
                alt={item.product.name || 'Product'}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{item.product.name || 'Unknown Product'}</h3>
                <p className="text-gray-400 text-sm">{item.product.category || 'Unknown'}</p>
                <p className="text-primary-600 font-semibold mt-1">
                  £{typeof item.product.price === 'number' ? item.product.price.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className="w-8 h-8 bg-dark-100 rounded-full flex items-center justify-center text-white hover:bg-dark-300 transition-colors"
                >
                  -
                </button>
                <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="w-8 h-8 bg-dark-100 rounded-full flex items-center justify-center text-white hover:bg-dark-300 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  £{typeof item.product.price === 'number' ? (item.product.price * item.quantity).toFixed(2) : '0.00'}
                </p>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-500 hover:text-red-400 text-sm mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>£{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="border-t border-gray-700 pt-4 flex justify-between text-white text-lg font-bold">
                <span>Total</span>
                <span>£{getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full btn-primary py-3 text-center block"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              to="/menu"
              className="block text-center text-gray-400 hover:text-white mt-4"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
