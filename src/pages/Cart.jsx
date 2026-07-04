import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Cart.css";

export default function Cart() {

  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {

      const res = await axios.get(
        `https://ecommerce-backend-production-075f.up.railway.app/api/cart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCart(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (cartId) => {

    try {

      await axios.delete(
        `https://ecommerce-backend-production-075f.up.railway.app/api/cart/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadCart();

      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.log(err);
    }
  };

  const loadRazorpay = () => {

    return new Promise((resolve) => {

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);

    });

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

  const payNow = async () => {

    try {

      if (cart.length === 0) {
        alert("Cart is Empty");
        return;
      }

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

        alert("Please add address first");

        navigate("/address");

        return;
      }

      // Razorpay Script

      const loaded = await loadRazorpay();

      if (!loaded) {

        alert("Razorpay SDK Failed");

        return;

      }

      // Create Razorpay Order

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

      const order = typeof res.data === "string"
        ? JSON.parse(res.data)
        : res.data;

      const options = {

        key: "rzp_test_T9UBGuHk8tFPrK",   // Replace with your real Razorpay Test Key

        amount: order.amount,

        currency: order.currency,

        order_id: order.id,

        name: "E-Commerce",

        description: "Order Payment",

        handler: async function () {

          await placeOrder();

          alert("Payment Successful");

          loadCart();

          navigate("/orders");

        },

        prefill: {
          name: "",
          email: "",
          contact: ""
        },

        theme: {
          color: "#3399cc"
        }

      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();

    }

    catch (err) {

      console.log(err);

      alert("Payment Failed");

    }

  };

  return (

    <>

      <Navbar />

      <div className="cart-page">

        <h1>Shopping Cart</h1>

        {cart.length === 0 ?

          <h2>Cart Empty</h2>

          :

          <>

            {

              cart.map((item) => (

                <div className="cart-card" key={item.id}>

                  <img
                    src={item.product.imageUrl}
                    alt=""
                  />

                  <div className="cart-info">

                    <h3>{item.product.name}</h3>

                    <p>{item.product.description}</p>

                    <h4>₹{item.product.price}</h4>

                    <p>Qty : {item.quantity}</p>

                    <button
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))

            }

            <div className="bill-card">

              <h2>Total : ₹{total}</h2>

              <button onClick={payNow}>

                Pay & Place Order

              </button>

            </div>

          </>

        }

      </div>

      <Footer />

    </>

  );

}