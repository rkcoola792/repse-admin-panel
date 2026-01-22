import {
  Eye,
  Edit,
  Trash2,
  Package,
  Plus,
  X,
  Upload,
  Trash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import axios from "axios";

const ProductsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    newArrival: false,
    topSelling: false,
    images: [],
    variants: [
      { size: "Small", stock: 0 },
      { size: "Medium", stock: 0 },
      { size: "Large", stock: 0 },
    ],
  });

  const [imageUrl, setImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState({});

  const toggleRow = (productId) => {
    console.log("Toggling row for product ID:", productId);
    setExpandedRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    // Set default tab to 'sizes' when expanding
    if (!expandedRows[productId]) {
      setActiveTab((prev) => ({
        ...prev,
        [productId]: "sizes",
      }));
    }
  };
  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/products?skip=0&limit=50`,
        { withCredentials: true },
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantStockChange = (index, value) => {
    setNewProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, stock: parseInt(value) || 0 } : variant,
      ),
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddProduct = async (e) => {
    try {
      e.preventDefault();

      if (imageUrl.trim()) {
        handleAddImage();
      }

      const imagesToSend = imageUrl.trim()
        ? [...newProduct.images, imageUrl.trim()]
        : newProduct.images;

      // Map variant sizes to match the enum: S, M, L
      const mappedVariants = newProduct.variants.map((variant) => ({
        size:
          variant.size === "Small"
            ? "S"
            : variant.size === "Medium"
              ? "M"
              : "L",
        sku: `${newProduct.name.substring(0, 3).toUpperCase()}-${variant.size === "Small" ? "S" : variant.size === "Medium" ? "M" : "L"}-${Date.now()}`,
        stock: Number(variant.stock) || 0,
      }));

      // Make the API call with await
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/product`,
        {
          name: newProduct.name,
          price: Number(newProduct.price),
          description: newProduct.description,
          category: newProduct.category,
          newArrival: newProduct.newArrival,
          topSelling: newProduct.topSelling,
          images: imagesToSend,
          variants: mappedVariants,
        },
        { withCredentials: true },
      );

      // Add the created product to state
      setProducts((prev) => [...prev, response.data]);

      // Reset form
      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        newArrival: false,
        topSelling: false,
        images: [],
        variants: [
          { size: "Small", stock: 0 },
          { size: "Medium", stock: 0 },
          { size: "Large", stock: 0 },
        ],
      });
      setImageUrl("");
      setShowModal(false);

      // Optional: Show success message
      console.log("Product added successfully:", response.data);
    } catch (error) {
      console.error("Error adding product:", error);
      // Optional: Show error message to user
      alert(error.response?.data?.message || "Failed to add product");
    }
  };
  console.log("Products:", products);
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"></th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((product) => (
                <>
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          console.log("product id", product?._id);
                          toggleRow(product?._id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {expandedRows[product?._id] ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                    </td>
                    <td className=" py-4 whitespace-nowrap text-sm flex gap-2">
                      {product.variants.map((v) => (
                        <span
                          key={v._id}
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            v.stock < 4
                              ? "bg-red-100 text-red-800"
                              : v.stock >= 5 && v.stock <= 10
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {v.size} : {v.stock}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row - Tabs */}
                  {expandedRows[product._id] && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-6 py-4">
                        <div className="ml-14">
                          {/* Tab Navigation */}
                          <div className="flex gap-4 border-b border-gray-200 mb-4">
                            <button
                              onClick={() =>
                                setActiveTab((prev) => ({
                                  ...prev,
                                  [product._id]: "sizes",
                                }))
                              }
                              className={`px-4 py-2 font-medium text-sm transition-colors ${
                                (activeTab[product._id] || "sizes") === "sizes"
                                  ? "text-black border-b-2 border-black"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              Sizes
                            </button>
                            <button
                              onClick={() =>
                                setActiveTab((prev) => ({
                                  ...prev,
                                  [product._id]: "images",
                                }))
                              }
                              className={`px-4 py-2 font-medium text-sm transition-colors ${
                                activeTab[product._id] === "images"
                                  ? "text-black border-b-2 border-black"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              Images
                            </button>
                          </div>

                          {/* Tab Content */}
                          {(activeTab[product._id] || "sizes") === "sizes" && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Stock by Size
                              </h4>
                              <div className="grid grid-cols-3 gap-4 max-w-md">
                                {product.variants.map((variant, index) => (
                                  <div
                                    key={index}
                                    className="bg-white p-3 rounded-lg border border-gray-200"
                                  >
                                    <div className="text-xs text-gray-500 mb-1">
                                      {variant.size}
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800">
                                      {variant.stock}
                                      <span className="text-xs text-gray-500 font-normal ml-1">
                                        units
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeTab[product.id] === "images" && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Product Images
                              </h4>
                              {product.images && product.images.length > 0 ? (
                                <div className="grid grid-cols-4 gap-4 max-w-3xl">
                                  {product.images.map((image, index) => (
                                    <div
                                      key={index}
                                      className="bg-white p-2 rounded-lg border border-gray-200 aspect-square"
                                    >
                                      <img
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="w-full h-full object-cover rounded"
                                        onError={(e) => {
                                          e.target.src =
                                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray"%3E%3Crect width="24" height="24"/%3E%3C/svg%3E';
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500 italic">
                                  No images available
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Add New Product
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Slim Fit Chinos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="64.99"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="UpperWear">UpperWear</option>
                    <option value="LowerWear">LowerWear</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Modern slim fit chinos in versatile neutral color..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Variant Stock Inputs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Stock by Size *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {newProduct.variants.map((variant, index) => (
                    <div key={index}>
                      <label className="block text-xs text-gray-600 mb-1">
                        {variant.size}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantStockChange(index, e.target.value)
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Total stock:{" "}
                  {newProduct.variants.reduce(
                    (sum, v) => sum + parseInt(v.stock || 0, 10),
                    0,
                  )}{" "}
                  units
                </p>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="newArrival"
                    checked={newProduct.newArrival}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    New Arrival
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="topSelling"
                    checked={newProduct.topSelling}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Top Selling
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images (URLs)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {newProduct.images.length > 0 && (
                  <div className="space-y-2">
                    {newProduct.images.map((img, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) =>
                            (e.target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray"%3E%3Crect width="24" height="24"/%3E%3C/svg%3E')
                          }
                        />
                        <span className="flex-1 text-sm text-gray-600 truncate">
                          {img}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Trash className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductsPage;
