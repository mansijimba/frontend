import { ShoppingCart, Heart, Menu, User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo/yarn (1).png";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../auth/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import CartDrawer from "../pages/cart";

export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const profileRoute =
    user?.role === "seller"
      ? "/dashboard"
      : user?.role === "buyer"
      ? "/profile"
      : "/";

  const [categories, setCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/category");
        setCategories(res.data.data || []);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <header className="border-b bg-[#FFFDF5]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} className="w-10 h-10" alt="Logo" />
            <span className="font-italianno text-3xl text-amber-900">
              Loops and Stitches
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-amber-900 hover:text-amber-600">
              Home
            </Link>

            <div className="relative group">
              <span className="flex items-center gap-1 cursor-pointer text-amber-900 hover:text-amber-600">
                Products <ChevronDown className="w-4 h-4" />
              </span>

              <div className="absolute top-full bg-white shadow rounded opacity-0 invisible group-hover:visible group-hover:opacity-100">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/newArrival/${cat.name}`}
                      className="block px-4 py-2 text-amber-900 hover:bg-amber-100"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500">No categories</p>
                )}
              </div>
            </div>

            {/* Deals link */}
            <Link to="/deals" className="text-amber-900 hover:text-amber-600">
              Deals
            </Link>
          </nav>

          {/* Icons + Auth */}
          <div className="flex items-center gap-6">
            <ShoppingCart
              className="w-5 h-5 text-amber-900 cursor-pointer"
              onClick={() => {
                if (!token) {
                  toast.error("Please login to view cart");
                  return;
                }
                setIsCartOpen(true);
              }}
            />

            <Heart
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() => navigate("/wishlist")}
            />

            {user ? (
              <Link to={profileRoute}>
                <User className="w-5 h-5 text-amber-900" />
              </Link>
            ) : (
              <>
                <Link
                  to="/role"
                  className="text-amber-900 hover:text-amber-600"
                >
                  REGISTER
                </Link>
                <span className="text-amber-700">/</span>
                <Link
                  to="/login"
                  className="text-amber-900 hover:text-amber-600"
                >
                  LOGIN
                </Link>
              </>
            )}

            <Menu className="md:hidden w-5 h-5 text-amber-900 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
