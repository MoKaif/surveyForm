import React, { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { signup } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

function Signup() {
  const navigate = useNavigate();
  const { setLoading, showToast } = useContext(AppContext);

  const handleSignup = async (email, password) => {
    setLoading(true);
    try {
      await signup(email, password);
      showToast("Signup successful! Please login.", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}

export default Signup;
