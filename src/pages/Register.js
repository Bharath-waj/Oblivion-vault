import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import '../styles/register.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("Register Data:", formData);

    navigate("/login");
  };

  return React.createElement(
    "div",
    { className: "register-container" },
    React.createElement("h2", null, "Register"),
    React.createElement(
      "form",
      { onSubmit: handleSubmit },
      React.createElement("input", {
        type: "text",
        name: "username",
        placeholder: "Username",
        value: formData.username,
        onChange: handleChange
      }),
      React.createElement("input", {
        type: "email",
        name: "email",
        placeholder: "Email",
        value: formData.email,
        onChange: handleChange
      }),
      React.createElement("input", {
        type: "password",
        name: "password",
        placeholder: "Password",
        value: formData.password,
        onChange: handleChange
      }),
      React.createElement(
        "button",
        { type: "submit" },
        "Register"
      )
    )
  );
}

export default Register;
