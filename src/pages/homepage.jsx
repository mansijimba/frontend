import { Search, ShoppingCart, Heart } from "lucide-react";
import Slider from "react-slick";

import heroImg1 from "../assets/images/deco1.jpg";
import heroImg2 from "../assets/images/pillow1.jpg";
import heroImg3 from "../assets/images/sweater1.jpg";

import card1Img from "../assets/images/beanie.png";
import card2Img from "../assets/images/cherryscarf.png";
import card3Img from "../assets/images/heartscarf.png";
import exclusiveImg from "../assets/images/smallgirl.png";

// Import Slick CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const heroImages = [heroImg1, heroImg2, heroImg3];

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

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center gap-8">
        {/* Left: Hero Slider */}
        <div className="md:w-1/2 w-full h-96 md:h-[500px] relative">
          <Slider {...sliderSettings}>
            {heroImages.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-96 md:h-[500px] object-cover rounded-lg shadow-lg"
                />
              </div>
            ))}
          </Slider>

          {/* Search Bar overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md">
            <div className="flex items-center gap-2 bg-white/95 rounded-lg px-4 py-3 shadow-lg">
              <Search className="w-5 h-5 text-amber-600" />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right: Gift Message */}
        <div className="md:w-1/2 w-full flex flex-col justify-center text-center md:text-left gap-4">
          <h1 className="text-4xl md:text-5xl font-serif text-amber-900">
            The Perfect Gift for Someone Special
          </h1>
          <p className="text-amber-800 text-lg md:text-xl leading-relaxed">
            Celebrate moments of joy with handcrafted items full of love and
            care. Every stitch tells a story, making your gift unforgettable.
          </p>
          <button className="bg-amber-300 text-amber-900 hover:bg-amber-400 px-6 py-3 rounded w-fit transition">
            Shop Now
          </button>
        </div>
      </section>

      <p className="font-serif text-2xl md:text-3xl text-amber-900 text-center mt-4 md:mt-6">
        Crafted with Love, Stitched with Joy.
      </p>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-2 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-3xl font-serif bg-gradient-to-r from-yellow-500 to-amber-700 bg-clip-text text-transparent">
            New Arrivals
          </h2>
          <a
            href="#"
            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            View More →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[card1Img, card2Img, card3Img].map((img, index) => {
            const names = ["Beanies", "Cherry Scarf", "Heart Scarf"];
            const prices = [1400, 1750, 2000];
            return (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden transition hover:shadow-lg"
              >
                <div className="relative w-full rounded-t-lg shadow-md">
                  <img
                    src={img}
                    alt={names[index]}
                    className="w-full rounded-t-lg"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:shadow-lg transition">
                    <Heart className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    {names[index]}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-amber-700">
                      Rs. {prices[index]}
                    </span>
                    <button className="p-1 hover:bg-amber-50 rounded transition">
                      <ShoppingCart className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                  <button className="w-full bg-amber-300 text-amber-900 hover:bg-amber-400 px-4 py-2 rounded">
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exclusive Offer */}
      <section className="w-full px-4 py-12 md:py-6">
        <div
          className="rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"
          style={{ backgroundColor: "#FBF2CD" }}
        >
          {/* Image */}
          <div className="w-full md:w-1/2 h-80 md:h-[550px]  relative md:-right-20">
            <img
              src={exclusiveImg}
              alt="Exclusive offer"
              className="w-300 h-200 object-cover rounded-r-xl"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center space-y-5">
            <h2 className="text-4xl md:text-6xl font-serif text-amber-900">
              Exclusive Offer
            </h2>
            <p className="text-amber-800 text-lg md:text-xl leading-relaxed">
              Discover premium fashion with our exclusive offer. Enjoy up to 40%
              off the latest designer designs. The perfect gift awaits for
              someone special!
            </p>
            <button className="bg-amber-300 text-amber-900 hover:bg-amber-400 px-6 py-3 rounded w-fit transition">
              Buy Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
}