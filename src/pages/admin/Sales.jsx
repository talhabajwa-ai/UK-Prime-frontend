import { useState, useEffect } from 'react';
import api from '../../config/axios';

const Sales = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/orders/stats/all');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">Sales Report</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-500 mt-2">
            £{stats?.totalSales?.total?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-white mt-2">
            {stats?.totalSales?.count || 0}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-gray-400 text-sm">Average Order Value</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            £{((stats?.totalSales?.total || 0) / (stats?.totalSales?.count || 1)).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Monthly Sales */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Monthly Sales</h2>
        {stats?.monthlySales?.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No sales data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Month</th>
                  <th className="text-left py-3 px-4 text-gray-400">Orders</th>
                  <th className="text-left py-3 px-4 text-gray-400">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats?.monthlySales?.map((month, index) => (
                  <tr key={index} className="border-b border-gray-700 last:border-0">
                    <td className="py-3 px-4 text-white font-medium">
                      {month._id?.split('-')[0]}-{month._id?.split('-')[1]}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{month.count}</td>
                    <td className="py-3 px-4 text-green-500 font-medium">£{month.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Daily Sales Chart */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Daily Sales (Last 30 Days)</h2>
        {stats?.dailySales?.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No sales data available</p>
        ) : (
          <div className="h-64 flex items-end space-x-2">
            {stats?.dailySales?.map((day, index) => {
              const maxRevenue = Math.max(...(stats?.dailySales?.map((d) => d.total) || [1]));
              const height = (day.total / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary-600 rounded-t hover:bg-primary-500 transition-colors cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${day._id}: £${day.total.toFixed(2)} (${day.count} orders)`}
                  ></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="card p-6">
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
                {stats?.topProducts?.map((product, index) => (
                  <tr key={index} className="border-b border-gray-700 last:border-0">
                    <td className="py-3 px-4 text-white font-medium">{product.name}</td>
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

export default Sales;
