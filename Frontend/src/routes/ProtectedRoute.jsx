import React from "react";
import { Navigate, useParams } from "react-router-dom";
import AccessDenied from "../pages/AccessDenied"; // ✅ update the path accordingly

const ProtectedRoute = ({ children, allowedRole }) => {
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const { id } = useParams();

  const isAuthenticated = userId && userRole;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const isCorrectRole = userRole === allowedRole;
  const isCorrectId = userId === id;

  if (!isCorrectRole || !isCorrectId) {
    return <AccessDenied />;
  }

  return children;
};

export default ProtectedRoute;
