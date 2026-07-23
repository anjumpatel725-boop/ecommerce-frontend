import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const response = await fetch(
      "https://ecommerce-backend-production-075f.up.railway.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      }
    );

    const data = await response.json();
console.log(data);

if (data.status === "SUCCESS") {
  localStorage.setItem("token", data.token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", data.role);

  // IMPORTANT
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("userName", data.name);

  navigate("/home");
} else {
  alert("Please register first");
}

  } catch (error) {
    console.log(error);
    alert("Server Error");
  }
};

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
        onClick={() => {
    console.log("LOGIN BUTTON CLICKED");
    handleLogin();
  }}
>
  Login
  </button>

        <p>
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}