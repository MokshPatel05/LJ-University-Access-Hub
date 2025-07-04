import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { X, Plus, Edit, Trash2, Users } from "lucide-react";

function BatchManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    batchName: "",
    department: "",
    academicYear: "",
  });

  const [editingBatchId, setEditingBatchId] = useState(null);

  // ✅ Fetch batches from backend
  const fetchBatches = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/batches");
      const data = await res.json();
      setBatches(data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // ✅ Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Create a new batch
  const handleCreateOrUpdateBatch = async (e) => {
    e.preventDefault();
    const { batchName, department, academicYear } = formData;

    if (batchName && department && academicYear) {
      const payload = {
        name: batchName,
        department,
        year: academicYear,
        createdBy: localStorage.getItem("userName") || "Unknown",
      };

      try {
        if (editingBatchId) {
          // 🛠 EDIT MODE
          const res = await fetch(
            `http://localhost:8080/api/batches/${editingBatchId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
          if (!res.ok) throw new Error("Failed to update batch");
        } else {
          // ➕ CREATE MODE
          const res = await fetch("http://localhost:8080/api/batches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Failed to create batch");
        }

        await fetchBatches();
        setFormData({
          batchName: "",
          department: "",
          academicYear: "",
          totalStudents: "",
        });
        setIsModalOpen(false);
        setEditingBatchId(null);
      } catch (err) {
        console.error(err);
        alert("Something went wrong while saving the batch.");
      }
    }
  };

  // ✅ Delete a batch
  const handleDeleteBatch = async (id) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this batch?"
      );
      if (!confirm) return;

      const res = await fetch(`http://localhost:8080/api/batches/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete batch");

      await fetchBatches(); // Refresh list
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch.");
    }
  };

  return (
    <div className="flex min-h-screen mt-16">
      <Sidebar />

      <div className="ml-64 w-full">
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="relative w-full md:w-1/3 mb-6">
            <input
              type="text"
              placeholder="Search by creator name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <i className="fas fa-search"></i>{" "}
              {/* ✅ Font Awesome search icon */}
            </span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                Batch Management
              </h2>
              <p className="text-gray-600">
                Create and manage student batches and classes
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-white shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Create Batch</span>
            </button>
          </div>

          {/* Batch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches
              .filter((batch) =>
                batch.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => {
                // Extract the numeric part after 'B' and compare as numbers
                const aNum = parseInt(a.name.replace(/[^\d]/g, ""), 10);
                const bNum = parseInt(b.name.replace(/[^\d]/g, ""), 10);
                return aNum - bNum;
              })
              .map((batch) => (
                <div
                  key={batch._id}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {batch.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setFormData({
                            batchName: batch.name,
                            department: batch.department,
                            academicYear: batch.year,
                            totalStudents: batch.students.toString(),
                          });
                          setEditingBatchId(batch._id);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        Department:
                      </span>{" "}
                      {batch.department}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Year:</span>{" "}
                      {batch.year}
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="font-medium text-gray-900">
                        Students:
                      </span>
                      <span className="ml-1">{batch.students.length}</span>
                    </div>
                    <p className="text-xs text-gray-500 italic mt-2">
                      Batch Under: {batch.createdBy}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Create New Batch</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBatchId(null);
                  setFormData({
                    batchName: "",
                    department: "",
                    academicYear: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateBatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Batch Name
                </label>
                <input
                  type="text"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleInputChange}
                  placeholder="e.g. CS-A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Academic Year
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  placeholder="e.g. 2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                {editingBatchId ? "Update Batch" : "Create Batch"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchManagement;
