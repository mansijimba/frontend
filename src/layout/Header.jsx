import { ShoppingCart, Heart, Menu, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo/yarn (1).png";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../auth/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";

export default function Header() {
  const { user } = useContext(AuthContext);

  const profileRoute =
    user?.role === "seller"
      ? "/dashboard"
      : user?.role === "buyer"
      ? "/profile"
      : "/";

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/category");
        setCategories(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="border-b border-amber-100 bg-[#FFFDF5]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-italianno text-amber-900 text-3xl">
            Loops and Stitches
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-amber-900 hover:text-amber-600">
            Home
          </Link>

          <Link className="text-sm text-amber-900 hover:text-amber-600">
            Deals
          </Link>

          <div className="relative group">
            <div className="flex items-center gap-1 text-sm font-medium text-amber-900 cursor-pointer hover:text-amber-600">
              New Arrivals
              <ChevronDown className="w-4 h-4" />
            </div>

            {/* Dropdown */}
            <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/newArrival/${cat.name}`}
                    className="block px-4 py-2 text-sm text-amber-900 hover:bg-amber-100"
                  >
                    {cat.name}
                  </Link>
                ))
              ) : (
                <p className="px-4 py-2 text-sm text-gray-500">
                  No categories
                </p>
              )}
            </div>
          </div>

          <Link className="text-sm text-amber-900 hover:text-amber-600">
            About Us
          </Link>
        </nav>

        {/* Icons + Auth */}
        <div className="flex items-center gap-6">
          <ShoppingCart className="w-5 h-5 text-amber-900 cursor-pointer" />
          <Heart className="w-5 h-5 text-red-500 cursor-pointer" />

          {user ? (
            <Link to={profileRoute}>
              <User className="w-5 h-5 text-amber-900" />
            </Link>
          ) : (
            <>
              <Link to="/role" className="text-sm text-amber-900 hover:text-amber-600">
                REGISTER
              </Link>
              <span className="text-amber-700">/</span>
              <Link to="/login" className="text-sm text-amber-900 hover:text-amber-600">
                LOGIN
              </Link>
            </>
          )}

          <Menu className="md:hidden w-5 h-5 text-amber-900 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
