import { useContext, useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { AuthContext } from "../auth/AuthProvider";
import { Edit, Save, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BuyerProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5050/api/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setEditable(false);
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-700">
            You need to log in to view your profile.
          </p>
        </div>
      </MainLayout>
    );
  }

  // Only buyers can view this page
  if (user.role !== "buyer") {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-700">
            This page is only for buyers.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif text-[#675715]">My Profile</h1>
            <button
              onClick={() => setEditable(!editable)}
              className="flex items-center gap-1 text-amber-700 hover:text-amber-900"
            >
              <Edit className="w-5 h-5" />
              {editable ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editable}
                className={`w-full p-2 border rounded ${
                  editable ? "border-gray-400" : "border-gray-200 bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full p-2 border border-gray-200 bg-gray-100 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editable}
                className={`w-full p-2 border rounded ${
                  editable ? "border-gray-400" : "border-gray-200 bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editable}
                className={`w-full p-2 border rounded ${
                  editable ? "border-gray-400" : "border-gray-200 bg-gray-100"
                }`}
              />
            </div>
          </div>

          {editable && (
            <button
              onClick={handleSave}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-amber-300 py-2 rounded hover:bg-amber-400 transition"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-red-300 py-2 rounded hover:bg-red-400 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
      <ToastContainer />
    </MainLayout>
  );
}
