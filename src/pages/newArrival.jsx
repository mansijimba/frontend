import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import MainLayout from "../layout/MainLayout";

export default function NewArrival() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <h1 className="text-4xl font-serif text-amber-900 tracking-wide">
                {categoryName || "New Arrivals"}
              </h1>

              <div className="w-20 h-[2px] bg-amber-400 mt-3 rounded-full" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-neutral-600 max-w-xl mb-16">
            Discover thoughtfully handmade pieces, crafted with warmth, care, and timeless charm.
          </p>

          {/* Products */}
          {products.length === 0 ? (
            <p className="text-center text-neutral-500 mt-20">
              No products available
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg overflow-hidden
                             transition-all duration-300
                             hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={`http://localhost:5050/uploads/${product.image}`}
                      alt={product.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />

                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-105 transition">
                      <Heart className="w-4 h-4 text-red-500" />
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

                      <button className="p-1 hover:bg-amber-50 rounded transition">
                        <ShoppingCart className="w-4 h-4 text-amber-600" />
                      </button>
                    </div>

                    <button className="w-full bg-gradient-to-r from-amber-300 to-amber-400
                                       text-amber-900 py-2 rounded
                                       hover:from-amber-400 hover:to-amber-500 transition">
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
