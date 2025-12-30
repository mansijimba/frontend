import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Heart, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import MainLayout from "../layout/MainLayout";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔹 Fetch products with filters
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5050/api/userproduct/products",
        {
          params: {
            categoryName: selectedCategory.toLowerCase(),
            minPrice,
            maxPrice,
            sort,
          },
        }
      );

      const data = res.data.products || [];
      setProducts(data);
      setFiltered(data);

      const uniqueCategories = [
        "All",
        ...new Set(data.map((p) => p.categoryId?.name).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sort]);

  // 🔹 Keyword search (client-side only)
  useEffect(() => {
    let temp = [...products];

    if (search.trim()) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [search, products]);

  const addToCart = async (id) => {
    if (!token) return toast.error("Login required");
    await axios.post(
      "http://localhost:5050/api/cart/add",
      { productId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Added to cart 🛒");
  };

  const addToWishlist = async (id) => {
    if (!token) return toast.error("Login required");
    await axios.post(
      "http://localhost:5050/api/wishlist/add",
      { productId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Added to wishlist ❤️");
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setSearch("");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h1 className="text-4xl font-serif text-amber-900 mb-10">
          All Products
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border py-2 px-3 rounded"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border py-2 px-3 rounded"
          >
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="flex flex-wrap gap-4 mb-10 items-center">
          <SlidersHorizontal className="w-5 h-5 text-amber-700" />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-3 py-2 rounded w-32"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-3 py-2 rounded w-32"
          />
          <button
            onClick={clearFilters}
            className="text-sm text-amber-700 underline"
          >
            Clear Filters
          </button>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={`http://localhost:5050/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded-t-xl"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-amber-900">
                    {product.name}
                  </h3>

                  <p className="text-amber-700 font-bold mt-1">
                    Rs. {product.price}
                  </p>

                  <div className="flex justify-between mt-4">
                    <button onClick={() => addToWishlist(product._id)}>
                      <Heart className="w-4 h-4 text-red-500" />
                    </button>
                    <button onClick={() => addToCart(product._id)}>
                      <ShoppingCart className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
