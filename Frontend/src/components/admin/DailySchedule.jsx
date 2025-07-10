import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const timeSlots = [
  { id: "1", time: "8:45 AM - 9:45 AM", label: "1st Lecture" },
  { id: "2", time: "9:45 AM - 10:45 AM", label: "2nd Lecture" },
  { id: "3", time: "10:45 AM - 11:30 AM", label: "Break", isBreak: true },
  { id: "4", time: "11:30 AM - 12:30 PM", label: "3rd Lecture" },
  { id: "5", time: "12:30 PM - 1:30 PM", label: "4th Lecture" },
  { id: "6", time: "1:45 PM - 2:45 PM", label: "5th Lecture" },
];

const rooms = [
  "Room A-101",
  "Room A-102",
  "Room A-103",
  "Room B-201",
  "Room B-202",
  "Room B-203",
  "Lab-1",
  "Lab-2",
  "Lab-3",
  "Seminar Hall-1",
  "Seminar Hall-2",
  "Library Hall",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AdminSchedule = () => {
  const [adminData, setAdminData] = useState({ div: "", year: "" });
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("No user ID found. Please log in again.");
        }

        // Fetch admin data
        const adminResponse = await axios.get(
          "http://localhost:8080/api/admin/me",
          {
            headers: { "user-id": userId },
          }
        );
        const { div, year } = adminResponse.data;
        setAdminData({ div, year });

        // Fetch batches for the admin's year and department
        const batchesResponse = await axios.get(
          "http://localhost:8080/api/batches",
          {
            headers: { "user-id": userId },
            params: { year, department: div }, // Filter by department
          }
        );
        console.log("Fetched batches:", batchesResponse.data); // Debug log
        setBatches(batchesResponse.data);

        // Fetch subjects for the admin's year
        const subjectsResponse = await axios.get(
          "http://localhost:8080/api/subjects",
          {
            headers: { "user-id": userId },
            params: { year },
          }
        );
        console.log("Fetched subjects:", subjectsResponse.data); // Debug log
        setSubjects(subjectsResponse.data);

        // Fetch schedule
        await fetchSchedule(div, year);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBatch && selectedSubject && adminData.div) {
      const fetchTeachers = async () => {
        try {
          const userId = localStorage.getItem("userId");
          const response = await axios.get(
            "http://localhost:8080/api/teachers",
            {
              headers: { "user-id": userId },
              params: {
                batch: selectedBatch,
                subject: subjects.find((s) => s.name === selectedSubject)?._id,
                adminDiv: adminData.div,
              },
            }
          );
          console.log("Fetched teachers:", response.data); // Debug log
          setTeachers(response.data);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load teachers");
        }
      };
      fetchTeachers();
    } else {
      setTeachers([]);
    }
  }, [selectedBatch, selectedSubject, adminData.div]);

  const fetchSchedule = async (department, year) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get("http://localhost:8080/api/schedule", {
        headers: { "user-id": userId },
        params: { department, year },
      });
      console.log("Fetched schedule:", response.data); // Debug log
      setScheduleData(Array.isArray(response.data) ? response.data : []);
      if (response.data.length > 0 && batches.length > 0) {
        setActiveTab(batches[0]._id); // Set first batch as active tab
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError(err.response?.data?.message || "Failed to fetch schedule");
    }
  };

  const addScheduleEntry = async () => {
    if (
      !selectedDay ||
      !selectedTimeSlot ||
      !selectedSubject ||
      !selectedTeacher ||
      !selectedRoom ||
      !selectedBatch
    ) {
      alert("Please fill all fields before adding to schedule.");
      return;
    }

    const userId = localStorage.getItem("userId");
    const selectedSubjectObj = subjects.find((s) => s.name === selectedSubject);
    const selectedTeacherObj = teachers.find((t) => t.name === selectedTeacher);

    if (!selectedSubjectObj || !selectedTeacherObj) {
      alert("Invalid subject or teacher selected.");
      return;
    }

    const newEntry = {
      day: selectedDay,
      department: adminData.div,
      year: adminData.year,
      batch: selectedBatch,
      admin: userId,
      time: timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time,
      subject: selectedSubjectObj._id,
      teacher: selectedTeacherObj._id,
      room: selectedRoom,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/schedule/save",
        { entries: [newEntry] },
        { headers: { "user-id": userId } }
      );
      console.log("Added schedule entry:", response.data); // Debug log
      setScheduleData([
        ...scheduleData,
        { ...newEntry, _id: response.data.saved[0]._id },
      ]);
      setSelectedTimeSlot("");
      setSelectedSubject("");
      setSelectedTeacher("");
      setSelectedRoom("");
      setSelectedBatch("");
    } catch (err) {
      console.error("Error adding schedule:", err);
      alert(err.response?.data?.message || "Failed to add schedule entry");
    }
  };

  const removeScheduleEntry = async (scheduleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this schedule entry?"
    );
    if (!confirmDelete) return;

    try {
      const userId = localStorage.getItem("userId");
      await axios.delete(`http://localhost:8080/api/schedule/${scheduleId}`, {
        headers: { "user-id": userId },
      });
      setScheduleData(scheduleData.filter((entry) => entry._id !== scheduleId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete schedule entry");
    }
  };

  const handleSaveSchedule = async () => {
    if (!adminData.div || !adminData.year || !selectedDay) {
      alert("Please ensure department, year, and day are selected.");
      return;
    }

    if (scheduleData.length === 0) {
      alert("No schedule entries to save.");
      return;
    }

    alert(
      `Schedule for ${adminData.div} - Year ${adminData.year} - ${selectedDay} has been saved successfully!`
    );
  };

  const getTimeSlotLabel = (time) => {
    const slot = timeSlots.find((s) => s.time === time);
    return slot ? `${slot.label} (${slot.time})` : time;
  };

  const getBatchArray = () => {
    // Filter batches by admin's department (as a fallback)
    return batches
      .filter(
        (batch) => batch.department === adminData.div || !batch.department
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const getScheduleForBatch = (batchId) =>
    scheduleData.filter((entry) => entry.batch === batchId);

  const getScheduleForBatchByDay = (batchId) => {
    const batchSchedule = getScheduleForBatch(batchId);
    return days.reduce((acc, dayName) => {
      acc[dayName] = batchSchedule.filter((entry) => entry.day === dayName);
      return acc;
    }, {});
  };

  const getBatchColor = (batchId) => {
    const colors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-green-100 border-green-300 text-green-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-orange-100 border-orange-300 text-orange-800",
      "bg-pink-100 border-pink-300 text-pink-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
      "bg-yellow-100 border-yellow-300 text-yellow-800",
      "bg-red-100 border-red-300 text-red-800",
    ];
    const index = batches.findIndex((b) => b._id === batchId);
    return (
      colors[index % colors.length] ||
      "bg-gray-100 border-gray-300 text-gray-800"
    );
  };

  const getDayColor = (dayName) => {
    const dayColors = {
      Monday: "bg-red-50 border-red-200",
      Tuesday: "bg-orange-50 border-orange-200",
      Wednesday: "bg-yellow-50 border-yellow-200",
      Thursday: "bg-green-50 border-green-200",
      Friday: "bg-blue-50 border-blue-200",
      Saturday: "bg-purple-50 border-purple-200",
    };
    return dayColors[dayName] || "bg-gray-50 border-gray-200";
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex min-h-screen mt-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-64 flex-shrink-0 bg-white border-r border-blue-200">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-blue-600 text-lg">
              Admin Panel - Schedule Management
            </p>
          </div>

          <div className="mb-8 bg-white border border-blue-200 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <svg
                  className="w-6 h-6"
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
                Schedule Configuration
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-900">
                    Department
                  </label>
                  <div className="w-full border border-blue-200 rounded-md px-3 py-2 bg-gray-100">
                    {adminData.div || "Loading..."}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-900">
                    Year
                  </label>
                  <div className="w-full border border-blue-200 rounded-md px-3 py-2 bg-gray-100">
                    {adminData.year || "Loading..."}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-900">
                    Day
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md px-3 py-2 bg-white">
                    <option value="">Select Day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {adminData.div && adminData.year && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span className="font-medium text-blue-900">
                        {adminData.div} - Year {adminData.year}
                      </span>
                    </div>
                    {selectedDay && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-blue-600"
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
                        <span className="font-medium text-blue-900">
                          {selectedDay}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span className="font-medium text-blue-900">
                        {batches.length} Batches
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {adminData.div && adminData.year && selectedDay && (
            <div className="space-y-6">
              <div className="bg-white border border-blue-200 shadow-lg rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Schedule Entry
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-900">
                        Time Slot
                      </label>
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <option value="">Select Time Slot</option>
                        {timeSlots
                          .filter((slot) => !slot.isBreak)
                          .map((slot) => (
                            <option key={slot.id} value={slot.id}>
                              {slot.label} - {slot.time}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-900">
                        Batch
                      </label>
                      <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <option value="">Select Batch</option>
                        {getBatchArray().map((batch) => (
                          <option key={batch._id} value={batch._id}>
                            {batch.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-900">
                        Subject
                      </label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject.name}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-900">
                        Teacher
                      </label>
                      <select
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher._id} value={teacher.name}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-900">
                        Room
                      </label>
                      <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <option value="">Select Room</option>
                        {rooms.map((room) => (
                          <option key={room} value={room}>
                            {room}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={addScheduleEntry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={
                      !selectedTimeSlot ||
                      !selectedSubject ||
                      !selectedTeacher ||
                      !selectedRoom ||
                      !selectedBatch
                    }>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add to Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {adminData.div && adminData.year && scheduleData.length > 0 && (
            <div className="space-y-6">
              <div className="bg-white border border-blue-200 shadow-lg rounded-lg overflow-hidden">
                <div className="bg-blue-100 p-6">
                  <h2 className="text-blue-900 font-semibold flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Weekly Schedule Overview - All Days
                  </h2>
                </div>
                <div className="p-6">
                  {scheduleData.length === 0 ? (
                    <div className="text-center py-8 text-blue-600">
                      <svg
                        className="w-12 h-12 mx-auto mb-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p>
                        No schedule entries added yet. Start adding entries
                        above.
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="w-full overflow-x-auto">
                        <div className="flex space-x-1 bg-blue-50 p-1 rounded-md min-w-full">
                          {getBatchArray().map((batch) => (
                            <button
                              key={batch._id}
                              onClick={() => setActiveTab(batch._id)}
                              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                activeTab === batch._id
                                  ? "bg-blue-600 text-white"
                                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              }`}>
                              Batch {batch.name}
                              {getScheduleForBatch(batch._id).length > 0 && (
                                <span className="ml-2 bg-white text-blue-600 px-2 py-1 rounded-full text-xs">
                                  {getScheduleForBatch(batch._id).length}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {getBatchArray().map((batch) => {
                        const scheduleByDay = getScheduleForBatchByDay(
                          batch._id
                        );

                        return (
                          <div
                            key={batch._id}
                            className={`mt-6 ${
                              activeTab === batch._id ? "block" : "hidden"
                            }`}>
                            <div className="flex items-center gap-2 mb-4">
                              <span
                                className={`${getBatchColor(
                                  batch._id
                                )} text-sm px-3 py-1 rounded-md border`}>
                                Batch {batch.name} - Weekly Schedule
                              </span>
                              <span className="text-sm text-blue-600">
                                {getScheduleForBatch(batch._id).length} lectures
                                scheduled
                              </span>
                            </div>

                            {getScheduleForBatch(batch._id).length === 0 ? (
                              <div className="text-center py-8 text-blue-400 bg-blue-50 rounded-lg">
                                <svg
                                  className="w-8 h-8 mx-auto mb-2 opacity-50"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <p>
                                  No lectures scheduled for Batch {batch.name}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {Object.entries(scheduleByDay).map(
                                  ([dayName, daySchedule]) => (
                                    <div
                                      key={dayName}
                                      className={`rounded-lg border-2 ${getDayColor(
                                        dayName
                                      )} p-4`}>
                                      <div className="flex items-center gap-2 mb-4">
                                        <svg
                                          className="w-5 h-5 text-blue-600"
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
                                        <h3 className="text-lg font-semibold text-blue-900">
                                          {dayName}
                                        </h3>
                                        <span className="bg-white border border-gray-300 px-2 py-1 rounded text-sm">
                                          {daySchedule.length} lectures
                                        </span>
                                      </div>

                                      {daySchedule.length === 0 ? (
                                        <div className="text-center py-4 text-blue-400">
                                          <p className="text-sm">
                                            No lectures scheduled for {dayName}
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          {daySchedule
                                            .sort((a, b) => {
                                              const aIndex =
                                                timeSlots.findIndex(
                                                  (t) => t.time === a.time
                                                );
                                              const bIndex =
                                                timeSlots.findIndex(
                                                  (t) => t.time === b.time
                                                );
                                              return aIndex - bIndex;
                                            })
                                            .map((entry) => (
                                              <div
                                                key={entry._id}
                                                className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-blue-400 shadow-sm">
                                                <div className="flex items-center space-x-4">
                                                  <div className="flex items-center gap-2 text-sm min-w-[140px]">
                                                    <svg
                                                      className="w-4 h-4 text-blue-600"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24">
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                      />
                                                    </svg>
                                                    <span className="font-medium text-blue-900">
                                                      {getTimeSlotLabel(
                                                        entry.time
                                                      )}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 text-sm min-w-[160px]">
                                                    <svg
                                                      className="w-4 h-4 text-blue-600"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24">
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                      />
                                                    </svg>
                                                    <span className="text-blue-800 font-medium">
                                                      {entry.subject?.name ||
                                                        "Unknown"}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 text-sm min-w-[140px]">
                                                    <svg
                                                      className="w-4 h-4 text-blue-600"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24">
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                      />
                                                    </svg>
                                                    <span className="text-blue-700">
                                                      {entry.teacher?.name ||
                                                        "Unknown"}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 text-sm">
                                                    <svg
                                                      className="w-4 h-4 text-blue-600"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24">
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                      />
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                      />
                                                    </svg>
                                                    <span className="text-blue-700">
                                                      {entry.room}
                                                    </span>
                                                  </div>
                                                </div>
                                                <button
                                                  onClick={() =>
                                                    removeScheduleEntry(
                                                      entry._id
                                                    )
                                                  }
                                                  className="text-red-600 border border-red-300 hover:bg-red-50 p-2 rounded-md transition-colors">
                                                  <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                  </svg>
                                                </button>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {adminData.div && adminData.year && selectedDay && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSaveSchedule}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg font-medium flex items-center gap-2 transition-colors">
                <svg
                  className="w-5 h-5"
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
                Save Complete Schedule
              </button>
            </div>
          )}

          <div className="mt-8 bg-white border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-100 p-6">
              <h2 className="text-blue-900 font-semibold flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Schedule Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">
                    Time Slots
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• 1st Lecture: 8:45 AM - 9:45 AM</li>
                    <li>• 2nd Lecture: 9:45 AM - 10:45 AM</li>
                    <li>• Break: 10:45 AM - 11:30 AM</li>
                    <li>• 3rd Lecture: 11:30 AM - 12:30 PM</li>
                    <li>• 4th Lecture: 12:30 PM - 1:30 PM</li>
                    <li>• 5th Lecture: 1:45 PM - 2:45 PM</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Features</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Create schedules for all batches simultaneously</li>
                    <li>• Assign subjects and teachers to time slots</li>
                    <li>• Automatic room allocation</li>
                    <li>• Weekly schedule management</li>
                    <li>• Day-wise schedule organization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedule;
