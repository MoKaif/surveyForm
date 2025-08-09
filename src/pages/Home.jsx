import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../App";

function Home() {
  const { user } = useContext(AppContext);
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: 8 }}>
        Welcome to SurveyApp
      </h1>
      <p style={{ color: "#555", fontSize: "1.2rem", marginBottom: 32 }}>
        Create, share, and collect survey responses with ease.
      </p>
      {user ? (
        <Link to="/dashboard" className="cta-btn">
          Go to Dashboard
        </Link>
      ) : (
        <>
          <Link to="/signup" className="cta-btn" style={{ marginRight: 16 }}>
            Get Started
          </Link>
          <Link to="/login" className="cta-btn">
            Login
          </Link>
        </>
      )}
      <style>{`
        .cta-btn {
          display: inline-block;
          background: #3498db;
          color: #fff;
          padding: 0.75rem 2rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        .cta-btn:hover {
          background: #217dbb;
        }
      `}</style>
    </div>
  );
}

export default Home;
