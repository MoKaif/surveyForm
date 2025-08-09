import React, { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

function Login() {
  const navigate = useNavigate();
  const { setUser, setLoading, showToast } = useContext(AppContext);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const session = await login(email, password);
      const user = await (await import("../services/auth")).getCurrentUser();
      setUser(user);
      showToast("Logged in successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}

export default Login;
