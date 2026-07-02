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
            <div key={order.id} className="order-box">
              <div className="order-header">
                <h2>Order #{index + 1}</h2>
                <span className={`status ${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <p><b>Total:</b> ₹{order.totalAmount}</p>

              {order.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="order-img"
                  />

                  <div className="order-details">
                    <h3>{item.product.name}</h3>
                    <p>{item.product.description}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
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