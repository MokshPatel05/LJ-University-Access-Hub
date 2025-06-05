import React from "react";
import {  Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-white border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <a href="/"><img src="logo.jpeg" alt="logo" /></a>
              </div>
              <div>
                <div className="text-lg font-bold text-stone-900 font-sans">
                  LJ University
                </div>
                <p className="text-xs text-gray-500">Access Portal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* <Link to="/auth/signup">
            <button
              className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-offset-2 border border-gray-300 bg-white text-gray-700 hover:bg-black hover:shadow-md hover:scale-105 px-3 py-1.75 text-sm"
              style={{ borderRadius: "0.38rem" }}>
              Sign up
            </button>
            </Link> */}
            {/* &nbsp;&nbsp; */}
            <Link to="/auth/login">
            <button
              className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-stone-950 text-white hover:shadow-md hover:scale-105 px-3 py-1.75 text-sm"
              style={{ borderRadius: "0.38rem" }}>
              Login
            </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
