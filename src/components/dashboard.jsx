import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  Package
} from 'lucide-react';

const Dashboard = () => {
  // Stats data
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: '12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: 'Customers',
      value: '892',
      change: '3.1%',
      trend: 'down',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Growth',
      value: '18.5%',
      change: '5.4%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  // Recent orders data
  const recentOrders = [
    { id: '#ORD-001', customer: 'Rahul Sharma', product: 'Laptop', amount: '₹45,000', status: 'Delivered' },
    { id: '#ORD-002', customer: 'Priya Patel', product: 'Smartphone', amount: '₹25,000', status: 'Processing' },
    { id: '#ORD-003', customer: 'Amit Kumar', product: 'Headphones', amount: '₹3,500', status: 'Pending' },
    { id: '#ORD-004', customer: 'Sneha Reddy', product: 'Tablet', amount: '₹18,000', status: 'Delivered' },
    { id: '#ORD-005', customer: 'Vikram Singh', product: 'Smart Watch', amount: '₹12,000', status: 'Cancelled' }
  ];

  // Top products data
  const topProducts = [
    { name: 'Wireless Headphones', sales: 245, stock: 120, revenue: '₹85,750' },
    { name: 'Smart Watch Pro', sales: 189, stock: 45, revenue: '₹2,26,800' },
    { name: 'Laptop Stand', sales: 156, stock: 200, revenue: '₹23,400' },
    { name: 'USB-C Hub', sales: 134, stock: 89, revenue: '₹26,800' },
    { name: 'Bluetooth Speaker', sales: 98, stock: 150, revenue: '₹39,200' }
  ];

  // Status color helper function
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back, here's what's happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Top Products</h3>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-800 truncate">{product.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{product.sales} sales</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 mt-1">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;