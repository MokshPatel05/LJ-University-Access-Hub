import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

const Schedule = () => {
  const { id } = useParams();
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/teacher/${id}/weekly-schedule`
        );
        setWeeklySchedule(res.data);
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="p-6">
          <div className="space-y-6 mt-16">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Weekly Schedule
                </h1>
                <p className="text-gray-600 mt-2">View your class schedule</p>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-500 mt-6">Loading schedule...</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(weeklySchedule).map(([day, classes]) => (
                  <div
                    key={day}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
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
                        <span>{day}</span>
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {classes.map((cls, index) => (
                          <div
                            key={index}
                            className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {cls.subject || "Subject"}
                              </h3>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-3 h-3"
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
                                <span>{cls.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                <span>Batch: {cls.batch}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-3 h-3"
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
                                <span>Room: {cls.room}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {classes.length === 0 && (
                          <p className="text-gray-500 text-center py-4">
                            No classes scheduled
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Schedule;
