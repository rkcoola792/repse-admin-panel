import { useRef, useState } from "react";
import { Plus, Pencil, X, Upload, Trash, ImagePlus } from "lucide-react";
import api from "../api/axios";

const MAX_IMAGE_MB = 5;

const SIZES = ["S", "M", "L"];

const emptyVariants = () => SIZES.map((size) => ({ size, stock: 0 }));

const toFormState = (product) => ({
  name: product?.name || "",
  price: product?.price ?? "",
  description: product?.description || "",
  category: product?.category || "",
  newArrival: product?.newArrival || false,
  topSelling: product?.topSelling || false,
  images: product?.images || [],
  variants: SIZES.map((size) => {
    const existing = product?.variants?.find((v) => v.size === size);
    return { size, stock: existing?.stock ?? 0, sku: existing?.sku };
  }),
});

export default function ProductModal({ mode, initialData, onClose, onSaved }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(() => toFormState(initialData));
  const [imageInputs, setImageInputs] = useState([{ id: 1, url: "" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantStockChange = (index, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, stock: parseInt(value) || 0 } : variant,
      ),
    }));
  };

  const handleAddImageInput = () => {
    const newId = Math.max(...imageInputs.map((input) => input.id)) + 1;
    setImageInputs([...imageInputs, { id: newId, url: "" }]);
  };

  const handleRemoveImageInput = (id) => {
    if (imageInputs.length > 1) {
      setImageInputs(imageInputs.filter((input) => input.id !== id));
    }
  };

  const handleImageUrlChange = (id, value) => {
    setImageInputs(
      imageInputs.map((input) =>
        input.id === id ? { ...input, url: value } : input,
      ),
    );
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same file(s) later
    if (files.length === 0) return;

    const tooLarge = files.find((f) => f.size > MAX_IMAGE_MB * 1024 * 1024);
    if (tooLarge) {
      setError(`"${tooLarge.name}" is larger than ${MAX_IMAGE_MB}MB`);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setUploading(true);
      setError("");
      const res = await api.post("/admin/upload-images", formData);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...res.data.urls] }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload image(s)");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category) {
      setError("Please fill in name, price and category.");
      return;
    }

    const validUrls = imageInputs
      .map((input) => input.url.trim())
      .filter((url) => url !== "");
    const allImages = [...form.images, ...validUrls];

    if (allImages.length === 0) {
      setError("Please add at least one product image.");
      return;
    }

    const mappedVariants = form.variants.map((variant) => ({
      size: variant.size,
      sku:
        variant.sku ||
        `${form.name.substring(0, 3).toUpperCase()}-${variant.size}-${Date.now()}`,
      stock: Number(variant.stock) || 0,
    }));

    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      category: form.category,
      newArrival: form.newArrival,
      topSelling: form.topSelling,
      images: allImages,
      variants: mappedVariants,
    };

    try {
      setSaving(true);
      let saved;
      if (isEdit) {
        const res = await api.patch(`/product/${initialData._id}`, payload);
        saved = res.data.product;
      } else {
        const res = await api.post("/product", payload);
        saved = res.data.product;
      }
      onSaved(saved);
    } catch (err) {
      setError(
        err.response?.data?.error || `Failed to ${isEdit ? "update" : "add"} product`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              {isEdit ? (
                <Pencil className="w-5 h-5 text-white" />
              ) : (
                <Plus className="w-5 h-5 text-white" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
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
                value={form.price}
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
                value={form.category}
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
              value={form.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Modern slim fit chinos in versatile neutral color..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Stock by Size *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {form.variants.map((variant, index) => (
                <div key={variant.size}>
                  <label className="block text-xs text-gray-600 mb-1">
                    {variant.size}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => handleVariantStockChange(index, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Total stock:{" "}
              {form.variants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0)}{" "}
              units
            </p>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="newArrival"
                checked={form.newArrival}
                onChange={handleInputChange}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm font-medium text-gray-700">New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="topSelling"
                checked={form.topSelling}
                onChange={handleInputChange}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm font-medium text-gray-700">Top Selling</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full mb-3 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ImagePlus className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload from your device"}
            </button>

            {form.images.length > 0 && (
              <div className="space-y-2 mb-3">
                {form.images.map((img, index) => (
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
                    <span className="flex-1 text-sm text-gray-600 truncate">{img}</span>
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

            <p className="text-xs text-gray-500 mb-2">Or paste an image URL</p>
            <div className="space-y-3 mb-3">
              {imageInputs.map((input) => (
                <div key={input.id} className="flex gap-2">
                  <input
                    type="url"
                    value={input.url}
                    onChange={(e) => handleImageUrlChange(input.id, e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  {imageInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageInput(input.id)}
                      className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      aria-label="Remove image input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddImageInput}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add More
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isEdit ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
