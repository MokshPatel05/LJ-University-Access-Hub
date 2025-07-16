import { useState, useEffect } from "react";
import {
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  ChevronDown,
} from "lucide-react";
import Sidebar from "./Sidebar"; // Adjust path based on your project structure
import axios from "../../axios"; // Adjust path to your axios instance
import { useParams } from "react-router-dom";

const AttendanceDownload = () => {
  const { id: adminId } = useParams(); // Assuming adminId is passed via route
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set current date (July 15, 2025)
  const currentDate = "2025-07-15";

  const currentDayData = attendanceData[0] || {
    date: currentDate,
    totalTeachers: 0,
    submittedCount: 0,
    pendingCount: 0,
    allSubmitted: false,
    submissions: [],
  };

  // Fetch attendance data for current date
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!adminId) {
        setError("Admin ID is required.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/attendance/daily-report", {
          params: { adminId },
        });
        setAttendanceData([res.data]); // Wrap in array to match original structure
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to load attendance data.");
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [adminId]);

  const showToast = (title, description, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`;
    toast.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm">${description}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleDownloadAttendanceSheet = (dayData) => {
    if (!dayData.allSubmitted) {
      showToast(
        "Cannot Download",
        "Please wait for all teachers to submit their attendance before downloading the sheet.",
        "error"
      );
      return;
    }

    // Placeholder: To be implemented later
    showToast(
      "Download Started",
      `Downloading attendance sheet for ${new Date(
        dayData.date
      ).toLocaleDateString()}`
    );
  };

  const filteredSubmissions = currentDayData.submissions.filter(
    (submission) => {
      return (
        (filterBatch === "all" || submission.batch === filterBatch) &&
        (!filterTeacher ||
          submission.teacher
            .toLowerCase()
            .includes(filterTeacher.toLowerCase()))
      );
    }
  );

  // Get unique batches for filter dropdown
  const uniqueBatches = [
    "all",
    ...new Set(currentDayData.submissions.map((s) => s.batch)),
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-gray-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Attendance Management
            </h1>
            <p className="text-gray-600 mt-2">
              Track attendance submissions for{" "}
              {new Date(currentDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mt-6">
            {error}
          </div>
        )}

        {/* Daily Overview */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6 p-12 text-center">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : (
          currentDayData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Teachers</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentDayData.totalTeachers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="text-2xl font-bold text-green-600">
                      {currentDayData.submittedCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {currentDayData.pendingCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p
                      className={`text-lg font-bold ${
                        currentDayData.allSubmitted
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}>
                      {currentDayData.allSubmitted ? "Complete" : "Incomplete"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleDownloadAttendanceSheet(currentDayData)
                    }
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                    disabled={!currentDayData.allSubmitted}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Sheet
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter Submissions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch
                </label>
                <div className="relative">
                  <button
                    onClick={() => setBatchDropdownOpen(!batchDropdownOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <span>
                      {filterBatch === "all" ? "All batches" : filterBatch}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                  {batchDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      {uniqueBatches.map((batch) => (
                        <button
                          key={batch}
                          onClick={() => {
                            setFilterBatch(batch);
                            setBatchDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                          {batch === "all" ? "All batches" : batch}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher
                </label>
                <input
                  type="text"
                  placeholder="Search teacher..."
                  value={filterTeacher}
                  onChange={(e) => setFilterTeacher(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6 p-12 text-center">
            <p className="text-gray-500">Loading submissions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-6">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        <p className="font-medium">{submission.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teacher</p>
                        <p className="font-medium">{submission.teacher}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Batch</p>
                        <p className="font-medium">{submission.batch}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div className="flex items-center space-x-1">
                          {submission.submitted ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">
                                Submitted
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-red-600 font-medium">
                                Pending
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submitted At</p>
                        <p className="font-medium">
                          {submission.submittedAt || "Not submitted"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Attendance</p>
                        <p className="font-medium text-green-600">
                          {submission.presentStudents}/
                          {submission.totalStudents} (
                          {submission.attendanceRate.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                  {submission.submitted &&
                    submission.absentStudents.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">
                          Absent Students:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {submission.absentStudents.map((student, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              {student}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredSubmissions.length === 0 && !loading && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
            <div className="p-12 text-center">
              <p className="text-gray-500">
                No submissions found for the selected filters.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDownload;
