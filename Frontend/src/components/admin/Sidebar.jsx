import React from "react";
import { Link } from "react-router-dom";
import useUserId from "../../hooks/useUserId";

const Sidebar = () => {
  const userId = useUserId(); // get the user's id

  const linkClasses =
    "flex items-center p-2 pl-4 rounded-md font-medium text-sm text-gray-600 no-underline hover:bg-blue-100 hover:text-blue-600 hover:border-l-4 hover:border-blue-600 whitespace-nowrap transition-all text-decoration-none";

  return (
    <div className="fixed top-16 left-0 h-screen w-64 bg-white border-r border-neutral-300 overflow-hidden z-10">
      <div className="border-b border-neutral-300 p-4 font-bold text-lg">
        Admin Panel
      </div>
      <div className="p-4 flex flex-col space-y-1">
        <div>
          <Link
            to={`/adminDash/${userId}`}
            className={linkClasses}
            style={{ color: "#4B5563" }}>
            <i className="fa-brands fa-squarespace fa-lg pr-2"></i>
            Dashboard
          </Link>
        </div>
        <div>
          <Link
            to={`/adminDash/${userId}/daily-schedule`}
            className={linkClasses}
            style={{ color: "#4B5563" }}>
            <i className="fa-regular fa-calendar fa-lg pr-2"></i>
            Weekly Schedule
          </Link>
        </div>
        <div>
          <Link
            to={`/adminDash/${userId}/teacher-management`}
            className={linkClasses}
            style={{ color: "#4B5563" }}>
            <i className="fa-solid fa-users fa-lg pr-2"></i>
            Teacher Management
          </Link>
        </div>
        <div>
          <Link
            to={`/adminDash/${userId}/attendance/download`}
            className={linkClasses}
            style={{ color: "#4B5563" }}>
            <i className="fa-solid fa-download fa-lg pr-2"></i>
            Attendance Download
          </Link>
        </div>
        <div>
          <Link
            to={`/adminDash/${userId}/batch-management`}
            className={linkClasses}
            style={{ color: "#4B5563" }}>
            <i className="fa-solid fa-graduation-cap fa-lg pr-2"></i>
            Batch Management
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
