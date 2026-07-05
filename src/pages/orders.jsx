import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import "../styles/orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Token:", token);
      console.log("User ID:", userId);

      const res = await fetch(`https://ecommerce-backend-production-075f.up.railway.app/api/orders/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Response Status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.log("Error Response:", text);
        return;
      }

      const data = await res.json();
      console.log("Orders Data:", data);
      setOrders(data);

    } catch (err) {
      console.log("Orders Exception:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="orders-page">
        <h1>📦 My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">No Orders Found</div>
        ) : (
          orders.map((order, index) => (
            <div className="order-box" key={o.id}>

  <div className="order-top">

    <div>
      <h3>Order #{o.id}</h3>
      <p><b>Total:</b> ₹{o.totalAmount}</p>
    </div>

    <div className="status">
      {o.status}
    </div>

  </div>

  <hr />

  <div className="address-box">

    <h4>📍 Delivery Address</h4>

    <p><b>Name:</b> {o.fullName}</p>

    <p><b>Mobile:</b> {o.mobile}</p>

    <p>
      <b>Address:</b><br />
      {o.house}, {o.street}
      <br />
      {o.city}, {o.state}
      <br />
      {o.country} - {o.pincode}
    </p>

  </div>

  <hr />

  {o.items.map(item => (

    <div className="product-box" key={item.id}>

      <img
        src={item.product.imageUrl}
        alt=""
      />

      <div>

        <h4>{item.product.name}</h4>

        <p>{item.product.description}</p>

        <p>Qty : {item.quantity}</p>

        <p>Price : ₹{item.price}</p>

      </div>

    </div>

  ))}

</div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}