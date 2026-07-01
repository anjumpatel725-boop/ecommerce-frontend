import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import "../styles/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId");

  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.log("Cart error:", res.status);
        return;
      }

      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (cartId) => {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:8080/api/cart/${cartId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  await loadCart();

  // 🔥 ADD THIS (IMPORTANT)
  window.dispatchEvent(new Event("cartUpdated"));
};

  const placeOrder = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:8080/api/orders/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.ok) {
    alert("Order placed successfully");
    await loadCart();

    // 🔥 ADD THIS
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <h1>Shopping Cart</h1>

        {cart.length === 0 ? (
          <h2>Cart Empty</h2>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-card" key={item.id}>
                <img src={item.product.imageUrl} alt="" />

                <div className="cart-info">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <h4>₹{item.product.price}</h4>
                  <p>Qty: {item.quantity}</p>

                  <button onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="bill-card">
              <h2>Total: ₹{total}</h2>
              <button onClick={placeOrder}>Place Order</button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}