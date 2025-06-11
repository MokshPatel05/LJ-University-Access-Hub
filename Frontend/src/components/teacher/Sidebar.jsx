import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { id } = useParams();
  const location = useLocation();

  const linkClasses = (path) =>
    `flex items-center p-2 pl-4 rounded-md font-medium text-sm no-underline whitespace-nowrap transition-all text-decoration-none ${
      location.pathname === path
        ? "bg-green-100 text-green-600 border-l-4 border-green-600"
        : "text-gray-600 hover:bg-green-100 hover:text-green-600 hover:border-l-4 hover:border-green-600"
    }`;

  return (
    <div
      className="fixed top-16 left-0 h-screen w-64 border-r overflow-hidden z-10"
      style={{
        backgroundColor: "rgb(255,255,255)",
        borderRightColor: "rgb(209,213,219)",
      }}
    >
      <div
        className="border-b p-4 font-bold text-lg"
        style={{
          borderBottomColor: "rgb(209,213,219)",
          color: "rgb(31,41,55)",
        }}
      >
        Admin Panel
      </div>
      <div className="p-4 flex flex-col space-y-1">
        <div>
          <Link
            to={`/teachDash/${id}`}
            className={linkClasses(`/teachDash/${id}`)}
            style={{ color: "rgb(75,85,99)" }}
          >
            <i className="fa-brands fa-squarespace fa-lg pr-2"></i>
            Dashboard
          </Link>
        </div>
        <div>
          <Link
            to={`/teachDash/${id}/schedule`}
            className={linkClasses(`/teachDash/${id}/schedule`)}
            style={{ color: "rgb(75,85,99)" }}
          >
            <i className="fa-regular fa-calendar fa-lg pr-2"></i>
            Daily Schedule
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;