import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import TeacherDash from "./components/teacher/TeacherDash";
import TeacherSchedule from "./components/teacher/Schedule";
import AdminDash from "./components/admin/AdminDash";
import DailySchedule from "./components/admin/DailySchedule";
import TeacherManagement from "./components/admin/TeacherManagement";
import AttendanceDownload from "./components/admin/AttendanceDownload";
import BatchManagement from "./components/admin/BatchManagement";
import PageNotFund from "./components/PageNotFound";

// Layout component to conditionally render Navbar and Footer
function AppLayout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/auth/login" || location.pathname === "/auth/signup";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginForm />} />
        {/* <Route path="/auth/signup" element={<SignupForm />} /> */}

        {/* Teacher Routes */}
        <Route path="/teachDash/:id" element={<TeacherDash />} />
        <Route path="/teachDash/:id/schedule" element={<TeacherSchedule />} />

        {/* Admin Routes */}
        <Route path="/adminDash/:id" element={<AdminDash />} />
        <Route
          path="/adminDash/:id/daily-schedule"
          element={<DailySchedule />}
        />
        <Route
          path="/adminDash/:id/teacher-management"
          element={<TeacherManagement />}
        />
        <Route
          path="/adminDash/:id/attendance/download"
          element={<AttendanceDownload />}
        />
        <Route
          path="/adminDash/:id/batch-management"
          element={<BatchManagement />}
        />
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
