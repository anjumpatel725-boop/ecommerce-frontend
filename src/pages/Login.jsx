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

    console.log("STATUS =", response.status);
console.log("OK =", response.ok);

const text = await response.text();
console.log("RAW RESPONSE =", text);

  } catch (error) {
    console.log("LOGIN ERROR:", error);
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
  style={{
    padding: "20px",
    background: "red",
    color: "white"
  }}
  onClick={() => alert("WORKING")}
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