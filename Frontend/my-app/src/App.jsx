import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { ToastContainer } from "react-toastify";
// import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import Login from "./pages/Login/Login";
import ManagerDashboard from "./pages/Manager/Dashboard";
import DynamicTitle from "./components/DynamicTitle";
import LeaderDashboard from "./pages/Leader/Dashboard";

function App() {
  return (
    <BrowserRouter>
    <DynamicTitle />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/leader/dashboard" element={<LeaderDashboard />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
