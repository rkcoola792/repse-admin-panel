import { useEffect, useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import api from "../api/axios";

const getStatusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "intransit":
      return "bg-blue-100 text-blue-700";
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatStatus = (status) => {
  if (!status) return "Processing";
  if (status === "intransit") return "In Transit";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const TrendBadge = ({ value }) => {
  const trend = value >= 0 ? "up" : "down";
  return (
    <div
      className={`flex items-center gap-1 text-sm font-semibold ${
        trend === "up" ? "text-green-600" : "text-red-600"
      }`}
    >
      {trend === "up" ? (
        <ArrowUpRight className="w-4 h-4" />
      ) : (
        <ArrowDownRight className="w-4 h-4" />
      )}
      {Math.abs(value)}%
    </div>
  );
};

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/dashboard-stats");
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChangePct,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      change: stats.ordersChangePct,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toLocaleString("en-IN"),
      change: stats.customersChangePct,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Products",
      value: stats.totalProducts.toLocaleString("en-IN"),
      icon: Package,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Welcome back, here's what's happening today
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.change !== undefined && <TrendBadge value={stat.change} />}
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
              <button
                onClick={() => onNavigate("orders")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {stats.recentOrders.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No orders yet</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => onNavigate("orders")}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        #{(order.orderId || order._id)?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.notes?.first_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.deliveryStatus)}`}
                        >
                          {formatStatus(order.deliveryStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Top Products</h3>
          </div>
          <div className="p-6 space-y-4">
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No sales yet</p>
            ) : (
              stats.topProducts.map((product) => (
                <div key={product._id || product.name} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-800 truncate">
                      {product.name}
                    </h4>
                    <span className="text-xs text-gray-500">{product.sales} sold</span>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStockProducts.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Low Stock Alerts</h3>
              <p className="text-xs text-gray-500">Products with fewer than 5 units in a size</p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.lowStockProducts.map((product) => (
              <button
                key={product._id}
                onClick={() => onNavigate("products")}
                className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-red-200 hover:bg-red-50/50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.totalStock} units left</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
