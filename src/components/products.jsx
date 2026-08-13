import {
  Eye,
  Edit,
  Trash2,
  Package,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductModal from "./productModal";
import ConfirmDialog from "./confirmDialog";

const CATEGORIES = ["UpperWear", "LowerWear", "Footwear", "Accessories"];
const PAGE_SIZE = 10;

const ProductsPage = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedRows, setExpandedRows] = useState({});
  const [activeTab, setActiveTab] = useState({});

  const [modalState, setModalState] = useState(null); // { mode, product }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toggleRow = (productId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    if (!expandedRows[productId]) {
      setActiveTab((prev) => ({ ...prev, [productId]: "sizes" }));
    }
  };

  const getProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/products", {
        params: {
          page,
          limit: PAGE_SIZE,
          search: searchQuery || undefined,
          category: category || undefined,
        },
      });
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  useEffect(() => {
    const timeout = setTimeout(getProducts, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, category]);

  const handleProductSaved = (savedProduct) => {
    setModalState(null);
    if (modalState?.mode === "edit") {
      setProducts((prev) =>
        prev.map((p) => (p._id === savedProduct._id ? savedProduct : p)),
      );
    } else {
      getProducts();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/product/${deleteTarget._id}`);
      setDeleteTarget(null);
      getProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={() => setModalState({ mode: "add" })}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <>
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRow(product._id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {expandedRows[product._id] ? (
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
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                      </td>
                      <td className="py-4 whitespace-nowrap text-sm flex gap-2">
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
                            onClick={() => toggleRow(product._id)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => setModalState({ mode: "edit", product })}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedRows[product._id] && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="px-6 py-4">
                          <div className="ml-14">
                            <div className="flex gap-4 border-b border-gray-200 mb-4">
                              <button
                                onClick={() =>
                                  setActiveTab((prev) => ({ ...prev, [product._id]: "sizes" }))
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
                                  setActiveTab((prev) => ({ ...prev, [product._id]: "images" }))
                                }
                                className={`px-4 py-2 font-medium text-sm transition-colors ${
                                  activeTab[product._id] === "images"
                                    ? "text-black border-b-2 border-black"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                              >
                                Images
                              </button>
                              <button
                                onClick={() =>
                                  setActiveTab((prev) => ({ ...prev, [product._id]: "details" }))
                                }
                                className={`px-4 py-2 font-medium text-sm transition-colors ${
                                  activeTab[product._id] === "details"
                                    ? "text-black border-b-2 border-black"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                              >
                                Details
                              </button>
                            </div>

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

                            {activeTab[product._id] === "images" && (
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

                            {activeTab[product._id] === "details" && (
                              <div className="max-w-2xl">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  Description
                                </h4>
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                  {product.description || "No description provided."}
                                </p>
                                <div className="flex gap-2 mt-3">
                                  {product.newArrival && (
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                      New Arrival
                                    </span>
                                  )}
                                  {product.topSelling && (
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                      Top Selling
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}-
              {Math.min(page * PAGE_SIZE, total)} of {total} products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalState && (
        <ProductModal
          mode={modalState.mode}
          initialData={modalState.product}
          onClose={() => setModalState(null)}
          onSaved={handleProductSaved}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed from your catalog.`
            : ""
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ProductsPage;
