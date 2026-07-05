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
  const [paymentDone, setPaymentDone] = useState(false);
  const [paidItems, setPaidItems] = useState({});
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


const payNow = async (item) => {

  try {

    // Address Check
    const addressRes = await axios.get(
      `https://ecommerce-backend-production-075f.up.railway.app/api/address/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (addressRes.data.length === 0) {
      alert("Please add your address first");
      navigate("/address");
      return;
    }

    const amount = item.product.price * item.quantity;

    const paid = window.confirm(
      `Pay ₹${amount} for ${item.product.name}?`
    );

    if (!paid) return;

    alert("Payment Successful");

    setPaidItems(prev => ({
      ...prev,
      [item.id]: true
    }));

  } catch (err) {
    console.log(err);
  }

};
  const placeOrder = async (item) => {

  try {

    if (!paidItems[item.id]) {
      alert("Please pay first");
      return;
    }

    await axios.post(
      `https://ecommerce-backend-production-075f.up.railway.app/api/orders/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Order Placed");

    loadCart();

    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/orders");

  } catch (err) {
    console.log(err);
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

              <img
                src={item.product.imageUrl}
                alt={item.product.name}
              />

              <div className="cart-info">

                <h3>{item.product.name}</h3>

                <p>{item.product.description}</p>

                <h4>Price : ₹{item.product.price}</h4>

                <p>Quantity : {item.quantity}</p>

                <h4>
                  Total : ₹{item.product.price * item.quantity}
                </h4>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap"
                  }}
                >

                  <button
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => payNow(item)}
                  >
                    Pay Now
                  </button>

                  <button
                    onClick={() => placeOrder(item)}
                    disabled={!paidItems[item.id]}
                    style={{
                      backgroundColor: paidItems[item.id]
                        ? "green"
                        : "gray",
                      color: "white",
                      cursor: paidItems[item.id]
                        ? "pointer"
                        : "not-allowed"
                    }}
                  >
                    Place Order
                  </button>

                </div>

              </div>

            </div>

          ))}

          <div className="bill-card">

            <h2>
              Grand Total : ₹{total}
            </h2>

          </div>

        </>

      )}

    </div>

    <Footer />

  </>
);
}