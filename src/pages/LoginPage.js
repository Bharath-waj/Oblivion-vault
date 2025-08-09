
import React, { useState } from 'react';
import '../styles/Login.css';

import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2>Oblivian Vault</h2>
        <p>Secure your digital life</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Unlock Vault</button>
        </form>
        <Link to="/Register" className="register-link">
          Create New Vault
        </Link>
      </div>
    </div>
  );
}
