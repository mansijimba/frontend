import { X, Plus, Minus, Trash2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch cart
  useEffect(() => {
    if (!isOpen || !token) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
      } catch {
        toast.error("Failed to load cart");
      }
    };

    fetchCart();
  }, [isOpen, token]);

  // Update quantity
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await axios.put(
        "http://localhost:5050/api/cart/quantity",
        { productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5050/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const totalPrice = cart
    ? cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full sm:w-96 bg-white h-full shadow-2xl p-6 animate-slide-in-right flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-semibold font-serif text-amber-900">Your Cart</h2>
          <X
            className="cursor-pointer w-6 h-6 text-gray-700 hover:text-red-500 transition-colors"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        {!cart || cart.items.length === 0 ? (
          <p className="text-sm text-gray-500 mt-10 text-center">Your cart is empty</p>
        ) : (
          <div className="flex-1 flex flex-col">

            {/* Horizontal slider */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="relative flex-shrink-0 w-64 p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${item.product._id}`)}
                >
                  {/* Delete Icon */}
                  <Trash2
                    className="absolute top-2 right-2 w-5 h-5 text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.product._id);
                    }}
                  />

                  {/* Product Image */}
                  <img
                    src={`http://localhost:5050/uploads/${item.product.image}`}
                    alt={item.product.name}
                    className="w-full h-40 object-cover rounded-lg border"
                  />

                  {/* Product Info */}
                  <div className="flex flex-col mt-3">
                    <p className="text-lg font-medium text-gray-800">{item.product.name}</p>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.product._id, item.quantity - 1);
                        }}
                        className="p-2 border rounded hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-md">{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.product._id, item.quantity + 1);
                        }}
                        className="p-2 border rounded hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-lg font-semibold text-amber-900 mt-2">
                      Rs. {item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & Secure Checkout */}
            <div className="mt-4 border-t pt-4 flex flex-col gap-3">
              <div className="flex justify-between text-xl font-semibold text-gray-800">
                <span>Total:</span>
                <span>Rs. {totalPrice}</span>
              </div>
              <button
                onClick={() => {
                  toast.success("Proceeding to secure checkout!");
                  navigate("/checkout");
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Secure Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
