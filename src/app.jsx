import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "./layout/Header";
import AuthModal from "./components/authModal";
import AppRoutes from "./routers/AppRouter";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync login state with localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Called after successful login
const handleLoginSuccess = (token) => {
  localStorage.setItem("token", token);
  setIsLoggedIn(true);
  setShowModal(false);
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setIsLoggedIn(false);
};


  return (
    <Router>
      {/* Header always visible */}
      <Header
        isLoggedIn={isLoggedIn}
        onProfileClick={() => setShowModal(true)}
        onLogout={handleLogout}
      />

      {/* Modal for Login/Register */}
      <AuthModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* App Routes */}
      <AppRoutes isLoggedIn={isLoggedIn} />
    </Router>
  );
}