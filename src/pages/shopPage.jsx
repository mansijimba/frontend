import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MainLayout from "../layout/MainLayout";
import { ArrowLeft } from "lucide-react";

export default function ShopPage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sellerName, setSellerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5050/api/userproduct/products-by-seller/${sellerId}`
        );

        const fetchedProducts = res.data.products || [];
        setProducts(fetchedProducts);

        if (fetchedProducts.length > 0) {
          setSellerName(fetchedProducts[0].sellerId.fullName);
        }
      } catch (err) {
        toast.error("Failed to fetch seller products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-neutral-400 text-lg">
          Curating beautiful pieces…
        </div>
      </MainLayout>
    );
  }

  if (products.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center text-neutral-500">
          <p className="text-lg mb-3">This shop is just getting started ✨</p>
          <button
            onClick={() => navigate(-1)}
            className="text-amber-700 hover:text-amber-900"
          >
            Go back
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Background */}
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#fdf2f8,_#ffffff)] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="relative mb-20 text-center">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full border border-amber-200 hover:bg-amber-100 transition"
            >
              <ArrowLeft className="text-amber-800" />
            </button>

            <h1 className="text-4xl md:text-5xl font-serif font-light bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-700">
              {sellerName}'s Shop
            </h1>

            <p className="mt-4 text-amber-700 italic">
              Thoughtfully handcrafted • One stitch at a time
            </p>

            <div className="mt-6 w-24 h-[2px] bg-amber-300 mx-auto rounded-full" />
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
            {products.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="group cursor-pointer bg-white/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-500"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={`http://localhost:5050/uploads/${p.image}`}
                    alt={p.name}
                    className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition" />
                </div>

                {/* Content */}
                <div className="p-5 text-center">
                  <h3 className="text-amber-900 font-medium text-sm mb-2 leading-snug">
                    {p.name}
                  </h3>
                  <p className="text-amber-800 font-semibold text-lg">
                    Rs. {p.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
