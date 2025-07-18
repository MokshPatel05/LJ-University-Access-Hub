import { useState, useEffect } from "react";
import {
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  ChevronDown,
  Calendar,
} from "lucide-react";
import Sidebar from "./Sidebar"; // Adjust path based on your project structure
import axios from "../../axios"; // Adjust path to your axios instance
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AttendanceDownload = () => {
  const { id: adminId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const currentDayData = attendanceData.find(day => day.date === selectedDate) || {
    date: selectedDate,
    totalTeachers: 0,
    submittedCount: 0,
    pendingCount: 0,
    allSubmitted: false,
    submissions: [],
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!adminId) return;
      setLoading(true);
      try {
        const res = await axios.get("/api/attendance/daily-report", {
          params: { adminId, date: selectedDate },
        });
        setAttendanceData(prev => {
          const existingData = prev.filter(day => day.date !== selectedDate);
          return [...existingData, res.data];
        });
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [adminId, selectedDate]);

  const showToast = (title, description, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${type === "success" ? "bg-green-600" : "bg-red-600"}`;
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

    // Change PDF format to A3 landscape for more width
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [420, 297] });
    const pageWidth = doc.internal.pageSize.width;
    const leftColX = 14;
    const rightColX = pageWidth / 2 + 7;
    const colWidth = (pageWidth - 28) / 2 - 7;
    const dateObj = new Date(dayData.date);
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const dayName = dateObj.toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase();

    // Draw light pink background and lines for college details header, aligned with tables
    const headerTopY = 8;
    const headerBottomY = 42;
    // Calculate the left and right bounds to match the full width of both columns
    const headerLeftX = leftColX;
    const headerRightX = rightColX + colWidth;
    doc.setFillColor(255, 204, 204); // light pink
    doc.rect(headerLeftX, headerTopY, headerRightX - headerLeftX, headerBottomY - headerTopY, 'F');
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(headerLeftX, headerTopY, headerRightX, headerTopY); // top line
    doc.line(headerLeftX, headerBottomY, headerRightX, headerBottomY); // bottom line

    // Centering for A3 landscape (width 420mm, so center is 210)
    const centerX = 210;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("L J Institute of Engineering and Technology/L J K University", centerX, 18, { align: "center" });
    doc.text("Department:- SY CE/IT-2", centerX, 25, { align: "center" });
    doc.text("Batch:- B1 to B8 Daily Absent No.", centerX, 32, { align: "center" });
    doc.text(`Date:- ${formattedDate} (${dayName})`, centerX, 39, { align: "center" });

    const groupByBatch = (submissions) => {
      return submissions.reduce((acc, submission) => {
        if (!acc[submission.batch]) acc[submission.batch] = [];
        acc[submission.batch].push(submission);
        return acc;
      }, {});
    };

    const batchWiseData = groupByBatch(dayData.submissions);
    const batches = Object.keys(batchWiseData).sort();

    let currentY = 50;
    let leftY = currentY;
    let rightY = currentY;

    for (let i = 0; i < batches.length; i += 2) {
      const leftBatch = batches[i];
      const rightBatch = batches[i + 1];

      if (leftBatch) {
        const leftLectures = batchWiseData[leftBatch];
        doc.setFontSize(10);
        // Draw light blue background for batch name
        doc.setFillColor(204, 229, 255); // light blue
        doc.rect(leftColX, leftY, colWidth, 7, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`Batch: ${leftBatch}`, leftColX + colWidth / 2, leftY + 5, { align: "center" });
        leftY += 7;

        const tableHeaders = ["Lec No.", "Subject", "Faculty", "Absent Nos."];
        // Set thin black border for all table borders
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.setFillColor(200, 200, 200);
        doc.rect(leftColX, leftY, colWidth, 6, 'F');
        doc.rect(leftColX, leftY, colWidth, 6, 'S');

        // Update column width calculations for more space for 'Absent Nos.'
        const colWidths = [colWidth * 0.12, colWidth * 0.20, colWidth * 0.18, colWidth * 0.50]; // Make 'Absent Nos.' 50% of colWidth
        let headerX = leftColX;

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        tableHeaders.forEach((header, idx) => {
          doc.text(header, headerX + colWidths[idx] / 2, leftY + 4, { align: 'center' });
          if (idx < tableHeaders.length - 1) {
            doc.line(headerX + colWidths[idx], leftY, headerX + colWidths[idx], leftY + 6);
          }
          headerX += colWidths[idx];
        });

        leftY += 6;
        doc.setFont("helvetica", "normal");
        leftLectures.forEach((lecture, idx) => {
          const rowHeightBase = 6;
          let absentText = "-";
          if (Array.isArray(lecture.absentStudents)) {
            if (lecture.absentStudents.length === 0) {
              absentText = "NIL";
            } else if (lecture.absentStudents.length === lecture.totalStudents) {
              absentText = "All Absent";
            } else {
              absentText = lecture.absentStudents.join(", ");
            }
          }
          // Remove maxLines limit so all absent numbers are shown
          const absentLines = doc.splitTextToSize(absentText, colWidths[3] - 4);
          // const maxLines = 3; // REMOVE this line
          // const linesToShow = absentLines.slice(0, maxLines); // REMOVE this line
          const linesToShow = absentLines; // Show all lines
          const rowHeight = rowHeightBase * linesToShow.length;

          if (idx % 2 === 1) {
            doc.setFillColor(240, 240, 240);
            doc.rect(leftColX, leftY, colWidth, rowHeight, 'F');
          }
          // Set thin black border for all table borders
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.3);
          doc.rect(leftColX, leftY, colWidth, rowHeight, 'S');

          const cellData = [
            `${idx + 1}`,
            lecture.subject,
            lecture.teacher,
            linesToShow.join("\n"),
          ];
          let cellX = leftColX;
          cellData.forEach((data, cellIdx) => {
            const cellWidth = colWidths[cellIdx];
            if (cellIdx === 3 && linesToShow.length > 1) {
              // Absent Nos. column, left align as before
              linesToShow.forEach((line, lineIdx) => {
                // Center 'All Absent' or 'NIL' if that's the only line
                if (linesToShow.length === 1 && (line === 'All Absent' || line === 'NIL')) {
                  doc.text(line, cellX + cellWidth / 2, leftY + 4 + lineIdx * rowHeightBase, { align: 'center' });
                } else {
                  doc.text(line, cellX + 2, leftY + 4 + lineIdx * rowHeightBase);
                }
              });
            } else if (cellIdx === 3) {
              // Center 'All Absent' or 'NIL' if that's the only line
              if (linesToShow.length === 1 && (linesToShow[0] === 'All Absent' || linesToShow[0] === 'NIL')) {
                doc.text(data, cellX + cellWidth / 2, leftY + 4, { align: 'center' });
              } else {
                doc.text(data, cellX + 2, leftY + 4);
              }
            } else {
              // Center Lec No., Subject, Faculty with less padding
              doc.text(data, cellX + cellWidth / 2, leftY + 4, { align: 'center' });
            }
            if (cellIdx < cellData.length - 1) {
              doc.line(cellX + cellWidth, leftY, cellX + cellWidth, leftY + rowHeight);
            }
            cellX += cellWidth;
          });
          leftY += rowHeight;
        });

        leftY += 10;
      }

      if (rightBatch) {
        const rightLectures = batchWiseData[rightBatch];
        doc.setFontSize(10);
        // Draw light blue background for batch name
        doc.setFillColor(204, 229, 255); // light blue
        doc.rect(rightColX, rightY, colWidth, 7, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`Batch: ${rightBatch}`, rightColX + colWidth / 2, rightY + 5, { align: "center" });
        rightY += 7;

        const tableHeaders = ["Lec No.", "Subject", "Faculty", "Absent Nos."];
        // Set thin black border for all table borders
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.setFillColor(200, 200, 200);
        doc.rect(rightColX, rightY, colWidth, 6, 'F');
        doc.rect(rightColX, rightY, colWidth, 6, 'S');

        // Update column width calculations for more space for 'Absent Nos.'
        const colWidths = [colWidth * 0.12, colWidth * 0.20, colWidth * 0.18, colWidth * 0.50]; // Make 'Absent Nos.' 50% of colWidth
        let headerX = rightColX;

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        tableHeaders.forEach((header, idx) => {
          doc.text(header, headerX + colWidths[idx] / 2, rightY + 4, { align: 'center' });
          if (idx < tableHeaders.length - 1) {
            doc.line(headerX + colWidths[idx], rightY, headerX + colWidths[idx], rightY + 6);
          }
          headerX += colWidths[idx];
        });

        rightY += 6;
        doc.setFont("helvetica", "normal");
        rightLectures.forEach((lecture, idx) => {
          const rowHeightBase = 6;
          let absentText = "-";
          if (Array.isArray(lecture.absentStudents)) {
            if (lecture.absentStudents.length === 0) {
              absentText = "NIL";
            } else if (lecture.absentStudents.length === lecture.totalStudents) {
              absentText = "All Absent";
            } else {
              absentText = lecture.absentStudents.join(", ");
            }
          }
          // Remove maxLines limit so all absent numbers are shown
          const absentLines = doc.splitTextToSize(absentText, colWidths[3] - 4);
          // const maxLines = 3; // REMOVE this line
          // const linesToShow = absentLines.slice(0, maxLines); // REMOVE this line
          const linesToShow = absentLines; // Show all lines
          const rowHeight = rowHeightBase * linesToShow.length;

          if (idx % 2 === 1) {
            doc.setFillColor(240, 240, 240);
            doc.rect(rightColX, rightY, colWidth, rowHeight, 'F');
          }
          // Set thin black border for all table borders
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.3);
          doc.rect(rightColX, rightY, colWidth, rowHeight, 'S');

          const cellData = [
            `${idx + 1}`,
            lecture.subject,
            lecture.teacher,
            linesToShow.join("\n"),
          ];
          let cellX = rightColX;
          cellData.forEach((data, cellIdx) => {
            const cellWidth = colWidths[cellIdx];
            if (cellIdx === 3 && linesToShow.length > 1) {
              // Absent Nos. column, left align as before
              linesToShow.forEach((line, lineIdx) => {
                // Center 'All Absent' or 'NIL' if that's the only line
                if (linesToShow.length === 1 && (line === 'All Absent' || line === 'NIL')) {
                  doc.text(line, cellX + cellWidth / 2, rightY + 4 + lineIdx * rowHeightBase, { align: 'center' });
                } else {
                  doc.text(line, cellX + 2, rightY + 4 + lineIdx * rowHeightBase);
                }
              });
            } else if (cellIdx === 3) {
              // Center 'All Absent' or 'NIL' if that's the only line
              if (linesToShow.length === 1 && (linesToShow[0] === 'All Absent' || linesToShow[0] === 'NIL')) {
                doc.text(data, cellX + cellWidth / 2, rightY + 4, { align: 'center' });
              } else {
                doc.text(data, cellX + 2, rightY + 4);
              }
            } else {
              // Center Lec No., Subject, Faculty with less padding
              doc.text(data, cellX + cellWidth / 2, rightY + 4, { align: 'center' });
            }
            if (cellIdx < cellData.length - 1) {
              doc.line(cellX + cellWidth, rightY, cellX + cellWidth, rightY + rowHeight);
            }
            cellX += cellWidth;
          });
          rightY += rowHeight;
        });

        rightY += 10;
      }

      currentY = Math.max(leftY, rightY);
      leftY = currentY;
      rightY = currentY;

      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
        leftY = currentY;
        rightY = currentY;
      }
    }

    doc.save(`Daily_Absent_students${formattedDate.replace(/\//g, "_")}_B1_TO_B8.pdf`);
    showToast(
      "Download Started",
      `Downloading daily absent report for ${formattedDate}`
    );
  };

  const handleIndividualDownload = (submission) => {
    const headers = ['Date', 'Subject', 'Teacher', 'Batch', 'Lecture No.', 'Absent Students'];
    const row = [
      submission.date,
      submission.subject,
      submission.teacher,
      submission.batch,
      submission.lectureNo.toString(),
      submission.absentStudents.join('; ')
    ];

    const csvContent = [headers, row]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
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

  const uniqueBatches = [
    "all",
    ...new Set(currentDayData.submissions.map((s) => s.batch)),
  ];

  const uniqueDates = [...new Set(attendanceData.map(day => day.date))];

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0 bg-gray-50">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 space-y-6 mt-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600 mt-2">Track attendance submissions and download daily reports</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : (
          currentDayData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Teachers</p>
                    <p className="text-2xl font-bold text-blue-600">{currentDayData.totalTeachers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="text-2xl font-bold text-green-600">{currentDayData.submittedCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">{currentDayData.pendingCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`text-lg font-bold ${currentDayData.allSubmitted ? 'text-green-600' : 'text-orange-600'}`}>
                      {currentDayData.allSubmitted ? 'Complete' : 'Incomplete'}
                    </p>
                  </div>
                  {currentDayData.allSubmitted && (
                    <button
                      onClick={() => handleDownloadAttendanceSheet(currentDayData)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Sheet
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        )}

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter Submissions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                <div className="relative">
                  <button
                    onClick={() => setBatchDropdownOpen(!batchDropdownOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <span>{filterBatch === "all" ? "All batches" : filterBatch}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                  {batchDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                      {uniqueBatches.map((batch) => (
                        <button
                          key={batch}
                          onClick={() => {
                            setFilterBatch(batch);
                            setBatchDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          {batch === "all" ? "All batches" : batch}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
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

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-500">Loading submissions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSubmissions.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-12 text-center">
                  <p className="text-gray-500">No submissions found for the selected filters.</p>
                </div>
              </div>
            )}
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
                              <span className="text-green-600 font-medium">Submitted</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-red-600 font-medium">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Attendance</p>
                        <p className="font-medium text-green-600">
                          {submission.presentStudents}/{submission.totalStudents} ({submission.attendanceRate?.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                  {submission.submitted && submission.absentStudents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Absent Students:</p>
                      <div className="flex flex-wrap gap-2">
                        {submission.absentStudents.map((student, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
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
      </div>
    </div>
  );
};

export default AttendanceDownload;