import React from "react";
import { Outlet } from "react-router-dom";
import {
  Calendar,
  Users,
  Download,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import Sidebar from "./Sidebar"; // Adjust path based on your project structure

const AdminDash = () => {
  const stats = [
    {
      title: "Total Teachers",
      value: "24",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Batches",
      value: "8",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "Today's Classes",
      value: "15",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Attendance Reports",
      value: "42",
      icon: Download,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-5/6 flex-1 p-6 overflow-y-auto">
        <div className="space-y-6 mt-16">
          <div>
            <h1 className="text-3 py-6 font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to the admin panel. Manage your college attendance system
              efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </h3>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="pt-0">
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from last month
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-200">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-blue-700">
                      Create Schedule
                    </span>
                  </button>
                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-green-700">
                      Add Teacher
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDash;
