import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId");
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

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // 1. Check Address
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
    window.location.href = "/address";
    return;
  }

  // 2. Load Razorpay
  await loadRazorpay();

  // 3. Create Payment Order
  const res = await axios.post(
    "https://ecommerce-backend-production-075f.up.railway.app/api/payment/create",
    {
      amount: total
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const order = JSON.parse(res.data);

  const options = {
    key: "rzp_test_xxxxxxxxx", // Replace with your Razorpay Test Key

    amount: order.amount,
    currency: order.currency,
    order_id: order.id,

    name: "E-Commerce",

    description: "Shopping Payment",

    handler: async function () {

      // 4. Payment Success → Place Order
      await placeOrder();

      alert("Payment Successful & Order Placed");

      window.location.href = "/orders";
    }
  };

  const payment = new window.Razorpay(options);

  payment.open();
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