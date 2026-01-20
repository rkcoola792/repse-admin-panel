import { Eye, Edit, Trash2, Package, Plus } from 'lucide-react';

const ProductsPage = () => {
  const products = [
    { id: 1, name: 'Nike Air Max 270', category: 'Sneakers', price: '₹8,999', stock: 45, status: 'In Stock' },
    { id: 2, name: 'Adidas Ultraboost 21', category: 'Running', price: '₹12,499', stock: 23, status: 'Low Stock' },
    { id: 3, name: 'Puma RS-X³', category: 'Lifestyle', price: '₹6,999', stock: 67, status: 'In Stock' },
    { id: 4, name: 'Reebok Classic', category: 'Casual', price: '₹5,499', stock: 89, status: 'In Stock' },
    { id: 5, name: 'New Balance 574', category: 'Casual', price: '₹7,999', stock: 0, status: 'Out of Stock' },
  ];

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                      product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
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
    </>
  );
};

export default ProductsPage;