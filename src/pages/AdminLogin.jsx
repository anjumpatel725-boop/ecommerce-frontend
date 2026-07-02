import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post(
        "https://ecommerce-backend-production-075f.up.railway.app/api/auth/login",
        {
          email,
          password
        }
      );

      console.log("Login Response:", res.data);

      if (
        res.data.status === "SUCCESS" &&
        res.data.role === "ROLE_ADMIN"
      ) {
        // Save login data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("userName", res.data.name);

        // Optional: Set axios default header globally
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        alert("Admin Login Successful ✅");
        navigate("/admin");
      } else if (res.data.status === "SUCCESS") {
        alert("You are not Admin ❌");
      } else {
        alert("Invalid Credentials ❌");
      }

    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        alert("Invalid Email or Password");
      } else {
        alert("Server Error");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a"
  },
  box: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "350px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid gray",
    fontSize: "16px"
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  }
};