import { useEffect, useState } from "react";
import { Package } from "lucide-react";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/orders/seller", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-8">
      <h1 className="text-3xl font-serif text-amber-800 mb-8 flex items-center gap-2">
        <Package /> My Orders
      </h1>

      {loading && <p>Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500">No orders received yet.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium">{order.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <p className="font-medium uppercase">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="bg-amber-50 p-3 rounded-xl">{order.address}</p>
            </div>

            <div className="border-t pt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img
                    src={`http://localhost:5050/uploads/${item.productId.image}`}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.productId.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-amber-800">
                    Rs. {item.productId.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-right text-sm text-gray-400 mt-4">
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
