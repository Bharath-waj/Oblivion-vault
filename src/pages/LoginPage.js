import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // add useNavigate
import '../styles/Login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();  // initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });

    // Example navigation logic after login validation success:
    // (replace with your real validation)
    if(email === 'user@example.com' && password === 'password123'){
      navigate('/dashboard');  // navigate to dashboard or whatever route
    } else {
      alert('Invalid login credentials');  // or handle error properly
    }
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
          <button type="submit" >Unlock Vault</button>
        </form>
        <Link to="/Register" className="register-link">
          Create New Vault
        </Link>
      </div>
    </div>
  );
}
