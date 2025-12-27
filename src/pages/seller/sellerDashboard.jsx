import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Box, User, ShoppingCart, LogOut, Tag } from "lucide-react"; // added Tag for Deals
import { AuthContext } from "../../auth/AuthProvider";

import AddProduct from "../seller/AddProduct";
import SellerProducts from "../seller/sellerProduct";
import EditProduct from "../seller/editProduct";
import CreateDeals from "../seller/CreateDeals";

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("addProduct");
  const [editingProductId, setEditingProductId] = useState(null); // Track product being edited
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Go back to My Products tab
  const goBackToProducts = () => {
    setEditingProductId(null);
    setActiveTab("myProducts");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-amber-200 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-serif mb-6">Seller Dashboard</h1>
          <nav className="space-y-3">
            <SidebarBtn
              label="Add Product"
              icon={<Package />}
              onClick={() => setActiveTab("addProduct")}
            />
            <SidebarBtn
              label="My Products"
              icon={<Box />}
              onClick={() => setActiveTab("myProducts")}
            />
            <SidebarBtn
              label="Deals"
              icon={<Tag />}
              onClick={() => setActiveTab("deals")}
            />
            <SidebarBtn label="Profile" icon={<User />} />
            <SidebarBtn label="Orders" icon={<ShoppingCart />} />
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

      {/* Content */}
      <main className="flex-1 p-8 bg-stone-50">
        {activeTab === "addProduct" && <AddProduct />}
        {activeTab === "myProducts" && (
          <SellerProducts
            onEdit={(productId) => {
              setEditingProductId(productId);
              setActiveTab("editProduct");
            }}
          />
        )}
        {activeTab === "editProduct" && editingProductId && (
          <EditProduct
            productId={editingProductId}
            goBack={goBackToProducts}
          />
        )}
        {activeTab === "deals" && <CreateDeals />}
      </main>
    </div>
  );
}

const SidebarBtn = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 p-2 rounded hover:bg-amber-200 w-full text-left"
  >
    {icon}
    {label}
  </button>
);
