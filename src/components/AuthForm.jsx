import React, { useState } from "react";

function AuthForm({ type = "login", onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 320, margin: "2rem auto" }}
    >
      <h3>{type === "login" ? "Login" : "Signup"}</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 12 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 12 }}
      />
      <button type="submit" style={{ width: "100%" }}>
        {type === "login" ? "Login" : "Signup"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}

export default AuthForm;
