import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../App";
import { 
  BarChart3, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  Settings
} from "lucide-react";
import Button from "./ui/Button";
import toast from 'react-hot-toast';

function Navbar() {
  const { user, handleLogout, loading } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      toast.success('Logged out successfully');
      navigate("/");
    } catch (error) {
      toast.error('Logout failed');
    }
    setMobileMenuOpen(false);
  };

  const navItems = user ? [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/create", label: "Create Survey", icon: Plus },
  ] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
              SurveyPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogoutClick}
                  disabled={loading}
                  className="text-slate-600 hover:text-error-600"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                {user ? (
                  <div className="px-4 py-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      disabled={loading}
                      className="flex items-center space-x-2 text-sm font-medium text-error-600 hover:text-error-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-3 border-t border-slate-200 space-y-3">
                    <Link 
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button variant="primary" size="sm" className="w-full justify-start">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
