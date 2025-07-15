//will complete it at the last.

import { useState } from "react";
import {
  Download,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  ChevronDown,
} from "lucide-react";
import Sidebar from "./Sidebar"; // Adjust path based on your project structure

const AttendanceDownload = () => {
  const [attendanceData] = useState([
    {
      date: "2024-12-06",
      totalTeachers: 8,
      submittedCount: 8,
      pendingCount: 0,
      allSubmitted: true,
      submissions: [
        {
          id: "1",
          teacher: "MSS",
          subject: "DM",
          batch: "B1",
          date: "2024-12-06",
          submitted: true,
          submittedAt: "10:30 AM",
          totalStudents: 30,
          presentStudents: 28,
          attendanceRate: 93.3,
          absentStudents: ["15", "30"],
        },
        {
          id: "2",
          teacher: "PDO",
          subject: "TOC",
          batch: "B1",
          date: "2024-12-06",
          submitted: true,
          submittedAt: "11:45 AM",
          totalStudents: 30,
          presentStudents: 28,
          attendanceRate: 93.3,
          absentStudents: ["15", "30"],
        },
        {
          id: "3",
          teacher: "VHA",
          subject: "PYTHON-2",
          batch: "B1",
          date: "2024-12-06",
          submitted: true,
          submittedAt: "2:15 PM",
          totalStudents: 30,
          presentStudents: 27,
          attendanceRate: 90.0,
          absentStudents: ["15", "23", "30"],
        },
        {
          id: "4",
          teacher: "NAS",
          subject: "FSD-2",
          batch: "B2",
          date: "2024-12-06",
          submitted: true,
          submittedAt: "9:30 AM",
          totalStudents: 28,
          presentStudents: 25,
          attendanceRate: 89.3,
          absentStudents: ["38", "41", "43", "54"],
        },
        {
          id: "5",
          teacher: "DPS",
          subject: "FSD-2",
          batch: "B2",
          date: "2024-12-06",
          submitted: true,
          submittedAt: "10:45 AM",
          totalStudents: 28,
          presentStudents: 25,
          attendanceRate: 89.3,
          absentStudents: ["38", "43", "54"],
        },
        {
          id: "6",
          teacher: "SSD",
          subject: "COA",
          batch: "B2",
          date: "2024-12-06",
          submitted: true,
          submittedAt: "1:20 PM",
          totalStudents: 28,
          presentStudents: 24,
          attendanceRate: 85.7,
          absentStudents: ["38", "43", "52", "54"],
        },
        {
          id: "7",
          teacher: "DDP",
          subject: "DM",
          batch: "B2",
          date: "2024-12-06",
          submitted: true,
          submittedAt: "3:10 PM",
          totalStudents: 28,
          presentStudents: 20,
          attendanceRate: 71.4,
          absentStudents: [
            "37",
            "38",
            "43",
            "51",
            "52",
            "54",
            "63",
            "65",
            "66",
            "68",
            "69",
            "70",
            "72",
          ],
        },
        {
          id: "8",
          teacher: "TAT",
          subject: "PYTHON-2",
          batch: "B4",
          date: "2024-12-06",
          submitted: true,
          submittedAt: "4:30 PM",
          totalStudents: 25,
          presentStudents: 22,
          attendanceRate: 88.0,
          absentStudents: ["117", "123", "132"],
        },
      ],
    },
    {
      date: "2024-12-05",
      totalTeachers: 6,
      submittedCount: 4,
      pendingCount: 2,
      allSubmitted: false,
      submissions: [
        {
          id: "9",
          teacher: "MSS",
          subject: "DM",
          batch: "B1",
          date: "2024-12-05",
          submitted: true,
          submittedAt: "10:15 AM",
          totalStudents: 30,
          presentStudents: 29,
          attendanceRate: 96.7,
          absentStudents: ["23"],
        },
        {
          id: "10",
          teacher: "PDO",
          subject: "TOC",
          batch: "B1",
          date: "2024-12-05",
          submitted: false,
          totalStudents: 30,
          presentStudents: 0,
          attendanceRate: 0,
          absentStudents: [],
        },
        {
          id: "11",
          teacher: "VHA",
          subject: "PYTHON-2",
          batch: "B1",
          date: "2024-12-05",
          submitted: true,
          submittedAt: "2:30 PM",
          totalStudents: 30,
          presentStudents: 28,
          attendanceRate: 93.3,
          absentStudents: ["15", "30"],
        },
        {
          id: "12",
          teacher: "NAS",
          subject: "FSD-2",
          batch: "B2",
          date: "2024-12-05",
          submitted: true,
          submittedAt: "11:20 AM",
          totalStudents: 28,
          presentStudents: 26,
          attendanceRate: 92.9,
          absentStudents: ["38", "54"],
        },
        {
          id: "13",
          teacher: "DPS",
          subject: "FSD-2",
          batch: "B2",
          date: "2024-12-05",
          submitted: true,
          submittedAt: "1:45 PM",
          totalStudents: 28,
          presentStudents: 27,
          attendanceRate: 96.4,
          absentStudents: ["43"],
        },
        {
          id: "14",
          teacher: "SSD",
          subject: "COA",
          batch: "B2",
          date: "2024-12-05",
          submitted: false,
          totalStudents: 28,
          presentStudents: 0,
          attendanceRate: 0,
          absentStudents: [],
        },
      ],
    },
  ]);

  const [selectedDate, setSelectedDate] = useState("2024-12-06");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);

  const currentDayData = attendanceData.find(
    (day) => day.date === selectedDate
  );

  const showToast = (title, description, type = "success") => {
    // Simple toast implementation
    const toast = document.createElement(" div");
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

    generateAttendanceSheet(dayData);

    showToast(
      "Download Started",
      `Downloading attendance sheet for ${new Date(
        dayData.date
      ).toLocaleDateString()}`
    );
  };

  const generateAttendanceSheet = (dayData) => {
    const headers = [
      "Date",
      "Subject",
      "Teacher",
      "Batch",
      "Total Students",
      "Present",
      "Absent",
      "Attendance %",
      "Absent Students",
    ];

    const rows = dayData.submissions
      .filter((submission) => submission.submitted)
      .map((submission) => [
        dayData.date,
        submission.subject,
        submission.teacher,
        submission.batch,
        submission.totalStudents.toString(),
        submission.presentStudents.toString(),
        (submission.totalStudents - submission.presentStudents).toString(),
        `${submission.attendanceRate.toFixed(1)}%`,
        submission.absentStudents.join("; "),
      ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-sheet-${dayData.date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleIndividualDownload = (submission) => {
    const headers = [
      "Date",
      "Subject",
      "Teacher",
      "Batch",
      "Total Students",
      "Present",
      "Attendance %",
      "Absent Students",
    ];
    const row = [
      submission.date,
      submission.subject,
      submission.teacher,
      submission.batch,
      submission.totalStudents.toString(),
      submission.presentStudents.toString(),
      `${submission.attendanceRate.toFixed(1)}%`,
      submission.absentStudents.join("; "),
    ];

    const csvContent = [headers, row]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${submission.subject}-${submission.batch}-${submission.date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showToast(
      "Download Started",
      `Downloading attendance for ${submission.subject} - ${submission.batch}`
    );
  };

  const filteredSubmissions =
    currentDayData?.submissions.filter((submission) => {
      return (
        (filterBatch === "all" || submission.batch === filterBatch) &&
        (!filterTeacher ||
          submission.teacher
            .toLowerCase()
            .includes(filterTeacher.toLowerCase()))
      );
    }) || [];

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
              Track attendance submissions and download daily reports
            </p>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Select Date
            </h2>
          </div>
          <div className="p-6">
            <div className="relative max-w-xs">
              <button
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <span>
                  {attendanceData.find((day) => day.date === selectedDate)
                    ? `${new Date(selectedDate).toLocaleDateString()} - ${
                        selectedDate === "2024-12-06" ? "Thursday" : "Wednesday"
                      }`
                    : "Select date"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
              {dateDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {attendanceData.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setDateDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                      {new Date(day.date).toLocaleDateString()} -{" "}
                      {day.date === "2024-12-06" ? "Thursday" : "Wednesday"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Overview */}
        {currentDayData && (
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
                {currentDayData.allSubmitted && (
                  <button
                    onClick={() =>
                      handleDownloadAttendanceSheet(currentDayData)
                    }
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Download Sheet
                  </button>
                )}
              </div>
            </div>
          </div>
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
                      {["all", "B1", "B2", "B3", "B4"].map((batch) => (
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
                        {submission.presentStudents}/{submission.totalStudents}{" "}
                        ({submission.attendanceRate.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  {submission.submitted && (
                    <button
                      onClick={() => handleIndividualDownload(submission)}
                      className="ml-4 flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  )}
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

        {filteredSubmissions.length === 0 && (
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