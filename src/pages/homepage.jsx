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
          <h2 className="text-3xl font-serif text-amber-900">New Arrivals</h2>
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
      <section className="px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative flex flex-col md:flex-row items-center bg-gradient-to-r from-[#FBF2CD] via-[#FFF6DC] to-[#FDF7EA] rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
            {/* Image */}
            <div className="md:w-1/2 w-full h-[400px] overflow-hidden">
              <img
                src={exclusiveImg}
                alt="Exclusive handmade offer"
                className="w-96 h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Content */}
            <div className="md:w-1/2 w-full p-12 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-serif font-light bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-800">
                Exclusive Offer
              </h2>

              <p className="text-amber-800 mt-5 text-lg leading-relaxed">
                Discover thoughtfully handcrafted pieces made with love. Enjoy{" "}
                <span className="font-semibold">up to 40% off</span> on our
                limited handmade collection.
              </p>

              <button
                onClick={() => navigate("/shop")}
                className="mt-8 inline-flex items-center justify-center px-10 py-3 rounded-full
          bg-gradient-to-r from-amber-500 to-amber-600
          text-white font-medium tracking-wide
          shadow-lg hover:shadow-2xl hover:from-amber-600 hover:to-amber-700
          transition-all duration-300"
              >
                Buy Now
              </button>
            </div>

            {/* Soft decorative blur */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-300/30 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </>
  );
}
