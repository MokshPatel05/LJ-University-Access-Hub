import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const TeacherDash = () => {
  const { id } = useParams();
  const [teacherName, setTeacherName] = useState("");
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [stats, setStats] = useState({
    totalClassesWeek: 0,
    classesToday: 0,
    studentsTaught: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/teacher/${id}/dashboard`);
        setTeacherName(res.data.name || "Professor");
        setTodaySchedule(res.data.todaySchedule);
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full flex-col">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <div className="mt-16 space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {teacherName}</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Today's Classes" value={stats.classesToday} />
            <StatCard label="Weekly Classes" value={stats.totalClassesWeek} />
            <StatCard label="Students Taught" value={stats.studentsTaught} />
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            </div>
            <div className="p-6 space-y-4">
              {todaySchedule.length === 0 ? (
                <p className="text-gray-500">No classes scheduled for today.</p>
              ) : (
                todaySchedule.map((cls, index) => {
                  const parseTime = (timeStr) => {
                    const [time, modifier] = timeStr.split(" ");
                    let [hours, minutes] = time.split(":").map(Number);
                    if (modifier === "PM" && hours !== 12) hours += 12;
                    if (modifier === "AM" && hours === 12) hours = 0;
                    return hours * 60 + minutes;
                  };

                  const [startRaw, endRaw] = cls.time.split("-").map(t => t.trim());
                  const startMinutes = parseTime(startRaw);
                  const endMinutes = parseTime(endRaw);

                  const now = new Date();
                  const currentMinutes = now.getHours() * 60 + now.getMinutes();

                  let status = "Upcoming";
                  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                    status = "Ongoing";
                  } else if (currentMinutes >= endMinutes) {
                    status = "Completed";
                  }

                  const statusStyle = {
                    Upcoming: "bg-blue-100 text-blue-700",
                    Ongoing: "bg-green-100 text-green-700",
                    Completed: "bg-red-100 text-red-700",
                  };

                  return (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-green-600 font-semibold">{cls.time}</p>
                          <p className="text-md font-bold text-gray-800 mt-1">
                            {cls.subject?.name || "Subject Name"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Batch: {cls.batch?.name || cls.batch} • Room: {cls.room}
                          </p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyle[status]}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-bold text-green-600">{value}</div>
  </div>
);

export default TeacherDash;
