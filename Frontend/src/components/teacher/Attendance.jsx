import { useState, useEffect } from "react";
import axios from "../../axios";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";

const Attendance = ({ onBackToDashboard }) => {
  const { id: teacherId } = useParams();
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState("");

  const presentCount = students.filter((s) => s.isPresent === true).length;
  const absentCount = students.filter((s) => s.isPresent === false).length;
  const totalCount = students.length;

  // Fetch today's classes
  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const res = await axios.get(`/api/teacher/${teacherId}/dashboard`);
        let classes = res.data.todaySchedule;
        if (!Array.isArray(classes)) {
          console.warn("todaySchedule is not an array:", classes);
          classes = [];
        }
        setTodayClasses(classes);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
        setTodayClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };
    if (teacherId) fetchClasses();
  }, [teacherId]);

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }
      setLoadingStudents(true);
      setError("");
      try {
        const classObj = todayClasses.find((cls) => cls._id === selectedClass);
        if (!classObj) {
          setError("Selected class not found.");
          setStudents([]);
          setLoadingStudents(false);
          return;
        }

        // FIX: Send date as string in YYYY-MM-DD format
        const istDateString = moment.tz("Asia/Kolkata").format("YYYY-MM-DD");

        console.log("Fetching students for date:", istDateString);

        const res = await axios.get("/api/attendance/students", {
          params: {
            teacherId,
            classId: selectedClass,
            date: istDateString, // Send as string, not Date object
          },
        });

        setStudents(
          res.data.map((student) => ({
            _id: student._id,
            id: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            isPresent: student.isPresent,
          }))
        );
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again.");
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedClass, todayClasses, teacherId]);

  const handleAttendanceChange = (studentId, isPresent) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, isPresent } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, isPresent: true })));
  };

  const markAllAbsent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, isPresent: false })));
  };

  const handleSaveAttendance = async () => {
    try {
      const classObj = todayClasses.find((c) => c._id === selectedClass);
      if (!classObj) {
        setError("Selected class not found.");
        return;
      }

      // FIX: Send date as string in YYYY-MM-DD format
      const istDateString = moment.tz("Asia/Kolkata").format("YYYY-MM-DD");

      console.log("Saving attendance for date:", istDateString);

      const payload = {
        classId: selectedClass,
        subjectId: classObj.subject._id || classObj.subject,
        date: istDateString, // Send as string, not Date object
        students: students.map((s) => ({
          studentId: s.id,
          isPresent: s.isPresent,
        })),
      };

      console.log("Payload being sent:", payload);

      const response = await axios.post("/api/attendance/save", payload);
      console.log("Save response:", response.data);

      alert("Attendance saved successfully!");
    } catch (err) {
      console.error("Error saving attendance:", err);
      setError("Failed to save attendance. Please try again.");
      alert("Failed to save attendance.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0 bg-gray-50">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 mt-16">
        <div className="flex items-center space-x-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mark Attendance
            </h1>
            <p className="text-gray-600 mt-2">
              Select a class and mark attendance for students
            </p>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Select Class</span>
            </h3>
          </div>
          <div className="p-6">
            {loadingClasses ? (
              <p>Loading classes...</p>
            ) : (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Choose a class to mark attendance</option>
                {todayClasses.length === 0 ? (
                  <option value="">No classes available for today.</option>
                ) : (
                  todayClasses.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.time} -{" "}
                      {classItem.subject?.name || classItem.subject} (
                      {classItem.batch?.name || classItem.batch}) - Room{" "}
                      {classItem.room}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>
        </div>
        {selectedClass && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">
                      {presentCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-red-600">
                      {absentCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Student Attendance
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={markAllPresent}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                      Mark All Present
                    </button>
                    <button
                      onClick={markAllAbsent}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                      Mark All Absent
                    </button>
                    <button
                      onClick={handleSaveAttendance}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      <span>Save Attendance</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Roll Number
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Student Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingStudents ? (
                        <tr>
                          <td colSpan="4" className="py-6 text-center">
                            Loading students...
                          </td>
                        </tr>
                      ) : students.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-6 text-center">
                            No students found for this class.
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr
                            key={student.id}
                            className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium">
                              {student.rollNumber}
                            </td>
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4">
                              {student.isPresent === null && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                  Not Marked
                                </span>
                              )}
                              {student.isPresent === true && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Present
                                </span>
                              )}
                              {student.isPresent === false && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                  Absent
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleAttendanceChange(student.id, true)
                                  }
                                  className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${student.isPresent === true
                                    ? "bg-green-600 text-white"
                                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() =>
                                    handleAttendanceChange(student.id, false)
                                  }
                                  className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${student.isPresent === false
                                    ? "bg-red-600 text-white"
                                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div >
  );
};

export default Attendance;