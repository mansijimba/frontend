import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import MainLayout from "../layout/MainLayout";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/product/${productId}`);
        setProduct(res.data.product);
      } catch (err) {
        toast.error("Failed to fetch product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch recommended products
  useEffect(() => {
    if (!product || !product.categoryId) return;
    const fetchRecommended = async () => {
      try {
        const categoryName = product.categoryId.name;
        if (!categoryName) return;
        const res = await axios.get(
          `http://localhost:5050/api/userproduct/products?categoryName=${encodeURIComponent(categoryName)}`
        );
        const recs = (res.data.products || []).filter(p => p._id !== product._id);
        setRecommended(recs);
      } catch (err) {
        console.error("Failed to fetch recommended products:", err);
      }
    };
    fetchRecommended();
  }, [product]);

  // Add product to cart
  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5050/api/cart",
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${product.name} added to cart!`);
      console.log("Cart updated:", res.data);
    } catch (err) {
      toast.error("Failed to add product to cart");
      console.error(err);
    }
  };

  // Buy now
  const handleBuyNow = () => {
    navigate("/checkout", { state: { product, quantity } });
  };

  if (loading) return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center text-neutral-500 text-lg">
        Loading product…
      </div>
    </MainLayout>
  );

  if (!product) return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center text-neutral-500 text-lg">
        Product not found
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#FAF8F5] py-12 px-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-900 mb-10 font-medium hover:text-amber-700 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-14 md:gap-20">
          {/* Left: Product Image */}
          <div className="md:w-1/2 w-full relative group">
            <div className="overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 group-hover:scale-105">
              <img
                src={`http://localhost:5050/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-[550px] md:h-[600px] object-cover"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="md:w-1/2 w-full flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              {product.name}
            </h1>

            <p className="text-amber-800 text-lg md:text-xl leading-relaxed mt-2">
              {product.description}
            </p>

            <div className="flex items-center gap-6 mt-3">
              <span className="text-3xl font-bold text-amber-700">
                Rs. {product.price}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full font-medium
                ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-5">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-amber-700 font-bold hover:bg-amber-100 transition"
                >
                  -
                </button>
                <span className="px-6 py-2 bg-white text-neutral-700 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-amber-700 font-bold hover:bg-amber-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-amber-300 text-amber-900 px-6 py-3 rounded-2xl font-semibold hover:bg-amber-400 shadow-xl transition-transform transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:from-amber-600 hover:to-orange-600 transition-transform transform hover:scale-105"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommended.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-serif text-amber-900 mb-8 border-b-2 border-amber-300 pb-2">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommended.map(p => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
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
        )}
      </div>
    </MainLayout>
  );
}
