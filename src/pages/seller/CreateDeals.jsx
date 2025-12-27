import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateDeals() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discount, setDiscount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/api/product/seller/products",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data.products || []);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, [token]);

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !discount || !startDate || !endDate) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5050/api/deals/create",
        {
          productId: selectedProduct._id,
          discountPercentage: discount,
          startDate,
          endDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Deal created successfully!");
      // Reset form
      setSelectedProduct(null);
      setDiscount("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create deal");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-start justify-center py-16 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl w-full">
        <h2 className="text-3xl font-serif text-amber-900 mb-8 text-center">
          Create New Deal
        </h2>

        <form onSubmit={handleCreateDeal} className="flex flex-col gap-6">
          {/* Product Selection */}
          <div className="border rounded-xl p-3 max-h-64 overflow-y-auto shadow-inner">
            {products.map((p) => (
              <div
                key={p._id}
                onClick={() => setSelectedProduct(p)}
                className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  selectedProduct?._id === p._id
                    ? "bg-amber-100 shadow-inner border-2 border-amber-300"
                    : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={`http://localhost:5050/uploads/${p.image}`}
                  alt={p.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-gray-600 text-sm">Rs. {p.price}</p>
                </div>
              </div>
            ))}
            {!products.length && (
              <p className="text-gray-400 text-center mt-4">No products available</p>
            )}
          </div>

          {/* Discount */}
          <input
            type="number"
            placeholder="Discount %"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-amber-300 outline-none shadow-sm"
          />

          {/* Start Date */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-amber-300 outline-none shadow-sm"
          />

          {/* End Date */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-amber-300 outline-none shadow-sm"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all"
          >
            Create Deal
          </button>
        </form>

        {/* Selected Product Preview */}
        {selectedProduct && (
          <div className="mt-8 p-4 border rounded-2xl flex items-center gap-4 bg-amber-50 shadow-md">
            <img
              src={`http://localhost:5050/uploads/${selectedProduct.image}`}
              alt={selectedProduct.name}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <div>
              <p className="font-semibold text-gray-800 text-lg">
                {selectedProduct.name}
              </p>
              <p className="text-gray-600 text-sm">Price: Rs. {selectedProduct.price}</p>
              <p className="text-gray-600 text-sm">Stock: {selectedProduct.stock}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
