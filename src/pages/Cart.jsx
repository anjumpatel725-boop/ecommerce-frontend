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
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

  const payNow = async () => {
  try {
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

    // Load Razorpay SDK
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    // Create Razorpay Order
    const response = await axios.post(
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

    const order =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;

    const options = {
      key: "rzp_test_T9UBGuHk8tFPrK",

      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      name: "E-Commerce",

      description: "Shopping Payment",

      handler: async function () {
        await placeOrder();

        alert("Payment Successful");

        loadCart();

        navigate("/orders");
      },

      theme: {
        color: "#3399cc"
      }
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (err) {

  console.log("FULL ERROR:", err);

  if (err.response) {
    console.log("Status:", err.response.status);
    console.log("Data:", err.response.data);

    alert(JSON.stringify(err.response.data));
  } else {
    alert(err.message);
  }

}
};
const placeOrder = async () => {
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