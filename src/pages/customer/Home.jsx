import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: '🍕',
      title: 'Fresh Ingredients',
      description: 'We use only the finest ingredients for our pizzas'
    },
    {
      icon: '🚗',
      title: 'Fast Delivery',
      description: 'Hot and fresh delivery within 30 minutes'
    },
    {
      icon: '👨‍🍳',
      title: 'Expert Chefs',
      description: 'Our chefs create delicious meals with passion'
    },
    {
      icon: '⭐',
      title: 'Quality Service',
      description: 'We ensure customer satisfaction every time'
    }
  ];

  const categories = [
    { name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', color: 'from-red-500 to-red-700' },
    { name: 'Burger', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', color: 'from-yellow-500 to-yellow-700' },
    { name: 'Deals', icon: '🎁', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400', color: 'from-green-500 to-green-700' },
    { name: 'Drinks', icon: '🥤', image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400', color: 'from-blue-500 to-blue-700' }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-red-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-yellow-300">UK Prime Pizza</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the finest fast food in town. Order now and get it delivered hot and fresh to your doorstep!
          </p>
          <Link
            to="/menu"
            className="inline-block bg-white text-primary-600 font-bold py-4 px-8 rounded-full hover:bg-yellow-300 hover:text-primary-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Order Now →
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#1f1f1f"/>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Menu Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/menu?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              >
                <div className={`h-48 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl mb-2 filter drop-shadow-lg">{category.icon}</span>
                  <h3 className="text-2xl font-bold text-white filter drop-shadow-lg">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-dark-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-dark-100 hover:bg-dark-300 transition-colors"
              >
                <span className="text-5xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Order?</h2>
          <p className="text-gray-400 mb-8">
            Browse our delicious menu and place your order today. Fast delivery guaranteed!
          </p>
          <Link
            to="/menu"
            className="inline-block btn-primary py-3 px-8 text-lg"
          >
            View Full Menu
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
