import React, { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useContext(AppContext);

  const handleLogin = async (email, password) => {
    const loadingToast = toast.loading("Signing you in...");
    setLoading(true);
    
    try {
      const session = await login(email, password);
      const user = await (await import("../services/auth")).getCurrentUser();
      setUser(user);
      
      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${user.email}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}

export default Login;