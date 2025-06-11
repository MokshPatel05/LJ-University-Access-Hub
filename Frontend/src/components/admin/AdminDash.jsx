import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function AdminDash() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/6">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="w-5/6 p-6">
        <h1>Admin Dashboard</h1>
      </div>
    </div>
  );
}

export default AdminDash;
