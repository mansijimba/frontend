import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Box,
  User,
  ShoppingCart,
  LogOut,
  Tag,
} from "lucide-react";
import { AuthContext } from "../../auth/AuthProvider";

// Seller pages
import AddProduct from "../seller/AddProduct";
import SellerProducts from "../seller/sellerProduct";
import EditProduct from "../seller/editProduct";
import CreateDeals from "../seller/CreateDeals";
import Orders from "../seller/sellerOrder";
import Profile from "../seller/sellerProfile";

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("addProduct");
  const [editingProductId, setEditingProductId] = useState(null);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goBackToProducts = () => {
    setEditingProductId(null);
    setActiveTab("myProducts");
  };

  // Mapping tab names to components
  const renderContent = () => {
    switch (activeTab) {
      case "addProduct":
        return <AddProduct />;
      case "myProducts":
        return (
          <SellerProducts
            onEdit={(productId) => {
              setEditingProductId(productId);
              setActiveTab("editProduct");
            }}
          />
        );
      case "editProduct":
        return editingProductId ? (
          <EditProduct productId={editingProductId} goBack={goBackToProducts} />
        ) : (
          <div>Please select a product to edit.</div>
        );
      case "deals":
        return <CreateDeals />;
      case "orders":
        return <Orders />;
      case "profile":
      return <Profile />;
      default:
        return <div>Page not found.</div>;
    }
  };

  console.log("Active tab:", activeTab); // Debugging active tab

  return (
    <div className="flex min-h-screen">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-amber-200 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-serif mb-6">Seller Dashboard</h1>

          <nav className="space-y-2">
            <SidebarBtn
              label="Add Product"
              icon={<Package />}
              active={activeTab === "addProduct"}
              onClick={() => setActiveTab("addProduct")}
            />

            <SidebarBtn
              label="My Products"
              icon={<Box />}
              active={activeTab === "myProducts"}
              onClick={() => setActiveTab("myProducts")}
            />

            <SidebarBtn
              label="Deals"
              icon={<Tag />}
              active={activeTab === "deals"}
              onClick={() => setActiveTab("deals")}
            />

            <SidebarBtn
              label="Orders"
              icon={<ShoppingCart />}
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />

            <SidebarBtn
              label="Profile"
              icon={<User />}
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-100 p-2 rounded"
        >
          <LogOut />
          Logout
        </button>
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-8 bg-stone-50">{renderContent()}</main>
    </div>
  );
}

/* ================= SIDEBAR BUTTON ================= */
const SidebarBtn = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 p-2 rounded w-full text-left transition ${
      active ? "bg-amber-300 font-semibold" : "hover:bg-amber-200"
    }`}
  >
    {icon}
    {label}
  </button>
);
