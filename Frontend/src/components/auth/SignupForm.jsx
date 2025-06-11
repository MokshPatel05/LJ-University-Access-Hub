import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";

function SignupForm() {
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !year ||
      !semester ||
      !department
    ) {
      alert("Please fill in all required fields!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form submitted:", {
      email,
      password,
      selectedRole,
      year,
      semester,
      department,
      firstName,
      lastName,
    });
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
    setSemester(""); // Reset semester when year changes
    setDepartment(""); // Reset department when year changes
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  // Define semesters based on selected year
  const semesterOptions = {
    "1st Year": ["1st Semester", "2nd Semester"],
    "2nd Year": ["3rd Semester", "4th Semester"],
    "3rd Year": ["5th Semester", "6th Semester"],
    "4th Year": ["7th Semester", "8th Semester"],
  };

  // Define departments based on selected year
  const departmentOptions = {
    "1st Year": ["FY1", "FY2", "FY3", "FY4", "FY5"],
    "2nd Year": ["SY1", "SY2", "SY3", "SY4", "SY5"],
    "3rd Year": ["TY1", "TY2", "TY3", "TY4", "TY5"],
    "4th Year": ["FFY1", "FFY2", "FFY3", "FFY4", "FFY5"],
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
          className="flex justify-center gap-12 text-white text-sm"
          style={{ fontFamily: "-moz-initial" }}>
          <span>Students</span>
          <span>Faculty</span>
          <span>Courses</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-3/5 bg-blue-50 flex items-center justify-center">
        <div className="p-10 bg-white rounded-xl shadow-lg w-full max-w-xl flex flex-col items-center justify-center my-5">
          <img
            src="/logo.jpeg"
            alt="LJ University logo"
            style={{ height: "6rem" }}
          />
          <div className="font-bold text-3xl" style={{ color: "#084C83" }}>
            LJ University Access Hub
          </div>
          <div className="text-lg" style={{ color: "#4B5563" }}>
            Sign up to access LJ University portal
          </div>
          <div className="h-4" />

          {/* Signup Form */}
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Role Selection Cards */}
            <div className="font-bold text-lg mb-2">Select Role</div>
            <div className="flex justify-center gap-4 mb-4">
              <Card
                className={`cursor-pointer ${
                  selectedRole === "admin"
                    ? "border-4 border-blue-500"
                    : "border border-gray-200"
                }`}
                sx={{
                  maxWidth: 200,
                  borderRadius: "0.5rem",
                  padding: "1rem",
                }}
                onClick={() => handleRoleChange("admin")}>
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <FontAwesomeIcon
                    icon={faUserShield}
                    className="text-yellow-500 text-4xl mb-2"
                  />
                  <Typography variant="h6">Admin</Typography>
                  <div className="h-4" />
                  <Typography variant="body2" color="textSecondary">
                    System <br />
                    configuration and management
                  </Typography>
                </CardContent>
              </Card>
            </div>

            {/* Admin User Name */}
            <div className="font-bold text-lg mb-2">Admin User Name</div>
            <div className="flex flex-row justify-between gap-4 mb-4">
              <div className="w-1/2">
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  required
                />
              </div>
              <div className="w-1/2">
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="font-bold text-lg mb-2">Email</div>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              required
            />

            {/* Password */}
            <div className="font-bold text-lg mb-2">Password</div>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              required
            />

            {/* Confirm Password */}
            <div className="font-bold text-lg mb-2">Confirm Password</div>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              required
            />

            {/* Academic Details */}
            <div className="font-bold text-lg mb-2">Academic Details</div>
            <div className="flex flex-row justify-between gap-4 mb-4">
              <div className="w-1/3">
                <FormControl variant="standard" sx={{ m: 1, minWidth: 130 }}>
                  <InputLabel id="year-select-label">Academic Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={year}
                    onChange={handleYearChange}
                    label="Academic Year"
                    required>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="1st Year">1st Year</MenuItem>
                    <MenuItem value="2nd Year">2nd Year</MenuItem>
                    <MenuItem value="3rd Year">3rd Year</MenuItem>
                    <MenuItem value="4th Year">4th Year</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="w-1/3">
                <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel id="semester-select-label">Semester</InputLabel>
                  <Select
                    labelId="semester-select-label"
                    id="semester-select"
                    value={semester}
                    onChange={handleSemesterChange}
                    label="Semester"
                    disabled={!year}
                    required>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {year &&
                      semesterOptions[year].map((sem) => (
                        <MenuItem key={sem} value={sem}>
                          {sem}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              <div className="w-1/3">
                <FormControl variant="standard" sx={{ m: 1, minWidth: 110 }}>
                  <InputLabel id="department-select-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="department-select-label"
                    id="department-select"
                    value={department}
                    onChange={handleDepartmentChange}
                    label="Department"
                    disabled={!year}
                    required>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {year &&
                      departmentOptions[year].map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-4">
              <a
                href="#"
                className="text-blue-600 text-sm hover:underline"
                style={{ color: "#0270C2", fontWeight: "400" }}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="mb-4 font-bold text-sm"
              style={{
                backgroundColor: "#084C83",
                color: "white",
                padding: "0.6rem",
                borderRadius: "0.6rem",
                fontWeight: "600",
              }}>
              Sign Up
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-blue-600 hover:underline font-bold">
                  Login here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
