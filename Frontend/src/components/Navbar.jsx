import React, { useState } from "react";
import { Link } from "react-router-dom";
import ResetPassword from "./ReserPassword";

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sample data for demonstration
  const sampleUserData = {
    username: "john_doe",
    password: "********", // Masked for display
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="bg-white border-b border-neutral-300 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <a href="/">
                  <img src="/logo.jpeg" alt="logo" />
                </a>
              </div>
              <div>
                <div className="text-lg font-bold text-stone-900 font-sans">
                  LJ University
                </div>
                <p className="text-xs text-gray-500">Access Portal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            <Link to="/auth/login">
              <button
                className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-stone-950 text-white hover:shadow-md hover:scale-105 px-3 py-1.75 text-sm"
                style={{ borderRadius: "0.38rem" }}
              >
                Login
              </button>
            </Link>

            <button
              onClick={toggleProfileDropdown}
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              style={{ borderRadius: "50%" }}
              aria-label="Profile"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-16 w-64 bg-white border border-neutral-300 rounded-md shadow-lg z-50 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <p className="text-sm text-gray-900">{sampleUserData.username}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <p className="text-sm text-gray-900">{sampleUserData.password}</p>
                </div>
                <div className="mb-4">
                  <Link
                    to="/reset-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Reset Password
                  </Link>
                </div>
                <button
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all duration-200"
                  onClick={() => {
                    // Add logout functionality here
                    setIsProfileOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;