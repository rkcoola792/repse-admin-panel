import { TrendingUp, ShoppingBag, Users, BarChart3 } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
        <p className="text-gray-500 mt-1">Track your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Sales Trend</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">₹1,24,567</p>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Conversion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">3.24%</p>
          <p className="text-sm text-gray-500">+0.8% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Avg Order Value</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">₹8,456</p>
          <p className="text-sm text-gray-500">Per customer</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Detailed Analytics Coming Soon</h3>
        <p className="text-gray-500">Charts and graphs will be displayed here</p>
      </div>
    </>
  );
};

export default AnalyticsPage;