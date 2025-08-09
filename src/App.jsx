// App.js - Entry point for the React app
import React, { useEffect, useState, createContext } from "react";
import AppRouter from "./AppRouter";
import { getCurrentUser, logout } from "./services/auth";
import Loader from "./components/Loader";
import Toast from "./components/Toast";

export const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setToast({ message: "Logged out successfully", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Logout failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => setToast({ message, type });

  return (
    <AppContext.Provider
      value={{ user, setUser, loading, setLoading, showToast, handleLogout }}
    >
      {loading && <Loader />}
      <AppRouter />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </AppContext.Provider>
  );
}

export default App;
