import React from "react";

export default function App() {
  return (
    <div className="container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Please login to continue</p>
        <form>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <a href="#" className="register-link">
          New here? Register
        </a>
      </div>
    </div>
  );
}
