import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Phone, MapPin, Mail } from "lucide-react";

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // ================= FETCH SELLER PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });

        setLoading(false);
      } catch (err) {
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= UPDATE PROFILE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5050/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500">Loading profile...</div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="bg-amber-600 text-white rounded-xl p-6 flex items-center gap-6 shadow">
        <div className="w-20 h-20 rounded-full bg-white text-amber-600 flex items-center justify-center text-3xl font-bold">
          {formData.fullName?.charAt(0) || "S"}
        </div>

        <div>
          <h2 className="text-2xl font-serif">
            {formData.fullName || "Seller Profile"}
          </h2>
          <span className="inline-block mt-1 text-sm bg-white text-amber-600 px-3 py-1 rounded-full">
            Seller
          </span>
        </div>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="bg-white mt-6 p-8 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-6 text-gray-700">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* FULL NAME */}
          <InputField
            label="Full Name"
            icon={<User size={18} />}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          {/* EMAIL */}
          <InputField
            label="Email Address"
            icon={<Mail size={18} />}
            value={formData.email}
            disabled
          />

          {/* PHONE */}
          <InputField
            label="Phone Number"
            icon={<Phone size={18} />}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />

          {/* ADDRESS */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">
              Address
            </label>
            <div className="flex items-start gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-amber-400">
              <MapPin className="text-gray-400 mt-1" size={18} />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full outline-none resize-none"
                rows="3"
                required
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-600 text-white px-8 py-2 rounded-full hover:bg-amber-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= INPUT FIELD COMPONENT ================= */
const InputField = ({
  label,
  icon,
  name,
  value,
  onChange,
  placeholder,
  disabled,
}) => (
  <div>
    <label className="block text-sm mb-1 text-gray-600">{label}</label>
    <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-amber-400">
      <span className="text-gray-400">{icon}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full outline-none ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
    </div>
  </div>
);
