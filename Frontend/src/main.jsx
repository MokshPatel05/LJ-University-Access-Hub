import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginForm from "./components/loginForm";
import SignupForm from "./components/SignupForm";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth/login" element={<LoginForm />} />
      <Route path="/auth/signup" element={<SignupForm />} />
    </Routes>
  </BrowserRouter>
);
