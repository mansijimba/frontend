import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../auth/AuthProvider";
import { toast } from "react-toastify";
import { FaTrash, FaTag } from "react-icons/fa";
import DeleteModal from "../../componenets/auth/deleteModal";

export default function SellerProducts({ onEdit }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProductsAndDeals = async () => {
    setLoading(true);
    try {
      const [productsRes, dealsRes] = await Promise.all([
        axios.get("http://localhost:5050/api/product/seller/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5050/api/deals/seller", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(productsRes.data.products || []);
      setDeals(dealsRes.data.deals || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products or deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProductsAndDeals();
  }, [token]);

  const openDeleteModal = (id) => {
    setSelectedProductId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5050/api/product/${selectedProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== selectedProductId));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleteOpen(false);
      setSelectedProductId(null);
    }
  };

  // Helper: Get active deal for a product (convert IDs to strings!)
  const getDealForProduct = (productId) => {
    const now = new Date();
    return deals.find((deal) => {
      if (!deal.product) return false;
      const dealProductId = deal.product._id?.toString() || deal.product.toString();
      return (
        dealProductId === productId.toString() &&
        deal.isActive &&
        new Date(deal.startDate) <= now &&
        new Date(deal.endDate) >= now
      );
    });
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!products.length) return <p className="text-center mt-6">No products found</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const activeDeal = getDealForProduct(p._id);
          const discountedPrice = activeDeal
            ? Math.round(p.price - (p.price * activeDeal.discountPercentage) / 100)
            : p.price;

          return (
            <div
              key={p._id}
              className={`relative p-4 rounded-xl shadow hover:shadow-lg transition ${
                activeDeal ? "border-2 border-green-400 bg-green-50" : "bg-white"
              }`}
            >
              {activeDeal && (
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs font-bold rounded">
                  {activeDeal.discountPercentage}% OFF
                </div>
              )}

              <button
                onClick={() => openDeleteModal(p._id)}
                className="absolute top-1 right-2 rounded-full border border-red-300 text-red-500 hover:text-red-700 transition"
              >
                <FaTrash size={16} />
              </button>

              <img
                src={`http://localhost:5050/uploads/${p.image}`}
                alt={p.name}
                className="h-80 w-full object-cover rounded-lg"
              />

              <h3 className="font-semibold mt-3 text-lg">{p.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>

              <div className="flex justify-between items-center mt-2">
                {activeDeal ? (
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 line-through">Rs. {p.price}</p>
                    <p className="font-bold text-green-700 text-lg">Rs. {discountedPrice}</p>
                  </div>
                ) : (
                  <p className="font-bold text-amber-700">Rs. {p.price}</p>
                )}
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                  Stock: {p.stock}
                </span>
              </div>

              {activeDeal && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 text-sm bg-green-200 text-green-800 px-2 py-1 rounded font-semibold">
                    <FaTag />
                    <span>{activeDeal.discountPercentage}% Off Deal</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Valid: {new Date(activeDeal.startDate).toLocaleDateString()} -{" "}
                    {new Date(activeDeal.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onEdit(p._id)}
                  className={`flex-1 ${
                    activeDeal
                      ? "bg-green-400 hover:bg-green-500 text-white"
                      : "bg-amber-400 hover:bg-amber-500 text-amber-900"
                  } text-sm font-semibold py-2 rounded-lg transition`}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  );
}
