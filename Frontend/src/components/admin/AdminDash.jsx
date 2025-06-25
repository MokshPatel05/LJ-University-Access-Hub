import { useState } from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  BarChart3, 
  UserPlus,
  GraduationCap,
  Building
} from 'lucide-react';
import Sidebar from './Sidebar';
import DailySchedule from './DailySchedule';

export const adminMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    id: "users",
    label: "Manage Users",
    icon: Users,
  },
  {
    id: "classes",
    label: "Manage Classes",
    icon: BookOpen,
  },
  {
    id: "schedule",
    label: "Class Schedule",
    icon: Calendar,
  },
  {
    id: "branches",
    label: "Branches & Batches",
    icon: Building,
  },
  {
    id: "settings",
    label: "System Settings",
    icon: Settings,
  },
];

const AdminDash = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sample data
  const systemStats = {
    totalStudents: 1247,
    totalTeachers: 89,
    activeClasses: 156,
    totalBranches: 8
  };

  const recentActivities = [
    { id: 1, type: "user_added", message: "Prof. Bhargav Suthar has been added as a new faculty member in CSE", time: "2 hours ago" },
    { id: 2, type: "class_created", message: "New class 'Advanced Mathematics' created for CSE-B1 batch", time: "4 hours ago" },
    { id: 3, type: "schedule_updated", message: "Schedule updated for IT department", time: "1 day ago" },
  ];

  const timetableData = [
    {
      day: "MON",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "PYTHON-2", faculty: "VHA", room: "406-1" },
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "TOC", faculty: "PDO", room: "404" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-3" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "FSD-2", faculty: "NAS", room: "407" },
            { subject: "FSD-2", faculty: "PBZ", room: "406-4" },
            { subject: "TOC", faculty: "DPS", room: "409" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "TOC", faculty: "DPS", room: "403" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "TOC", faculty: "PDO", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "409" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "TOC", faculty: "PDO", room: "403" },
            { subject: "FSD-2", faculty: "NAS", room: "406-1" },
            { subject: "PYTHON-2", faculty: "VHA", room: "406-3" },
            { subject: "TOC", faculty: "DPS", room: "404" },
            { subject: "FSD-2", faculty: "PSP", room: "407" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "COA", faculty: "VBY", room: "409" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-4" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "MSS", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
      ],
    },
    {
      day: "TUE",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "TOC", faculty: "PDO", room: "403" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-1" },
            { subject: "FSD-2", faculty: "PSP", room: "406-3" },
            { subject: "TOC", faculty: "DPS", room: "404" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "FSD-2", faculty: "NAS", room: "407" },
            { subject: "COA", faculty: "VBY", room: "409" },
            { subject: "FSD-2", faculty: "MJT", room: "406-4" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "409" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "PYTHON-2", faculty: "VHA", room: "406-1" },
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "FSD-2", faculty: "NAS", room: "406-3" },
            { subject: "FSD-2", faculty: "PSP", room: "407" },
            { subject: "TOC", faculty: "DPS", room: "405" },
            { subject: "PYTHON-2", faculty: "DVP", room: "406-4" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "DPS", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
          ],
        },
      ],
    },
    {
      day: "WED",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-1" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "FSD-2", faculty: "NAS", room: "406-3" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "PYTHON-2", faculty: "VHA", room: "407" },
            { subject: "FSD-2", faculty: "PBZ", room: "406-4" },
            { subject: "COA", faculty: "SSD", room: "409" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "TOC", faculty: "PDO", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "FSD-2", faculty: "PSP", room: "406-1" },
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "PYTHON-2", faculty: "VHA", room: "406-3" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "PYTHON-2", faculty: "DVP", room: "407" },
            { subject: "TOC", faculty: "DPS", room: "405" },
            { subject: "DM", faculty: "MSS", room: "409" },
            { subject: "FSD-2", faculty: "MJT", room: "406-4" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "TOC", faculty: "DPS", room: "403" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "404" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "VBY", room: "409" },
          ],
        },
      ],
    },
    {
      day: "THU",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "FSD-2", faculty: "NAS", room: "406-1" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-3" },
            { subject: "TOC", faculty: "PDO", room: "405" },
            { subject: "PYTHON-2", faculty: "VHA", room: "407" },
            { subject: "PYTHON-2", faculty: "DVP", room: "406-4" },
            { subject: "TOC", faculty: "DPS", room: "409" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "TOC", faculty: "PDO", room: "403" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "409" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "PYTHON-2", faculty: "VHA", room: "406-1" },
            { subject: "TOC", faculty: "DPS", room: "403" },
            { subject: "FSD-2", faculty: "PSP", room: "406-3" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "PYTHON-2", faculty: "DVP", room: "407" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "COA", faculty: "VBY", room: "409" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-4" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "TOC", faculty: "DPS", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "DPS", room: "404" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "DM", faculty: "MSS", room: "409" },
            { subject: "none", faculty: "", room: "" },
          ],
        },
      ],
    },
    {
      day: "FRI",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-1" },
            { subject: "PYTHON-2", faculty: "VHA", room: "406-3" },
            { subject: "TOC", faculty: "DPS", room: "404" },
            { subject: "FSD-2", faculty: "PSP", room: "407" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "COA", faculty: "VBY", room: "409" },
            { subject: "FSD-2", faculty: "MJT", room: "406-4" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "MSS", room: "409" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "FSD-2", faculty: "PSP", room: "406-1" },
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "TOC", faculty: "PDO", room: "404" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-3" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "FSD-2", faculty: "NAS", room: "407" },
            { subject: "PYTHON-2", faculty: "DVP", room: "406-4" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "TOC", faculty: "PDO", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "DPS", room: "409" },
          ],
        },
      ],
    },
    {
      day: "SAT",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "FSD-2", faculty: "PSP", room: "406-1" },
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "TOC", faculty: "PDO", room: "404" },
            { subject: "FSD-2", faculty: "NAS", room: "406-3" },
            { subject: "PYTHON-2", faculty: "DVP", room: "407" },
            { subject: "TOC", faculty: "DPS", room: "405" },
            { subject: "DM", faculty: "MSS", room: "409" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-4" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "TOC", faculty: "DPS", room: "403" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "409" },
          ],
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "TOC", faculty: "PDO", room: "403" },
            { subject: "FSD-2", faculty: "NAS", room: "406-1" },
            { subject: "FSD-2", faculty: "PSP", room: "406-3" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "PYTHON-2", faculty: "VHA", room: "407" },
            { subject: "FSD-2", faculty: "PBZ", room: "406-4" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
          ],
        },
      ],
    },
  ];

  // Calculate faculty workload from timetable data
  const calculateFacultyWorkload = () => {
    const facultyWorkload = {};
    
    timetableData.forEach(day => {
      day.slots.forEach(slot => {
        if (slot.time !== "BREAK") {
          slot.classes.forEach(classItem => {
            if (classItem.subject !== "none" && classItem.faculty) {
              if (!facultyWorkload[classItem.faculty]) {
                facultyWorkload[classItem.faculty] = {
                  name: classItem.faculty,
                  totalClasses: 0,
                  subjects: new Set()
                };
              }
              facultyWorkload[classItem.faculty].totalClasses++;
              facultyWorkload[classItem.faculty].subjects.add(classItem.subject);
            }
          });
        }
      });
    });

    // Convert subjects Set to array and sort by total classes
    return Object.values(facultyWorkload)
      .map(faculty => ({
        ...faculty,
        subjects: Array.from(faculty.subjects)
      }))
      .sort((a, b) => b.totalClasses - a.totalClasses);
  };

  const facultyWorkload = calculateFacultyWorkload();

  const renderDashboard = () => (
    <div className="space-y-6 mt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Administrator</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-600">Total Students</div>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{systemStats.totalStudents}</div>
          <p className="text-xs text-gray-600">Across all branches</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-600">Total Teachers</div>
            <GraduationCap className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-green-600">{systemStats.totalTeachers}</div>
          <p className="text-xs text-gray-600">Active faculty members</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-600">Active Classes</div>
            <BookOpen className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{systemStats.activeClasses}</div>
          <p className="text-xs text-gray-600">Currently running</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-600">Branches</div>
            <Building className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{systemStats.totalBranches}</div>
          <p className="text-xs text-gray-600">Academic departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Faculty Workload Overview</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {facultyWorkload.slice(0, 8).map((faculty, index) => (
                <div
                  key={faculty.name}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-medium text-sm">{faculty.name.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{faculty.name}</h4>
                      <p className="text-xs text-gray-500">
                        {faculty.subjects.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{faculty.totalClasses}</div>
                    <p className="text-xs text-gray-500">classes/week</p>
                  </div>
                </div>
              ))}
            </div>
            {facultyWorkload.length > 8 && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing top 8 faculty members. Total: {facultyWorkload.length} faculty
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 mt-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">Add and manage students and teachers</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">User management interface will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Add students, Add teachers, Assign roles, Manage batches</p>
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="space-y-6 mt-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Classes</h1>
          <p className="text-gray-600 mt-2">Create and edit daily classes</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2">
          <BookOpen className="w-4 h-4" />
          <span>Create New Class</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Class management interface will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Create classes, Assign teachers, Set schedules, Manage subjects</p>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6 mt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Schedule Management</h1>
        <p className="text-gray-600 mt-2">Create and manage weekly class schedules</p>
      </div>

      <DailySchedule />
    </div>
  );

  const renderBranches = () => (
    <div className="space-y-6 mt-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branches & Batches</h1>
          <p className="text-gray-600 mt-2">Manage academic branches and student batches</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <Building className="w-4 h-4" />
          <span>Add Branch</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Branch and batch management interface will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Add branches, Create batches, Assign students, Manage sub-branches</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 mt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">System settings interface will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Features: User permissions, System configuration, Backup settings, Security options</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "classes":
        return renderClasses();
      case "schedule":
        return renderSchedule();
      case "branches":
        return renderBranches();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDash;
