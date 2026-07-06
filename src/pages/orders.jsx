import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import "../styles/orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const userId = localStorage.getItem("userId");

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Token:", token);
      console.log("User ID:", userId);

      const res = await fetch(
        `https://ecommerce-backend-production-075f.up.railway.app/api/orders/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response Status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.log("Error Response:", text);
        return;
      }

      const data = await res.json();

      console.log("========== ORDERS ==========");
      console.log(data);
      console.log("Total Orders:", data.length);

      data.forEach((order, index) => {
        console.log(
          "Index:",
          index,
          "Order ID:",
          order.id,
          "Customer:",
          order.fullName
        );
      });

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
          <div className="empty-orders">
            No Orders Found
          </div>
        ) : (
          orders.map((order, index) => {
            console.log(
              "Rendering ->",
              "Index:",
              index,
              "Order ID:",
              order.id
            );

            return (
              <div className="order-box" key={order.id}>
                <div className="order-top">
                  <div>
                    <h3>Order #{index + 1}</h3>

                    <p>
                      <b>Total:</b> ₹{order.totalAmount}
                    </p>
                  </div>

                  <div
                    className={`status ${order.status?.toLowerCase()}`}
                  >
                    {order.status}
                  </div>
                </div>

                <button
                  className="details-btn"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id
                        ? null
                        : order.id
                    )
                  }
                >
                  {expandedOrder === order.id
                    ? "▲ Hide Details"
                    : "▼ View Details"}
                </button>

                {expandedOrder === order.id && (
                  <>
                    <hr />

                    <div className="address-box">
                      <h4>📍 Delivery Address</h4>

                      <p>
                        <b>Name:</b> {order.fullName}
                      </p>

                      <p>
                        <b>Mobile:</b> {order.mobile}
                      </p>

                      <p>
                        <b>Address:</b>
                        <br />
                        {order.house}, {order.street}
                        <br />
                        {order.city}, {order.state}
                        <br />
                        {order.country} - {order.pincode}
                      </p>
                    </div>

                    <hr />

                    <h3 style={{ marginBottom: "15px" }}>
                      🛒 Ordered Products
                    </h3>

                    {order.items?.map((item) => (
                      <div
                        className="product-box"
                        key={item.id}
                      >
                        <img
                          src={
                            item.product?.imageUrl ||
                            "/no-image.png"
                          }
                          alt={item.product?.name}
                          className="order-img"
                        />

                        <div>
                          <h4>{item.product?.name}</h4>

                          <p>
                            {item.product?.description}
                          </p>

                          <p>
                            Qty : {item.quantity}
                          </p>

                          <p>
                            Price : ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      <Footer />
    </>
  );
}