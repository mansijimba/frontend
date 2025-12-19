import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../auth/AuthProvider";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

export default function EditProduct({ productId, goBack }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/product/${productId}`);
        const p = res.data.product;

        setFormData({
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          categoryId: p.categoryId?._id || "",
          image: null,
        });

        setPreview(`http://localhost:5050/uploads/${p.image}`);
      } catch {
        toast.error("Failed to load product");
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      await axios.put(
        `http://localhost:5050/api/product/${productId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product updated successfully");
      goBack(); // Go back to My Products tab
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-6 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Products
      </button>

      <h2 className="text-3xl font-serif mb-6 text-amber-900">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="Product name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
            placeholder="Describe your product"
            required
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Price (Rs)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              required
            />
          </div>
        </div>

        {/* Image Upload with Preview */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Product Image</label>
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-amber-300 rounded-xl p-6 cursor-pointer hover:bg-amber-50 transition">
            {preview && (
              <img src={preview} alt="Preview" className="h-40 object-contain" />
            )}
            <p className="text-sm font-medium text-gray-700">
              {formData.image ? formData.image.name : "Click to upload image"}
            </p>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-3 rounded-xl shadow-lg transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
