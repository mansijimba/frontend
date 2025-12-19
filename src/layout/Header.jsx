// import { ShoppingCart, Heart, Search, Menu } from "lucide-react";
// import { Link } from "react-router-dom";
// import logo from "../assets/logo/yarn (1).png";

// export default function Header() {
//   return (
//     <header className="border-b border-amber-100">
//       <div className="max-w-7xl mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
          
//           {/* Logo */}
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 flex items-center justify-center">
//               <img
//                 src={logo}
//                 alt="Loops & Stitches Logo"
//                 className="w-full h-full object-contain"
//               />
//             </div>
//             <span className="font-italianno text-amber-900 text-3xl">
//               Loops and Stitches
//             </span>
//           </div>

//           {/* Navigation */}
//           <nav className="hidden md:flex items-center gap-8">
//             <Link to="/" className="text-sm text-amber-900 hover:text-amber-600">Home</Link>
//             <Link className="text-sm text-amber-900 hover:text-amber-600">Deals</Link>
//             <Link className="text-sm text-amber-900 hover:text-amber-600">New Arrivals</Link>
//             <Link className="text-sm text-amber-900 hover:text-amber-600">About Us</Link>
//           </nav>

//           {/* Icons + Register/Login */}
//           <div className="flex items-center gap-6">
//             <ShoppingCart className="w-5 h-5 text-amber-900 cursor-pointer" />
//             <Heart className="w-5 h-5 text-red-500 cursor-pointer" />

//             {/* REGISTER / LOGIN Links */}
//             <div className="flex items-center gap-2">
//               <Link 
//                 to="/role" 
//                 className="text-sm font-medium text-amber-900 hover:text-amber-600"
//               >
//                 REGISTER
//               </Link>

//               <span className="text-amber-700">/</span>

//               <Link 
//                 to="/login" 
//                 className="text-sm font-medium text-amber-900 hover:text-amber-600"
//               >
//                 LOGIN
//               </Link>
//             </div>

//             <Menu className="md:hidden w-5 h-5 text-amber-900 cursor-pointer" />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
import { ShoppingCart, Heart, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo/yarn (1).png";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

export default function Header() {
  const { user } = useContext(AuthContext);

  // ✅ Decide profile route based on role
  const profileRoute =
    user?.role === "seller"
      ? "/dashboard"
      : user?.role === "buyer"
      ? "/profile"
      : "/";

  return (
    <header
      className="border-b border-amber-100"
      style={{ backgroundColor: "#FFFDF5" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="Loops & Stitches Logo"
                className="w-full h-full object-contain"
              />
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
            <Link className="text-sm text-amber-900 hover:text-amber-600">
              New Arrivals
            </Link>
            <Link className="text-sm text-amber-900 hover:text-amber-600">
              About Us
            </Link>
          </nav>

          {/* Icons + Auth */}
          <div className="flex items-center gap-6">
            <ShoppingCart className="w-5 h-5 text-amber-900 cursor-pointer" />
            <Heart className="w-5 h-5 text-red-500 cursor-pointer" />

            {/* User / Auth Links */}
            <div className="flex items-center gap-2">
              {user ? (
                <Link
                  to={profileRoute}
                  className="text-amber-900 hover:text-amber-600"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/role"
                    className="text-sm font-medium text-amber-900 hover:text-amber-600"
                  >
                    REGISTER
                  </Link>

                  <span className="text-amber-700">/</span>

                  <Link
                    to="/login"
                    className="text-sm font-medium text-amber-900 hover:text-amber-600"
                  >
                    LOGIN
                  </Link>
                </>
              )}
            </div>

            <Menu className="md:hidden w-5 h-5 text-amber-900 cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
}
