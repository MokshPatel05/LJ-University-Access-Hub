import React from "react";

function Dashboard() {
  return (
    <>
      <div
        className="min-h-screen w-full px-50 pt-4"
        style={{ backgroundColor: "#E7EEFF" }}>
        <div className="bg-white p-4 flex justify-between rounded-xl shadow-xl">
          <div>
            <div className="text-3xl font-bold mb-2.5">
              Teacher Dashboard <br />
            </div>
            Manage your classes and track attendance
          </div>
          <div className="flex items-center">
            <span
              className="text-center px-3 rounded-3xl flex py-1"
              style={{ backgroundColor: "#F1F5F9", color: "black" }}>
              <img src="/calendar.png" alt="calender"  className="m-1 pr-2"/>
              Current date
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
