import { useEffect, useState } from "react";
import api from "../services/api";
import "./MyProducts.css";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Optional loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product/my-products"); // ✅ JWT token handled by api.js
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        if (err.response?.status === 401) {
          setError("❌ Unauthorized: Please log in again.");
        } else if (err.response?.status === 403) {
          setError("❌ Forbidden: Access denied.");
        } else {
          setError("❌ Failed to fetch products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      <h2>🛍️ My Products</h2>

      {loading && <p>Loading products...</p>}

      {!loading && error && <p className="error-message">{error}</p>}

      {!loading && products.length === 0 && !error && (
        <p>No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> - ₹{product.price}
              <br />
              <small>{product.description}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
