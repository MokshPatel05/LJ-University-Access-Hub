import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function useSessionExpiry() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

    if (loginTime) {
      const now = Date.now();
      const diff = now - parseInt(loginTime);

      if (diff > twoWeeksInMs) {
        // Session expired
        alert("Your session has expired. Please log in again.");
        localStorage.clear();
        navigate("/auth/login");
      }
    }

    // Optional: redirect to login if loginTime is missing but required
    const userId = localStorage.getItem("userId");
    if (!loginTime && userId && location.pathname !== "/auth/login") {
      alert("Session invalid. Please login.");
      localStorage.clear();
      navigate("/auth/login");
    }
  }, [navigate, location]);
}
