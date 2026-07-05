import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import "../styles/Admin.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter,setStatusFilter]=useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedCustomer,setSelectedCustomer]=useState(null);


  const [form, setForm] = useState({
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  imageUrl: "",
  categoryId: 1
});
  

  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page]);

 const loadProducts = async () => {
  try {
    const res = await axios.get("https://ecommerce-backend-production-075f.up.railway.app/api/products");

    setProducts(res.data);
    setTotalProducts(res.data.length);
    setTotalPages(1); // pagination off for now
  } catch (err) {
    console.log("Product load error:", err);
  }
};

  const loadData = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const userRes = await axios.get(
      "https://ecommerce-backend-production-075f.up.railway.app/api/admin/users",
      config
    );

    console.log("Users:", userRes.data);

    const orderRes = await axios.get(
      "https://ecommerce-backend-production-075f.up.railway.app/api/admin/orders",
      config
    );

    console.log("Orders:", orderRes.data);

    setUsers(userRes.data);
    setOrders(orderRes.data);

  } catch (err) {
    console.log("ADMIN ERROR:", err.response);
  }
};
  const addProduct = async () => {
  try {
    const token = localStorage.getItem("token");

    const product = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      imageUrl: form.imageUrl,
      category: {
        id: Number(form.categoryId)
      }
    };

    const res = await axios.post(
      "https://ecommerce-backend-production-075f.up.railway.app/api/products",
      product,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log(res.data);
    alert("Product Added Successfully");

    loadProducts();

    setForm({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      imageUrl: "",
      categoryId: 1
    });

  } catch (err) {
    console.log(err.response?.data);
    console.log(err.response?.status);
    alert("Product Add Failed");
  }
};

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

await axios.delete(
  `https://ecommerce-backend-production-075f.up.railway.app/api/products/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
    loadProducts();  
    loadData();
  };

  const updateProduct = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://ecommerce-backend-production-075f.up.railway.app/api/products/${editProduct.id}`,
      editProduct,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Product Updated");

    setEditProduct(null);

    loadProducts();

  } catch (err) {
    console.log(err);
    alert("Update Failed");
  }
};

 const updateStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://ecommerce-backend-production-075f.up.railway.app/api/admin/orders/${id}/status?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Status updated");
    loadData();
  } catch (err) {
    console.log("Update status error:", err);
    alert("Status update failed");
  }
};

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("isLoggedIn");

  window.location.href = "/admin-login";
};
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const chartData = [
  { name: "Products", value: totalProducts },
  { name: "Users", value: users.length },
  { name: "Orders", value: orders.length },
  { name: "Revenue", value: totalRevenue }
];
const monthlyRevenue = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 14000 },
  { month: "Apr", revenue: 24000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: totalRevenue || 28000 }
];

const orderStatusData = [
  {
    name: "Placed",
    value: orders.filter(o => o.status === "PLACED").length
  },
  {
    name: "Shipped",
    value: orders.filter(o => o.status === "SHIPPED").length
  },
  {
    name: "Delivered",
    value: orders.filter(o => o.status === "DELIVERED").length
  }
];
const downloadExcel = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://ecommerce-backend-production-075f.up.railway.app/api/admin/orders/export/excel",
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "orders.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.log(err);
    alert("Excel download failed");
  }
};

const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];
const filteredOrders = orders.filter((o) => {

  const searchMatch =
  o.id.toString().includes(search) ||
  (o.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
  (o.user?.email || "").toLowerCase().includes(search.toLowerCase());

  const statusMatch =
    statusFilter === "ALL" ||
    o.status === statusFilter;

  const dateMatch =
    !dateFilter ||
    (o.orderDate &&
      o.orderDate.substring(0, 10) === dateFilter);

  return searchMatch && statusMatch && dateMatch;

});
  return (
    <div className="admin-layout">
      <div className="sidebar">
        <h2>⚡ Admin Panel</h2>

        <div className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          📊 Dashboard
        </div>

        <div className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
          📦 Products
        </div>

        <div className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
          👤 Users
        </div>

        <div className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          🛒 Orders
        </div>
        <div onClick={downloadExcel}>
  📥 Export Orders Excel
</div>

        <div onClick={logout}>🚪 Logout</div>
      </div>

      <div className="main">
        {activeTab === "dashboard" && (
  <>
    <h1>Dashboard Overview</h1>

    <div className="cards">
      <div className="card">
        Products
        <h2>{totalProducts}</h2>
      </div>

      <div className="card">
        Users
        <h2>{users.length}</h2>
      </div>

      <div className="card">
        Orders
        <h2>{orders.length}</h2>
      </div>

      <div className="card revenue">
        Revenue
        <h2>₹{totalRevenue}</h2>
      </div>
    </div>

    {/* Analytics Row */}
    <div className="analytics-grid">
      {/* Sales Analytics */}
      <div className="chart-box">
        <h2>Sales Analytics</h2>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={4}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="chart-box">
        <h2>Order Status</h2>

        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Monthly Revenue */}
    <div className="chart-box">
      <h2>Monthly Revenue</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#9333ea"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Recent Orders */}
    
    <div className="recent-orders">
      <h2>Recent Orders</h2>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.slice(0, 5).map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.status}</td>
              <td>₹{order.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}


        {activeTab === "products" && (
          <>
            <h1>Products</h1>
            <p>Total Loaded: {products.length}</p>

            <div className="form">
              <input placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />

              <input placeholder="Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />

              <input placeholder="Price" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} />

              <input placeholder="Stock" value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />

              <input placeholder="Image URL" value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />

              <button onClick={addProduct}>Add Product</button>
            </div>

            {products.map((p) => (
              <div className="list-card" key={p.id}>
                <span> {p.name}
                 <br />
                ₹{p.price}
                 <br />
                 Stock : {p.stockQuantity}
                 </span>
                <div>
                  <button onClick={() => setEditProduct(p)}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </div>
              </div>
            ))}

            
          </>
        )}

        {activeTab === "users" && (
          <>
            <h1>Users</h1>
            {users.map((u) => (
              <div className="list-card" key={u.id}>{u.email}</div>
            ))}
          </>
        )}

        {activeTab === "orders" && (
<>
<h1>Orders Management</h1>

<div className="order-filters">

<input
type="text"
placeholder="🔍 Search Order ID / Customer"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
>
<option value="ALL">All Status</option>
<option value="PLACED">Placed</option>
<option value="SHIPPED">Shipped</option>
<option value="DELIVERED">Delivered</option>
</select>

<input
type="date"
value={dateFilter}
onChange={(e)=>setDateFilter(e.target.value)}
/>

</div>

{filteredOrders.length === 0 ? (

  <div className="no-orders">
    <h2>No Orders Found</h2>
  </div>

) : (

  filteredOrders.map((o) => (

    <div className="admin-order-card" key={o.id}>

      <div className="admin-order-header">

        <div>

          <h3>Order #{o.id}</h3>

          <p><b>Total :</b> ₹{o.totalAmount}</p>

          <p>
            <b>Order Time :</b>{" "}
            {o.orderDate
              ? new Date(o.orderDate).toLocaleString()
              : "N/A"}
          </p>

        </div>

        <select
          className={`status-select ${o.status.toLowerCase()}`}
          value={o.status}
          onChange={(e) => updateStatus(o.id, e.target.value)}
        >
          <option value="PLACED">Placed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>

      </div>

      <div className="admin-address">

        <h4>📍 Delivery Address</h4>

        <p><b>Name :</b> {o.fullName}</p>

        <p><b>Mobile :</b> {o.mobile}</p>

        <p>{o.house}, {o.street}</p>

        <p>{o.city}, {o.state}</p>

        <p>{o.country} - {o.pincode}</p>

        <button onClick={() => setSelectedCustomer(o)}>
          Customer Details
        </button>

      </div>

      {o.items?.map((item) => (

        <div className="admin-product" key={item.id}>

          <img
            src={item.product.imageUrl || "/no-image.png"}
            alt={item.product.name}
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

{selectedCustomer && (

<div className="customer-modal">

<div className="customer-popup">

<h2>Customer Details</h2>

<p><b>Name :</b> {selectedCustomer.fullName}</p>

<p><b>Mobile :</b> {selectedCustomer.mobile}</p>

<p><b>Address :</b></p>

<p>
{selectedCustomer.house},
{selectedCustomer.street}
</p>

<p>
{selectedCustomer.city},
{selectedCustomer.state}
</p>

<p>
{selectedCustomer.country}
-
{selectedCustomer.pincode}
</p>

<button
onClick={()=>setSelectedCustomer(null)}
>
Close
</button>

</div>

</div>

)}

</>
)}

        {editProduct && (
          <div className="modal">
            <h3>Edit Product</h3>

            <input
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />

            <input
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />
            <input
  type="number"
  placeholder="Stock Quantity"
  value={editProduct.stockQuantity}
  onChange={(e) =>
    setEditProduct({
      ...editProduct,
      stockQuantity: Number(e.target.value)
    })
  }
/>

            <button onClick={updateProduct}>Update</button>
            <button onClick={() => setEditProduct(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );

}