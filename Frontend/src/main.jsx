import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react"; // ✅ keep this — you're using it inside AppLayout
import "./index.css";

import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import TeacherDash from "./components/teacher/TeacherDash";
import TeacherSchedule from "./components/teacher/Schedule";
import Attendance from "./components/teacher/Attendance";
import AdminDash from "./components/admin/AdminDash";
import DailySchedule from "./components/admin/DailySchedule";
import TeacherManagement from "./components/admin/TeacherManagement";
import AttendanceDownload from "./components/admin/AttendanceDownload";
import BatchManagement from "./components/admin/BatchManagement";
import PageNotFund from "./components/PageNotFound";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentManagement from "./components/admin/Students";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ safer than window.location.href

  const isAuthPage =
    location.pathname === "/auth/login" ||
    location.pathname === "/reset-password";

  useEffect(() => {
    const lastLogin = localStorage.getItem("lastLoginTime");
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

    if (lastLogin && Date.now() - parseInt(lastLogin) > twoWeeksInMs) {
      // Clear auth-related data and force logout
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userPassword");
      localStorage.removeItem("lastLoginTime");
      navigate("/auth/login"); // ✅ smoother redirect
    }
  }, [navigate]);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginForm />} />

        {/* Teacher Routes */}
        <Route
          path="/teachDash/:id"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachDash/:id/schedule"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachDash/:id/attendance"
          element={
            <ProtectedRoute allowedRole="teacher">
              <Attendance />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/adminDash/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDash/:id/daily-schedule"
          element={
            <ProtectedRoute allowedRole="admin">
              <DailySchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDash/:id/teacher-management"
          element={
            <ProtectedRoute allowedRole="admin">
              <TeacherManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDash/:id/attendance/download"
          element={
            <ProtectedRoute allowedRole="admin">
              <AttendanceDownload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDash/:id/batch-management"
          element={
            <ProtectedRoute allowedRole="admin">
              <BatchManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDash/:id/students"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentManagement />
            </ProtectedRoute>
          }
        />

        {/* Reset Password */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<PageNotFund />} />
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
