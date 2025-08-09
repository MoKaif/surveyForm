import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SurveyForm from "./pages/SurveyForm";
import SurveyView from "./pages/SurveyView";

import SurveyResponses from "./pages/SurveyResponses";

function AppRouter() {
  return (
    <Router basename="/NoxForm">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<SurveyForm />} />
        <Route path="/survey/:id" element={<SurveyView />} />
        <Route path="/survey/:id/responses" element={<SurveyResponses />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
