import { useState, useEffect } from 'react';
import api from '../../config/axios';

const categories = ['pizza', 'burger', 'drink', 'deal', 'side', 'dessert'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'pizza',
    price: '',
    image: 'https://via.placeholder.com/300x300?text=No+Image',
    available: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await api.post('/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({ ...formData, image: response.data.data.url });
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      available: product.available
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'pizza',
      price: '',
      image: 'https://via.placeholder.com/300x300?text=No+Image',
      available: true
    });
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
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-100">
              <tr>
                <th className="text-left py-4 px-4 text-gray-400">Image</th>
                <th className="text-left py-4 px-4 text-gray-400">Name</th>
                <th className="text-left py-4 px-4 text-gray-400">Category</th>
                <th className="text-left py-4 px-4 text-gray-400">Price</th>
                <th className="text-left py-4 px-4 text-gray-400">Status</th>
                <th className="text-left py-4 px-4 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-700 hover:bg-dark-100">
                  <td className="py-4 px-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-4 px-4 text-white font-medium">{product.name}</td>
                  <td className="py-4 px-4 text-gray-400 capitalize">{product.category}</td>
                  <td className="py-4 px-4 text-primary-600 font-medium">£{product.price.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-200 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-gray-300 mb-2">Product Image</label>
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                  />
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="btn-secondary cursor-pointer inline-block text-center"
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </label>
                    <p className="text-gray-500 text-xs mt-2">
                      Supports JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field h-24 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-dark-200">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="available" className="text-gray-300">Available</label>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
