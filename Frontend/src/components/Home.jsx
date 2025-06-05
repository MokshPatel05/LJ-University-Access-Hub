import React from "react";
import {
  BookOpen,
  Calendar,
  Library,
  CreditCard,
  Clock,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">

      {/* Hero Section */}
      <section className="bg-white h-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl text-gray-900 mb-4" style={{fontWeight:"bolder"}}>
              Welcome to LJ University Access Hub
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-semibold" >
             Our centralized platform for managing attendance efficiently. Track, monitor, and access all attendance records and reports with ease.
            </p>

            <div className="flex justify-center">
              <Link to="/auth/login">
              <button className="inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-8 py-3 text-lg " style={{borderRadius:"0.5rem"}}>
                Get Started
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-10">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Services</h3>
          <p className="text-gray-600">Access your most used university services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer group h-60">
            <div className="p-4 pb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Course Portal</h3>
              <p className="text-sm text-gray-600">
                Access your courses, assignments, and grades
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer group h-60">
            <div className="p-4 pb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <Library className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Library Services</h3>
              <p className="text-sm text-gray-600">
                Search catalog, reserve books, and study spaces
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer group h-60">
            <div className="p-4 pb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Academic Calendar</h3>
              <p className="text-sm text-gray-600">
                View important dates and deadlines
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer group h-60">
            <div className="p-4 pb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold">Student Finance</h3>
              <p className="text-sm text-gray-600">
                Manage tuition, fees, and financial aid
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Events</h3>
          <p className="text-gray-600">Stay updated with campus events and activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Career Fair Event"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                Career
              </span>
              <h4 className="font-semibold text-lg mb-2">Annual Career Fair 2024</h4>
              <p className="text-sm text-gray-600 mb-3">
                Connect with top employers and explore career opportunities
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                March 20, 2024
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Tech Symposium"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                Academic
              </span>
              <h4 className="font-semibold text-lg mb-2">Tech Innovation Symposium</h4>
              <p className="text-sm text-gray-600 mb-3">
                Explore the latest in technology and innovation
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                March 25, 2024
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Cultural Festival"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                Cultural
              </span>
              <h4 className="font-semibold text-lg mb-2">Spring Cultural Festival</h4>
              <p className="text-sm text-gray-600 mb-3">
                Celebrate diversity with music, food, and performances
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                April 2, 2024
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Sports Tournament"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                Sports
              </span>
              <h4 className="font-semibold text-lg mb-2">Inter-College Sports Meet</h4>
              <p className="text-sm text-gray-600 mb-3">
                Compete in various sports and showcase your talents
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                April 8, 2024
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Research Conference"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                Research
              </span>
              <h4 className="font-semibold text-lg mb-2">Student Research Conference</h4>
              <p className="text-sm text-gray-600 mb-3">
                Present your research and learn from peers
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                April 15, 2024
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Alumni Meetup"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                Networking
              </span>
              <h4 className="font-semibold text-lg mb-2">Alumni Networking Event</h4>
              <p className="text-sm text-gray-600 mb-3">
                Connect with successful alumni and build your network
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                April 22, 2024
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
