import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cab-booking-be-jvxw.onrender.com"
    : "http://localhost:5000";

export default function CartPage() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // Fetch products + cart
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_URL}/api/cart/products-cart`)
      setProducts(res.data.products || []);
      setCart(res.data.cart || { items: [] });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers
  const cartQtyById = useMemo(() => {
    const map = new Map();
    (cart.items || []).forEach((i) => {
      map.set(String(i.productId), i.quantity);
    });
    return map;
  }, [cart]);

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(String(p.id), p));
    return map;
  }, [products]);

  const cartTotal = useMemo(() => {
    return (cart.items || []).reduce((sum, i) => {
      const p = productMap.get(String(i.productId));
      if (!p) return sum;
      return sum + p.price * i.quantity;
    }, 0);
  }, [cart, productMap]);

  // Actions
  const addToCart = async (productId, quantity = 1) => {
    try {
      setMsg("");
      await axios.post(
        `${API_URL}/api/cart/add/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Added to cart");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      if (quantity < 0) return;
      await axios.put(
        `${API_URL}/api/cart/update/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove item");
    }
  };

  // UI
  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #1fa2ff 0%, #12d8fa 50%, #a6ffcb 100%)",
        padding: "40px 20px",
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">🛍️ Store & Cart</h2>
          <div className="d-flex gap-2">
            <a href="/signup" className="btn btn-outline-dark btn-sm">Signup</a>
            <a href="/login" className="btn btn-dark btn-sm">Login</a>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {msg && <div className="alert alert-success">{msg}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"></div>
            <p className="mt-3 mb-0 fw-semibold">Loading products & cart…</p>
          </div>
        ) : (
          <div className="row g-4">
            {/* Products */}
            <div className="col-lg-8">
              <div className="row g-4">
                {products.map((p) => {
                  const inCartQty = cartQtyById.get(String(p.id)) || 0;
                  return (
                    <div className="col-md-6" key={p.id}>
                      <div className="card h-100 shadow border-0 rounded-4">
                        <div className="ratio ratio-4x3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="card-img-top object-fit-contain p-3"
                            style={{ background: "#ffffff" }}
                          />
                        </div>
                        <div className="card-body d-flex flex-column">
                          <h6 className="fw-bold">{p.title}</h6>
                          <p className="text-muted small mb-2">
                            {p.category?.toUpperCase()}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fs-5 fw-bold">${p.price}</span>
                            {inCartQty > 0 ? (
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() =>
                                    updateQty(p.id, inCartQty - 1)
                                  }
                                >
                                  −
                                </button>
                                <span className="fw-semibold">{inCartQty}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() =>
                                    updateQty(p.id, inCartQty + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => addToCart(p.id, 1)}
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {products.length === 0 && (
                  <div className="col-12">
                    <div className="alert alert-info">
                      No products found right now.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cart */}
            <div className="col-lg-4">
              <div
                className="card shadow border-0 rounded-4 sticky-top"
                style={{ top: 24 }}
              >
                <div className="card-body">
                  <h5 className="fw-bold mb-3">🛒 Your Cart</h5>
                  {(cart.items || []).length === 0 ? (
                    <p className="text-muted mb-0">Cart is empty.</p>
                  ) : (
                    <>
                      <ul className="list-group list-group-flush mb-3">
                        {cart.items.map((i) => {
                          const p = productMap.get(String(i.productId));
                          if (!p) return null;
                          return (
                            <li
                              key={String(i.productId)}
                              className="list-group-item d-flex align-items-center px-0"
                              style={{ background: "transparent" }}
                            >
                              <img
                                src={p.image}
                                alt={p.title}
                                style={{ width: 48, height: 48, objectFit: "contain" }}
                                className="me-3 rounded"
                              />
                              <div className="flex-grow-1">
                                <div className="fw-semibold">{p.title}</div>
                                <div className="text-muted small">
                                  ${p.price} × {i.quantity} = $
                                  {(p.price * i.quantity).toFixed(2)}
                                </div>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() =>
                                    updateQty(i.productId, i.quantity - 1)
                                  }
                                >
                                  −
                                </button>
                                <span className="fw-semibold">{i.quantity}</span>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() =>
                                    updateQty(i.productId, i.quantity + 1)
                                  }
                                >
                                  +
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeItem(i.productId)}
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Subtotal</span>
                        <span className="fw-bold">${cartTotal.toFixed(2)}</span>
                      </div>

                      <button className="btn btn-success w-100 mt-3">
                        Proceed to Checkout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
