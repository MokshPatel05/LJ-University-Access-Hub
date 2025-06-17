import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

const weeklySchedule = {
  Monday: [
    { time: "09:00-10:00", subject: "Mathematics", batch: "CS-A", room: "101" },
    { time: "11:00-12:00", subject: "Statistics", batch: "CS-B", room: "103" },
  ],
  Tuesday: [
    { time: "10:00-11:00", subject: "Calculus", batch: "IT-A", room: "105" },
    { time: "14:00-15:00", subject: "Mathematics", batch: "CS-A", room: "101" },
  ],
  Wednesday: [
    { time: "09:00-10:00", subject: "Statistics", batch: "CS-B", room: "103" },
    { time: "15:00-16:00", subject: "Algebra", batch: "IT-B", room: "107" },
  ],
  Thursday: [
    { time: "11:00-12:00", subject: "Calculus", batch: "IT-A", room: "105" },
  ],
  Friday: [
    { time: "09:00-10:00", subject: "Mathematics", batch: "CS-A", room: "101" },
    { time: "13:00-14:00", subject: "Statistics", batch: "CS-B", room: "103" },
  ],
};

const Schedule = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="p-6">
          <div className="space-y-6 mt-16">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Daily Schedule</h1>
                <p className="text-gray-600 mt-2">View your weekly class schedule (ID: {id})</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(weeklySchedule).map(([day, classes]) => (
                <div
                  key={day}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                      {classes.map((classItem, index) => (
                        <div
                          key={index}
                          className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{classItem.subject}</h3>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{classItem.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                              <span>Batch: {classItem.batch}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
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
                              <span>Room: {classItem.room}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {classes.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No classes scheduled</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Schedule;