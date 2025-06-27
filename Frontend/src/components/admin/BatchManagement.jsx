"use client"

import React from "react";
import Sidebar from "./Sidebar";
import { useState } from "react"
import { X, Plus, Edit, Trash2, Users, BookOpen, Bell } from "lucide-react"

function BatchManagement() {
  
   const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    batchName: "",
    department: "",
    academicYear: "",
    totalStudents: "",
  })

  const [batches, setBatches] = useState([
    {
      id: 1,
      name: "B1",
      department: "SY-1",
      year: "2022",
      students: 30,
      
    },
    {
      id: 2,
      name: "B2",
      department: "SY-2",
      year: "2025",
      students: 25,
      
    },
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateBatch = (e) => {
    e.preventDefault()
    if (formData.batchName && formData.department && formData.academicYear && formData.totalStudents) {
      const newBatch = {
        id: batches.length + 1,
        name: formData.batchName,
        department: formData.department,
        year: formData.academicYear,
        students: Number.parseInt(formData.totalStudents),
        classes: [],
      }
      setBatches([...batches, newBatch])
      setFormData({ batchName: "", department: "", academicYear: "", totalStudents: "" })
      setIsModalOpen(false)
    }
  }

  const handleDeleteBatch = (id) => {
    setBatches(batches.filter((batch) => batch.id !== id))
  }
  
  
  
  return (
    <div className="flex min-h-screen mt-16">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="ml-64 w-full">
        {/* Content */}
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Batch Management</h2>
              <p className="text-gray-600">Create and manage student batches and classes</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-white shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Batch</span>
            </button>
          </div>

          {/* Batch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{batch.name}</h3>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Department:</span> {batch.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Year:</span> {batch.year}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1 text-blue-500" />
                    <span className="font-medium text-gray-900">Students:</span>
                    <span className="ml-1">{batch.students}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
       {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Create New Batch</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Batch Name</label>
                <input
                  type="text"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleInputChange}
                  placeholder="e.g., CS-A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Academic Year</label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Total Students</label>
                <input
                  type="number"
                  name="totalStudents"
                  value={formData.totalStudents}
                  onChange={handleInputChange}
                  placeholder="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Create Batch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchManagement;
