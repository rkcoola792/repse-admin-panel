import { Eye, Edit, Trash2, UserPlus } from 'lucide-react';

const CustomersPage = () => {
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, spent: '₹45,670', joined: 'Dec 2024' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, spent: '₹32,450', joined: 'Jan 2025' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', orders: 15, spent: '₹67,890', joined: 'Nov 2024' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', orders: 5, spent: '₹23,100', joined: 'Jan 2026' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', orders: 20, spent: '₹89,450', joined: 'Oct 2024' },
  ];

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Customers</h2>
          <p className="text-gray-500 mt-1">View and manage your customers</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{customer.spent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.joined}</td>
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
    </>
  );
};

export default CustomersPage;