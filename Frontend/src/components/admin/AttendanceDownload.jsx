import React from "react";
import Sidebar from "./Sidebar";

function AttendanceDownload() {
  return (
    <div className="flex min-h-screen mt-16">
      {/* Sidebar */}
      <div className="w-1/6">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="w-5/6 p-6">
        <h1>Downloaded</h1>
      </div>
    </div>
  );
}

export default AttendanceDownload;
