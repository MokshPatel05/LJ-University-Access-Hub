import { React, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

function LoginForm() {
  //for backend
  const [selectedRole, setSelectedRole] = useState(null); // Track selected role (teacher/admin)
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === "teacher") {
      console.log("Teacher Login:", { teacherId, password });
    } else if (selectedRole === "admin") {
      console.log("Admin Login:", { adminId, password });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div
        className="w-2/5 flex flex-col items-center justify-center p-6 rounded-r-2xl"
        style={{ backgroundColor: "#025A9E" }}>
        <div className="text-white text-4xl font-bold">
          Welcome to LJ University <br /> Access Hub
        </div>

        {/* Line break inserted here */}
        <div className="h-6" />

        <div className="text-white text-xl">
          Your gateway to educational resources,
          <br />
          course management, and administrative tools.
        </div>

        {/* Line break inserted here */}
        <div className="h-10" />

        <div className=" text-3xl font-bold" style={{ color: "#FFDB47" }}>
          10k+ &nbsp; 500+ &nbsp; 300+
        </div>
        <div
          className="flex justify-center gap-12 text-white text-m not-italic"
          style={{ fontFamily: "-moz-initial" }}>
          <span>Students</span>
          <span>Faculty</span>
          <span>Courses</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-3/5 bg-blue-50 flex items-center justify-center">
        <div className="p-10 bg-white rounded-xl shadow-lg w-full max-w-xl flex flex-col items-center justify-center my-3">
          <img
            src="/logo.jpeg"
            alt="LJ University logo"
            style={{ height: "6rem" }}
          />
          {/* added space */}
          <div className="h-5" />

          <div className="font-bold text-3xl" style={{ color: "#084C83" }}>
            LJ University Access Hub
          </div>
          {/* added space */}
          <div className="h-3" />

          <div className="text-lg" style={{ color: "#4B5563" }}>
            Sign in to access LJ University portal
          </div>
          <div className="h-6" />

          {/* Role Selection Cards */}
          <div className="flex gap-4 mb-6 ">
            <Card
              onClick={() => handleRoleSelect("teacher")}
              className={`cursor-pointer ${
                selectedRole === "teacher"
                  ? "border-4 border-blue-500"
                  : "border border-gray-200"
              }`}
              sx={{ maxWidth: 200, borderRadius: "0.5rem", padding: "1rem" }}>
              <CardContent className="flex flex-col items-center justify-center text-center">
                <FontAwesomeIcon
                  icon={faChalkboardTeacher}
                  className="text-green-500 text-4xl mb-2 "
                />
                <Typography variant="h6">Teacher</Typography>

                {/* added space */}
                <div className="h-4" />

                <Typography variant="body2" color="textSecondary">
                  Manage attendance and students <br /> grades
                </Typography>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleRoleSelect("admin")}
              className={`cursor-pointer ${
                selectedRole === "admin"
                  ? "border-4 border-blue-500"
                  : "border border-gray-200"
              }`}
              sx={{ maxWidth: 200, borderRadius: "0.5rem", padding: "1rem" }}>
              <CardContent className="flex flex-col items-center justify-center text-center">
                <FontAwesomeIcon
                  icon={faUserShield}
                  className="text-yellow-500 text-4xl mb-2"
                />
                <Typography variant="h6">Admin</Typography>

                {/* added space */}
                <div className="h-4" />

                <Typography variant="body2" color="textSecondary">
                  System <br />
                  configuration and management
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Login Form */}
          {selectedRole && (
            <form onSubmit={handleSubmit} className="w-full">
              {selectedRole === "teacher" ? (
                <>
                  <div className="font-bold text-lg">Teacher ID</div>
                  <TextField
                    fullWidth
                    label="Teacher ID"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <div className="font-bold text-lg">Password</div>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                </>
              ) : (
                <>
                  <div className="font-bold text-lg">Admin ID</div>
                  <TextField
                    fullWidth
                    label="Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                  <div className="font-bold text-lg">Password</div>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                </>
              )}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-blue-600 text-sm hover:underline text-decoration-none "
                  style={{ color: "#0270C2", fontWeight: "400" }}>
                  Forget password?
                </a>
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="mt-4 font-bold text-sm"
                style={{
                  backgroundColor: "#084C83",
                  color: "white",
                  padding: "0.6rem",
                  borderRadius: "0.6rem",
                  fontWeight: "600",
                }}>
                Sign in as {selectedRole}
              </Button>
            </form>
          )}
          {/* <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/auth/signup"
                className="text-blue-600 hover:underline font-bold text-decoration-none">
                Sign up here
              </Link>
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
