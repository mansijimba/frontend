import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../auth/AuthProvider";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";

export default function AddProduct() {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/category");
        setCategories(res.data.data); // IMPORTANT
      } catch (err) {
        console.error("Category fetch error:", err);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.post(
        "http://localhost:5050/api/product/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Product added successfully");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* TITLE */}
        <div>
          <h2 className="text-3xl font-serif text-amber-900">
            Add New Product
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill all details to list your product
          </p>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>

          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-amber-300 rounded-xl p-8 cursor-pointer hover:bg-amber-50 transition">
            <div className="w-14 h-14 rounded-full bg-amber-200 flex items-center justify-center shadow">
              <Upload className="w-6 h-6 text-amber-700" />
            </div>

            <p className="text-sm font-medium text-gray-700">
              {formData.image ? formData.image.name : "Click to upload image"}
            </p>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              required
            />
          </label>
        </div>

        {/* PRODUCT NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="e.g. Handmade Cotton Dress"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
            placeholder="Describe your product in detail"
            required
          />
        </div>

        {/* PRICE & STOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Rs)
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="1200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="10"
              required
            />
          </div>
        </div>

        {/* CATEGORY DROPDOWN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* SUBMIT */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold px-8 py-3 rounded-full shadow-md transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
