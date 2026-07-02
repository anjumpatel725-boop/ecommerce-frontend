import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  return (
    <div>
      <h1>Test</h1>
      <button onClick={() => alert("Clicked!")}>
        CLICK ME
      </button>
    </div>
  );
}