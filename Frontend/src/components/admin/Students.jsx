import React, { useState, useEffect } from "react";
import { Plus, Upload, Users, Search, X, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import Sidebar from "./Sidebar";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    rollNumber: "",
    year: "",
    department: "",
    batch: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // Get admin ID from localStorage or use fallback
  const getAdminId = () => {
    return localStorage.getItem("userId") || "507f1f77bcf86cd799439011";
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Fetch students and batches after admin data is loaded
  useEffect(() => {
    if (adminData) {
      fetchStudents();
      fetchBatches();
    }
  }, [adminData]);

  // Set department when adminData is loaded
  useEffect(() => {
    if (adminData?.div) {
      setFormData((prev) => ({
        ...prev,
        department: adminData.div,
      }));
    }
  }, [adminData]);

  const fetchAdminData = async () => {
    try {
      const adminId = getAdminId();
      const adminResponse = await axios.get(
        `http://localhost:8080/api/admin/${adminId}`
      );
      setAdminData(adminResponse.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      // Set default admin data if fetch fails
      setAdminData({
        _id: getAdminId(),
        div: "SY2",
        name: "Admin",
        year: "2024",
      });
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Using your existing API endpoint
      const res = await axios.get("http://localhost:8080/api/students");
      setStudents(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again.");
      // Set empty array as fallback
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const adminId = getAdminId();
      const year = adminData?.year || "2024"; // Use admin's year or default

      const res = await axios.get(
        `http://localhost:8080/api/batches/${adminId}?year=${year}`
      );
      setBatches(res.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setError("Failed to fetch batches. Please try again.");
      setBatches([]);
    }
  };

  const years = ["1", "2", "3", "4"];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = async () => {
    const { name, enrollmentNumber, rollNumber, year, department, batch } =
      formData;

    if (
      !name ||
      !enrollmentNumber.trim() ||
      !rollNumber ||
      !year ||
      !department ||
      !batch
    ) {
      setError("All fields are required.");
      return;
    }

    if (!adminData) {
      setError("Admin data not available. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);

      const newStudent = {
        name,
        enrollmentNumber: enrollmentNumber.trim(),
        rollNumber,
        year,
        department,
        batch,
        adminId: adminData._id,
      };

      console.log("Sending student payload:", newStudent);

      // Using your existing API endpoint
      const res = await axios.post(
        "http://localhost:8080/api/students",
        newStudent
      );

      await Promise.all([fetchStudents(), fetchBatches()]);

      setFormData({
        name: "",
        enrollmentNumber: "",
        rollNumber: "",
        year: "",
        department: adminData.div,
        batch: "",
      });
      setShowAddForm(false);
      setError(null);
    } catch (error) {
      console.error("Error adding student:", error.response?.data);
      setError(
        error.response?.data?.error ||
          "Failed to add student. Please check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setLoading(true);
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const studentsToUpload = jsonData.map((row) => ({
            name: row.name || row.Name || "",
            enrollmentNumber:
              row.enrollmentNumber || row["Enrollment Number"] || "",
            rollNumber: row.rollNumber || row["Roll Number"] || "",
            year: row.year || row.Year || "",
            department: adminData.div,
            batch: row.batch || row.Batch || "",
          }));

          const adminId = getAdminId();

          // Using your existing bulk upload endpoint
          const res = await axios.post(
            "http://localhost:8080/api/students/bulk",
            {
              students: studentsToUpload,
              adminId: adminData._id,
            }
          );

          await Promise.all([fetchStudents(), fetchBatches()]);

          setError(
            res.data.errors
              ? `${res.data.message}, ${res.data.errors.length} failed`
              : res.data.message
          );
        } catch (error) {
          console.error("Error uploading students:", error);
          setError("Failed to upload students. Please check the file format.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/students/${id}`);
      await Promise.all([fetchStudents(), fetchBatches()]);
      setError(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getBatches = () => {
    // Filter batches by admin's department
    const departmentBatches = batches.filter(
      (batch) => batch.department === adminData?.div
    );

    return departmentBatches
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((batch) => ({
        name: batch.name,
        count: batch.students ? batch.students.length : 0,
        department: batch.department,
        year: batch.year,
      }));
  };

  const getStudentsByBatch = (batchName) => {
    return students
      .filter(
        (student) =>
          student.batch === batchName &&
          student.department === adminData?.div &&
          (searchTerm === "" ||
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.enrollmentNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const filteredBatches = getBatches().filter(
    (batch) =>
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      students.some(
        (student) =>
          student.batch === batch.name &&
          student.department === adminData?.div &&
          (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.enrollmentNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
  );

  // Get available batches for dropdown (filter by admin's department)
  const getAvailableBatches = () => {
    return batches
      .filter((batch) => batch.department === adminData?.div)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="flex">
      <div className="w-64 flex-shrink-0 bg-white border-r border-blue-200">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-white p-6 mt-16 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Error/Success Message */}
          {error && (
            <div
              className={`${
                error.includes("successfully")
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-red-100 border-red-500 text-red-700"
              } border-l-4 p-4 mb-6 rounded-lg`}>
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-lg">
              Processing...
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Student Management
                </h1>
                <p className="text-gray-600">
                  Manage students for {adminData?.div || "Loading..."}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      students.filter((s) => s.department === adminData?.div)
                        .length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {getBatches().length}
                  </p>
                  <p className="text-sm text-gray-600">Batches</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus size={20} />
                  <span>Add Student</span>
                </button>

                <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 cursor-pointer transition-colors">
                  <Upload size={20} />
                  <span>Upload Excel</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search students or batches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {selectedBatch && (
                  <button
                    onClick={() => setSelectedBatch(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <X size={16} />
                    <span>Back to Batches</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add Student Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Add New Student
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enrollment Number *
                    </label>
                    <input
                      type="text"
                      name="enrollmentNumber"
                      value={formData.enrollmentNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch *
                    </label>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Batch</option>
                      {getAvailableBatches().map((batch) => (
                        <option key={batch._id} value={batch.name}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleAddStudent}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors">
                      {loading ? "Adding..." : "Add Student"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          {!selectedBatch ? (
            /* Batch Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBatches.map((batch) => (
                <div
                  key={batch.name}
                  onClick={() => setSelectedBatch(batch.name)}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Users className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {batch.name}
                        </h3>
                        <p className="text-gray-600">
                          {batch.department} - {batch.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {getStudentsByBatch(batch.name).length}
                      </p>
                      <p className="text-sm text-gray-600">Students</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {getStudentsByBatch(batch.name)
                      .slice(0, 3)
                      .map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>{student.name}</span>
                        </div>
                      ))}
                    {getStudentsByBatch(batch.name).length > 3 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +{getStudentsByBatch(batch.name).length - 3} more
                        students
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Click to view all students</span>
                      <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        {getStudentsByBatch(batch.name).length} students
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredBatches.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No batches found
                  </h3>
                  <p className="text-gray-500">
                    Add students to create batches
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Students List View */
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Batch {selectedBatch}
                    </h2>
                    <p className="text-gray-600">
                      {getStudentsByBatch(selectedBatch).length} students
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="text-blue-600" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getStudentsByBatch(selectedBatch).map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.enrollmentNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => deleteStudent(student._id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 disabled:text-red-400 ml-2">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {getStudentsByBatch(selectedBatch).length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No students found
                    </h3>
                    <p className="text-gray-500">
                      No students match your search criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
