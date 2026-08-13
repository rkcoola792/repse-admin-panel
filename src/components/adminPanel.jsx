import { useState } from "react";
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
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import api from "../api/axios";
import Dashboard from "./dashboard";
import ProductsPage from "./products";
import OrdersPage from "./orders";
import CustomersPage from "./customers";
import AnalyticsPage from "./analytics";
import SettingsPage from "./settings";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const searchPlaceholder = {
  products: "Search products by name...",
  orders: "Search orders by id or customer...",
  customers: "Search customers by name or email...",
};

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const initials = (user?.name?.[0] || "A").toUpperCase();

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    try {
      await api.post("/signout");
    } catch (error) {
      console.error("Signout failed:", error);
    }
    dispatch(logout());
  };

  const isSearchable = ["products", "orders", "customers"].includes(activeTab);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
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
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-full flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {initials}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </button>

          {menuOpen && (
            <div
              className={`absolute bottom-full mb-2 ${sidebarOpen ? "left-4 right-4" : "left-2"} bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden`}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={!isSearchable}
                  placeholder={
                    isSearchable
                      ? searchPlaceholder[activeTab]
                      : "Search available on Products, Orders & Customers"
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === "dashboard" && <Dashboard onNavigate={navigateTo} />}
          {activeTab === "products" && <ProductsPage searchQuery={searchQuery} />}
          {activeTab === "orders" && <OrdersPage searchQuery={searchQuery} />}
          {activeTab === "customers" && <CustomersPage searchQuery={searchQuery} />}
          {activeTab === "analytics" && <AnalyticsPage />}
          {activeTab === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
