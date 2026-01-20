import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Search, 
  Bell, 
  ChevronDown,
  DollarSign,

} from 'lucide-react';
import Dashboard from './dashboard';
import ProductsPage from './products';
import OrdersPage from './orders';
import CustomersPage from './customers';
import AnalyticsPage from './analytics';
import SettingsPage from './settings';

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { 
      title: 'Total Revenue', 
      value: '₹45,231', 
      change: '+20.1%', 
      trend: 'up', 
      icon: DollarSign,
      color: 'bg-blue-500' 
    },
    { 
      title: 'Orders', 
      value: '2,456', 
      change: '+15.3%', 
      trend: 'up', 
      icon: ShoppingCart,
      color: 'bg-green-500' 
    },
    { 
      title: 'Products', 
      value: '1,234', 
      change: '+8.2%', 
      trend: 'up', 
      icon: Package,
      color: 'bg-purple-500' 
    },
    { 
      title: 'Customers', 
      value: '8,542', 
      change: '-2.4%', 
      trend: 'down', 
      icon: Users,
      color: 'bg-orange-500' 
    }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', product: 'Nike Air Max', amount: '₹8,999', status: 'Completed', date: '2 min ago' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'Adidas Ultraboost', amount: '₹12,499', status: 'Processing', date: '15 min ago' },
    { id: '#ORD-003', customer: 'Mike Johnson', product: 'Puma RS-X', amount: '₹6,999', status: 'Pending', date: '1 hour ago' },
    { id: '#ORD-004', customer: 'Sarah Williams', product: 'Reebok Club C', amount: '₹5,499', status: 'Completed', date: '3 hours ago' },
    { id: '#ORD-005', customer: 'Tom Brown', product: 'New Balance 574', amount: '₹7,999', status: 'Cancelled', date: '5 hours ago' }
  ];

  const topProducts = [
    { name: 'Nike Air Max 270', sales: 342, revenue: '₹30,77,658', stock: 45 },
    { name: 'Adidas Ultraboost 21', sales: 289, revenue: '₹36,13,611', stock: 23 },
    { name: 'Puma RS-X³', sales: 245, revenue: '₹17,14,755', stock: 67 },
    { name: 'Reebok Classic', sales: 198, revenue: '₹10,88,802', stock: 89 }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          {sidebarOpen && <h1 className="text-2xl font-bold text-gray-800">Repse</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@repse.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer">
                A
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <Dashboard/>}
          {activeTab === 'products' && <ProductsPage/>}
          {activeTab === 'orders' && <OrdersPage/>}
          {activeTab === 'customers' && <CustomersPage/>}
          {activeTab === 'analytics' && <AnalyticsPage/>}
          {activeTab === 'settings' && <SettingsPage/>}
        </main>
      </div>
    </div>
  );
}