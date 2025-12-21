import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import MainLayout from "../layout/MainLayout";

export default function NewArrival() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const token = localStorage.getItem("token");

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = categoryName
          ? `http://localhost:5050/api/userproduct/products?categoryName=${categoryName}`
          : `http://localhost:5050/api/userproduct/new-arrivals`;

        const res = await axios.get(url);
        setProducts(res.data.products || []);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // 🔹 Fetch wishlist
  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data.products.map((p) => p._id));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    };

    fetchWishlist();
  }, [token]);

  // 🔹 Add to wishlist
  const addToWishlist = async (productId) => {
    if (!token) {
      toast.error("Please login to use wishlist");
      return;
    }

    if (wishlist.includes(productId)) {
      toast.info("Already in wishlist");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5050/api/wishlist/add",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlist([...wishlist, productId]);
      toast.success("Added to wishlist ❤️");
    } catch (err) {
      toast.error("Failed to add to wishlist");
    }
  };

  // 🔹 Add to cart
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
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">
        Loading products…
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

            <div>
              <h1 className="text-4xl font-serif text-amber-900">
                {categoryName || "New Arrivals"}
              </h1>
              <div className="w-20 h-[2px] bg-amber-400 mt-3 rounded-full" />
            </div>
          </div>

          <p className="text-sm text-neutral-600 max-w-xl mb-16">
            Discover thoughtfully handmade pieces, crafted with warmth, care,
            and timeless charm.
          </p>

          {/* Products */}
          {products.length === 0 ? (
            <p className="text-center text-neutral-500 mt-20">
              No products available
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="bg-white rounded-lg overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={`http://localhost:5050/uploads/${product.image}`}
                      alt={product.name}
                      className="w-full h-80 object-cover"
                    />

                    {/* Wishlist */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToWishlist(product._id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(product._id)
                            ? "fill-red-500 text-red-500"
                            : "text-red-500"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-amber-900 mb-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-amber-700">
                        Rs. {product.price}
                      </span>

                      {/* Cart Icon */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product._id);
                        }}
                        className="p-2 hover:bg-amber-50 rounded transition"
                      >
                        <ShoppingCart className="w-4 h-4 text-amber-600" />
                      </button>
                    </div>

                    <button className="w-full bg-gradient-to-r from-amber-300 to-amber-400 text-amber-900 py-2 rounded hover:from-amber-400 hover:to-amber-500 transition">
                      Buy Now
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
