import { useEffect, useState } from "react";
import { Search, ShoppingCart, Heart } from "lucide-react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import heroImg1 from "../assets/images/deco1.jpg";
import heroImg2 from "../assets/images/pillow1.jpg";
import heroImg3 from "../assets/images/sweater1.jpg";
import exclusiveImg from "../assets/images/smallgirl.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const navigate = useNavigate();
  const heroImages = [heroImg1, heroImg2, heroImg3];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔹 Navigate to product details
  const goToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
  };

  // 🔹 Fetch new arrivals
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/api/userproduct/new-arrivals"
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Add to wishlist
  const handleAddToWishlist = async (productId) => {
    if (!token) {
      toast.error("Please login to use wishlist");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5050/api/wishlist/add",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to wishlist ❤️");
    } catch {
      toast.error("Failed to add to wishlist");
    }
  };

  // 🔹 Add to cart
  const handleAddToCart = async (productId) => {
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

  const displayedProducts = products.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 relative">
          <Slider {...sliderSettings}>
            {heroImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="hero"
                className="w-full h-[450px] object-cover rounded-lg"
              />
            ))}
          </Slider>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center gap-4">
          <h1 className="text-5xl font-serif text-amber-900">
            The Perfect Gift for Someone Special
          </h1>
          <p className="text-amber-800 text-lg">
            Every stitch tells a story, making your gift unforgettable.
          </p>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between mb-8">
          <h2 className="text-3xl font-serif text-amber-900">
            New Arrivals
          </h2>
          <button
            onClick={() => navigate("/newArrival")}
            className="text-amber-600"
          >
            View More →
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                {/* Image → Product Details */}
                <div className="relative">
                  <img
                    src={`http://localhost:5050/uploads/${product.image}`}
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-t-lg cursor-pointer"
                    onClick={() => goToProductDetails(product._id)}
                  />

                  {/* Wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product._id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  {/* Product Name → Product Details */}
                  <h3
                    onClick={() => goToProductDetails(product._id)}
                    className="font-semibold text-amber-900 cursor-pointer hover:underline"
                  >
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-amber-700">
                      Rs. {product.price}
                    </span>

                    {/* Cart */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                      className="p-2 hover:bg-amber-50 rounded"
                    >
                      <ShoppingCart className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>

                  {/* Buy Now → Product Details */}
                  <button
                    onClick={() => goToProductDetails(product._id)}
                    className="w-full mt-3 bg-amber-300 hover:bg-amber-400 text-amber-900 py-2 rounded"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Exclusive Offer */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto flex bg-[#FBF2CD] rounded-xl overflow-hidden">
          <img
            src={exclusiveImg}
            alt="offer"
            className="w-1/2 object-cover"
          />
          <div className="p-10">
            <h2 className="text-5xl font-serif text-amber-900">
              Exclusive Offer
            </h2>
            <p className="text-amber-800 mt-4">
              Enjoy up to 40% off our handmade collection.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
