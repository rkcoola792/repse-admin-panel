import { Eye, Edit, X, Package } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";

const DELIVERY_STATUS_OPTIONS = ["processing", "intransit", "delivered", "cancelled", "stock_issue"];

const OrdersPage = ({ searchQuery = "" }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newDeliveryStatus, setNewDeliveryStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const getOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/get-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (order, e) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setNewDeliveryStatus(order.deliveryStatus || "processing");
    setUpdateError("");
    setIsModalOpen(true);
  };

  const handleViewClick = (order, e) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setNewDeliveryStatus("");
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setUpdateLoading(true);
      setUpdateError("");
      const orderId = selectedOrder._id?.$oid || selectedOrder._id;
      await api.put("/update-delivery-status", {
        deliveryStatus: newDeliveryStatus,
        orderId: orderId,
      });

      setOrders(
        orders.map((order) => {
          const currentOrderId = order._id?.$oid || order._id;
          if (currentOrderId === orderId) {
            return { ...order, deliveryStatus: newDeliveryStatus };
          }
          return order;
        }),
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      setUpdateError(
        error.response?.data?.error || "Failed to update delivery status",
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
    const intervalId = setInterval(() => {
      getOrders();
    }, 180000);
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "intransit":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "stock_issue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    const date = new Date(dateObj);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (deliveryStatus) => {
    if (!deliveryStatus) return "Processing";
    if (deliveryStatus === "intransit") return "In Transit";
    if (deliveryStatus === "stock_issue") return "Stock Issue — Review";
    return deliveryStatus.charAt(0).toUpperCase() + deliveryStatus.slice(1);
  };

  const getProductNames = (items) => {
    if (!items || items.length === 0) return "No items";
    if (items.length === 1) return items[0].name;
    return `${items[0].name} +${items.length - 1} more`;
  };

  const calculateItemTotal = (item) => {
    return ((item.price || 0) * (item.quantity || 0)).toFixed(2);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter && (order.deliveryStatus || "processing") !== statusFilter) {
        return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (order.orderId || "").toLowerCase().includes(q) ||
        (order.receipt || "").toLowerCase().includes(q) ||
        (order.notes?.first_name || "").toLowerCase().includes(q) ||
        (order.notes?.email || "").toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, searchQuery]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={getOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Orders</h2>
            <p className="text-gray-500 mt-1">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">All statuses</option>
              {DELIVERY_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
            <button
              onClick={getOrders}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Delivery Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id?.$oid || order._id}
                    onClick={() => handleRowClick(order)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {order.orderId || order.receipt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>
                        <div className="font-medium">
                          {order.notes?.first_name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.notes?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getProductNames(order.items)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.deliveryStatus)}`}
                      >
                        {formatStatus(order.deliveryStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleViewClick(order, e)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => handleEditClick(order, e)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Update status"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                Order Details
              </h3>
              <button
                onClick={handleCloseDetailsModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Order Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 mr-2"></span>
                  Order Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Order ID
                    </p>
                    <p className="font-semibold text-gray-800">
                      {selectedOrder.orderId || selectedOrder.receipt}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Delivery Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.deliveryStatus)}`}
                    >
                      {formatStatus(selectedOrder.deliveryStatus)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Total Amount
                    </p>
                    <p className="font-semibold text-gray-800 text-lg">
                      ₹{selectedOrder.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Payment Status
                    </p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {selectedOrder.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Order Date
                    </p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Last Updated
                    </p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedOrder.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 mr-2"></span>
                  Customer Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Full Name
                      </p>
                      <p className="font-semibold text-gray-800">
                        {selectedOrder.notes?.first_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Email Address
                      </p>
                      <p className="font-semibold text-gray-800 break-all">
                        {selectedOrder.notes?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Mobile Number
                    </p>
                    <p className="font-semibold text-gray-800">
                      {selectedOrder.notes?.mobile || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Delivery Address
                    </p>
                    <p className="font-semibold text-gray-800 leading-relaxed">
                      {selectedOrder.notes?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 mr-2"></span>
                  Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray"%3E%3Crect width="24" height="24"/%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-lg mb-2">
                            {item.name}
                          </p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 uppercase font-medium mr-2">
                                Size:
                              </span>
                              <span className="text-sm font-medium text-gray-700">
                                {item.size}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 uppercase font-medium mr-2">
                                Quantity:
                              </span>
                              <span className="text-sm font-medium text-gray-700">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 uppercase font-medium mr-2">
                                Unit Price:
                              </span>
                              <span className="text-sm font-medium text-gray-700">
                                ₹{item.price}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                            Subtotal
                          </p>
                          <p className="font-bold text-gray-800 text-xl">
                            ₹{calculateItemTotal(item)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseDetailsModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setNewDeliveryStatus(
                      selectedOrder.deliveryStatus || "processing",
                    );
                    setUpdateError("");
                    setIsModalOpen(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Delivery Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Update Delivery Status
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Order ID:{" "}
                <span className="font-semibold">
                  {selectedOrder?.orderId || selectedOrder?.receipt}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Customer:{" "}
                <span className="font-semibold">
                  {selectedOrder?.notes?.first_name}
                </span>
              </p>
            </div>

            {updateError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {updateError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Status
              </label>
              <select
                value={newDeliveryStatus}
                onChange={(e) => setNewDeliveryStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DELIVERY_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updateLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updateLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;
