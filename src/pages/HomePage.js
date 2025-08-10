import React from "react";
import "../styles/Homepage.css";

export default function Homepage() {
  return (
    <div className="homepage">
      <div className="particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>
      <div className="content">
        <h1>Welcome</h1>
        <p>This is the homepage</p>
      </div>
    </div>
  );
}
