import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const userId = localStorage.getItem("userId");

  const loadCartCount = async () => {
  try {
    if (!userId) {
      setCartCount(0);
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`https://ecommerce-backend-production-075f.up.railway.app/api/cart/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.log("Cart API Error:", res.status);
      return;
    }

    const data = await res.json();
    setCartCount(data.length);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
  loadCartCount();

  const handler = () => loadCartCount();

  window.addEventListener("cartUpdated", handler);

  return () => {
    window.removeEventListener("cartUpdated", handler);
  };
}, [location]);


  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/home?search=${search}`);
    } else {
      navigate("/home");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">Amazon Clone</div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="nav-links">
  <Link to="/home">Home</Link>
  <Link to="/cart">Cart ({cartCount})</Link>
  <Link to="/orders">Orders</Link>

  <span style={{ color: "yellow", fontWeight: "bold" }}>
    ADDRESS TEST
  </span>

  <Link to="/address">Address</Link>

  <button onClick={logout} className="logout-btn">
    Logout
  </button>
</div>
    </nav>
  );
}