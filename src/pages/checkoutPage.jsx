import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../layout/MainLayout";
import { Pencil, Wallet, Truck } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch cart + user profile
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCheckoutData = async () => {
      try {
        const [cartRes, profileRes] = await Promise.all([
          axios.get("http://localhost:5050/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5050/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCart(cartRes.data);
        setAddress(profileRes.data.address || ""); // ✅ FIXED
      } catch (error) {
        console.error(error);
        toast.error("Failed to load checkout details");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [token, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading checkout…
        </div>
      </MainLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Your cart is empty
        </div>
      </MainLayout>
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    if (paymentMethod === "esewa") {
      toast.info("Redirecting to eSewa...");
    } else {
      toast.success("Order placed successfully!");
    }

    navigate("/");
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FFF8F0] py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ================= ORDER SUMMARY ================= */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-serif font-light bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-700 mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4"
                >
                  <img
                    src={`http://localhost:5050/uploads/${item.product.image}`}
                    className="w-20 h-20 rounded-xl object-cover"
                    alt={item.product.name}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-amber-900">
                    Rs. {item.product.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-amber-900">Rs. {totalPrice}</span>
            </div>
          </div>

          {/* ================= ADDRESS & PAYMENT ================= */}
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-8">

            {/* Address */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-serif font-light text-amber-800">
                  Delivery Address
                </h3>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-amber-600 hover:text-amber-800"
                >
                  <Pencil size={18} />
                </button>
              </div>

              {isEditingAddress ? (
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              ) : (
                <p className="text-gray-700 bg-amber-50 p-3 rounded-xl">
                  {address || "No address provided"}
                </p>
              )}
            </div>

            {/* Payment */}
            <div>
              <h3 className="text-xl font-serif font-light text-amber-800 mb-4">
                Payment Method
              </h3>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod("esewa")}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "esewa"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200"
                  }`}
                >
                  <Wallet className="text-green-600" />
                  <span className="font-medium">eSewa</span>
                </div>

                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200"
                  }`}
                >
                  <Truck className="text-amber-700" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-xl font-medium shadow-lg transition-all"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
