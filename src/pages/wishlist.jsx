import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShoppingCart, Heart, ArrowLeft, Trash2 } from "lucide-react";
import MainLayout from "../layout/MainLayout";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch wishlist products
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5050/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data.products || []);
      } catch (err) {
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:5050/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(wishlist.filter((p) => p._id !== productId));
      toast.info("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">
        Loading wishlist…
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-[#F3EFEA]">
        <div className="max-w-7xl mx-auto px-4 py-14">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full border border-amber-200 hover:bg-amber-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-amber-900" />
            </button>
            <h1 className="text-4xl font-serif text-amber-900 tracking-wide">My Wishlist</h1>
          </div>

          {wishlist.length === 0 ? (
            <p className="text-center text-neutral-500 mt-20">Your wishlist is empty</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in">
              {wishlist.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={`http://localhost:5050/uploads/${product.image}`}
                      alt={product.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="p-4">
                    <h3 className="font-semibold text-amber-900 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-amber-700">Rs. {product.price}</span>
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="p-1 hover:bg-amber-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <button className="w-full bg-gradient-to-r from-amber-300 to-amber-400 text-amber-900 py-2 rounded hover:from-amber-400 hover:to-amber-500 transition">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
