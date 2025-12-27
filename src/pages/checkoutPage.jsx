import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../layout/MainLayout";
import { Pencil, Wallet, Truck, X } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dealProduct = location.state?.product; // Product passed from Buy Now
  const dealDiscount = location.state?.discount || 0; // Discount %

  const [cartItems, setCartItems] = useState(
    dealProduct ? [{ product: dealProduct, quantity: 1 }] : []
  );
  const [address, setAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    // Fetch user profile to prefill address
    const fetchUserAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5050/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAddress(data.address || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load address");
      }
    };

    fetchUserAddress();
  }, [navigate]);

  if (!dealProduct) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          No product selected for checkout
        </div>
      </MainLayout>
    );
  }

  const handleQuantityChange = (newQty, maxStock) => {
    if (newQty < 1) return;
    if (newQty > maxStock) {
      toast.warn(`Only ${maxStock} items available`);
      return;
    }
    setCartItems([{ ...cartItems[0], quantity: newQty }]);
  };

  const calculatePrice = (item) => {
    if (dealDiscount > 0) {
      return Math.round(item.product.price * (1 - dealDiscount / 100));
    }
    return item.product.price;
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + calculatePrice(item) * item.quantity,
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

    navigate("/"); // Go back to homepage
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FFF8F0] py-16 px-6 relative">
        {/* Close Checkout Button */}
        <button
          onClick={() => navigate("/")} // Close checkout
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500 bg-white rounded-full p-2 shadow"
        >
          <X size={24} />
        </button>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ================= ORDER SUMMARY ================= */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-serif font-light bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-700 mb-6">
              Order Summary
            </h2>

            {cartItems.map((item) => (
              <div key={item.product._id} className="flex items-center gap-4">
                <img
                  src={`http://localhost:5050/uploads/${item.product.image}`}
                  className="w-20 h-20 rounded-xl object-cover"
                  alt={item.product.name}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.product.name}</p>

                  {/* Quantity controls */}
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.quantity - 1,
                          item.product.stock
                        )
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      max={item.product.stock}
                      onChange={(e) =>
                        handleQuantityChange(
                          parseInt(e.target.value),
                          item.product.stock
                        )
                      }
                      className="w-12 text-center border rounded"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.quantity + 1,
                          item.product.stock
                        )
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    In stock: {item.product.stock}
                  </p>
                </div>

                <div className="text-right">
                  {dealDiscount > 0 ? (
                    <div>
                      <p className="text-sm line-through text-gray-400">
                        Rs. {item.product.price * item.quantity}
                      </p>
                      <p className="font-semibold text-amber-900">
                        Rs. {calculatePrice(item) * item.quantity}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold text-amber-900">
                      Rs. {item.product.price * item.quantity}
                    </p>
                  )}
                </div>
              </div>
            ))}

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
