import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../App";

function Navbar() {
  const { user, handleLogout, loading } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link
          to="/"
          style={{ marginRight: "1rem", fontWeight: 600, fontSize: "1.1rem" }}
        >
          SurveyApp
        </Link>
        {user && (
          <>
            <Link to="/dashboard" style={{ marginRight: "1rem" }}>
              Dashboard
            </Link>
            <Link to="/create" style={{ marginRight: "1rem" }}>
              Create Survey
            </Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 16, color: "#555" }}>
              Hi, {user.email}
            </span>
            <button
              onClick={() => {
                handleLogout();
                navigate("/");
              }}
              style={{
                padding: "0.4rem 1rem",
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "1rem" }}>
              Login
            </Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
