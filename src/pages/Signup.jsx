import React, { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { signup, login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import toast from 'react-hot-toast';

function Signup() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useContext(AppContext);

  const handleSignup = async (email, password) => {
    const loadingToast = toast.loading("Creating your account...");
    setLoading(true);
    
    try {
      // Create account
      await signup(email, password);
      
      // Auto login after signup
      await login(email, password);
      const user = await (await import("../services/auth")).getCurrentUser();
      setUser(user);
      
      toast.dismiss(loadingToast);
      toast.success(`Welcome to SurveyPro, ${user.email}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      toast.dismiss(loadingToast);
      if (err.message.includes("already exists")) {
        toast.error("Account already exists. Please try logging in instead.");
      } else {
        toast.error(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}

export default Signup;