import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import LoginForm from "./components/loginForm";
import SignupForm from "./components/SignupForm";
import Home from "./components/Home";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
// Layout component to conditionally render Navbar and Footer
function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth/login" || location.pathname === "/auth/signup";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />

      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </StrictMode>
);