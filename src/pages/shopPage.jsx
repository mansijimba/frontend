import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MainLayout from "../layout/MainLayout";

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
        setProducts(res.data.products || []);
        if (res.data.products.length > 0) {
          setSellerName(res.data.products[0].sellerId.fullName);
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
        <div className="min-h-screen flex items-center justify-center text-neutral-500 text-lg">
          Loading products…
        </div>
      </MainLayout>
    );
  }

  if (products.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-neutral-500 text-lg">
          No products found for this seller
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-12 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-amber-900 mb-8">
          {sellerName}'s Shop
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:scale-105"
            >
              <img
                src={`http://localhost:5050/uploads/${p.image}`}
                alt={p.name}
                className="w-full h-44 object-cover rounded-t-2xl"
              />
              <div className="p-3">
                <h3 className="text-amber-900 font-semibold truncate">{p.name}</h3>
                <span className="text-amber-700 font-bold">Rs. {p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
