import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
      })
    });

    const user = await response.json();

    console.log("LOGIN RESPONSE:", user);

    if (!user || user.status !== "SUCCESS") {
      alert("Invalid Email or Password");
      return;
    }

    localStorage.setItem("token", user.token);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", user.userId);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userRole", user.role);

    alert("Login Successful");

    if (user.role === "ROLE_ADMIN") {
      navigate("/admin");
    } else {
      navigate("/home");
    }

  } catch (error) {
    console.log("LOGIN ERROR:", error);
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

        <button onClick={handleLogin}>Login</button>

        <p>
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}