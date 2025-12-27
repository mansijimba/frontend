import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function DealsSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/deals/active");
        setDeals(res.data.deals || []);
      } catch {
        toast.error("Failed to load deals");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const addToCart = async (productId) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5050/api/cart/add",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const buyNow = (deal) => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        product: deal.product,
        discount: deal.discountPercentage,
      },
    });
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-100 to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif text-amber-900 mb-3">
            🔥 Hot Deals & Offers
          </h1>
          <p className="text-gray-600">
            Limited-time discounts from trusted sellers
          </p>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-gray-500">Loading deals…</p>
        ) : deals.length === 0 ? (
          <p className="text-center text-gray-500">No active deals</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {deals.map((deal) => {
              const discountedPrice = Math.round(
                deal.product.price * (1 - deal.discountPercentage / 100)
              );

              return (
                <div
                  key={deal._id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={`http://localhost:5050/uploads/${deal.product.image}`}
                      alt={deal.product.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Deal Badge */}
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {deal.discountPercentage}% OFF
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-amber-900">
                      {deal.product.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-bold text-amber-700">
                        Rs. {discountedPrice}
                      </span>
                      <span className="text-sm line-through text-gray-400">
                        Rs. {deal.product.price}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-5">
                      <button
                        onClick={() => addToCart(deal.product._id)}
                        className="flex items-center gap-2 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg transition"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Cart
                      </button>

                      <button
                        onClick={() => buyNow(deal)}
                        className="text-sm bg-amber-400 hover:bg-amber-500 text-amber-900 px-5 py-2 rounded-lg font-semibold transition"
                      >
                        Buy Now
                      </button>
                    </div>

                    {/* Validity */}
                    <p className="text-xs text-gray-500 mt-4">
                      Valid till{" "}
                      {new Date(deal.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
