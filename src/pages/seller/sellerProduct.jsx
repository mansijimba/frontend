import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../auth/AuthProvider";
import { toast } from "react-toastify";

export default function SellerProducts({ onEdit }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/api/product/seller/products",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data.products);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProducts();
  }, [token]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!products.length) return <p className="text-center">No products found</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div
          key={p._id}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
        >
          <img
            src={`http://localhost:5050/uploads/${p.image}`}
            alt={p.name}
            className="h-80 w-full object-cover rounded-lg"
          />
          <h3 className="font-semibold mt-3 text-lg">{p.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>

          <div className="flex justify-between items-center mt-2">
            <p className="font-bold text-amber-700">Rs. {p.price}</p>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
              Stock: {p.stock}
            </span>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onEdit(p._id)} // Use callback instead of navigate
              className="flex-1 bg-amber-400 hover:bg-amber-500 text-amber-900 text-sm font-semibold py-2 rounded-lg transition"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
