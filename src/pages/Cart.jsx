import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");
  const navigate = useNavigate();
 

  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`https://ecommerce-backend-production-075f.up.railway.app/api/cart/${userId}`, {
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

  await fetch(`https://ecommerce-backend-production-075f.up.railway.app/api/cart/${cartId}`, {
    method: "DELETE",
    headers: {
  Authorization: `Bearer ${token}`
}
  });

  await loadCart();

  // 🔥 ADD THIS (IMPORTANT)
  window.dispatchEvent(new Event("cartUpdated"));
};


const payNow = async () => {
  try {

    // Check Cart
    if (cart.length === 0) {
      alert("Cart is Empty");
      return;
    }

    // Check Address
    const addressRes = await axios.get(
  `https://ecommerce-backend-production-075f.up.railway.app/api/address/${userId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    if (addressRes.data.length === 0) {
      alert("Please add your delivery address first.");
      navigate("/address");
      return;
    }

    // Demo Payment Popup
    const paid = window.confirm(
      `Demo Payment\n\nAmount: ₹${total}\n\nClick OK to complete payment.`
    );

    if (!paid) {
      alert("Payment Cancelled");
      return;
    }

    // Place Order
    await axios.post(
  `https://ecommerce-backend-production-075f.up.railway.app/api/orders/${userId}`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    window.dispatchEvent(new Event("cartUpdated"));

    alert("✅ Payment Successful\n\n✅ Order Placed Successfully");

    loadCart();

    navigate("/orders");

  } catch (err) {
    console.log(err);
    alert("Payment Failed");
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
              <button onClick={payNow}>
    Pay & Place Order
</button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}