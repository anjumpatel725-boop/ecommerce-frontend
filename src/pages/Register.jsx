import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {

  if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!regex.test(password)) {
    alert(
      "Password must contain uppercase, lowercase, number and special character"
    );
    return;
  }

  try {
    const response = await fetch("https://ecommerce-backend-production-075f.up.railway.app/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const message = await response.text();
    alert(message);
    navigate("/login");

  } catch (error) {
    console.log(error);
    alert("Register failed");
  }
};

  return (
    <div className="register-page">
      <div className="register-box">
        <h1>Register</h1>

        <input
          type="text"
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        

        <button onClick={handleRegister}>Register</button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}