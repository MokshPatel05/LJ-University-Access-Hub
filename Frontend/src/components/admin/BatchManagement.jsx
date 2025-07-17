import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { X, Plus, Edit, Trash2, Users } from "lucide-react";

function BatchManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [adminData, setAdminData] = useState({ div: "" });
  const [formData, setFormData] = useState({
    batchName: "",
    department: "",
    academicYear: "",
  });
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch admin data and batches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("No user ID found. Please log in again.");
        }

        // Fetch admin data
        const adminResponse = await fetch(
          "http://localhost:8080/api/admin/me",
          {
            headers: { "user-id": userId },
          }
        );
        if (!adminResponse.ok) throw new Error("Failed to fetch admin data");
        const adminData = await adminResponse.json();
        setAdminData({ div: adminData.div || "" });
        setFormData((prev) => ({ ...prev, department: adminData.div || "" }));

        // Fetch batches for the admin
        const batchesResponse = await fetch(
          `http://localhost:8080/api/batches?adminId=${userId}&department=${adminData.div}`
        );
        if (!batchesResponse.ok) throw new Error("Failed to fetch batches");
        const batchesData = await batchesResponse.json();
        setBatches(batchesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "department") {
      // Prevent changes to department field
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Create or update a batch
  const handleCreateOrUpdateBatch = async (e) => {
    e.preventDefault();
    const { batchName, academicYear } = formData;

    if (!batchName || !academicYear || !adminData.div) {
      alert("Please fill all fields. Department is required.");
      return;
    }

    const payload = {
      name: batchName,
      department: adminData.div, // Always use admin's div
      year: academicYear,
      createdBy: localStorage.getItem("userId"),
    };

    try {
      let res;
      if (editingBatchId) {
        // Edit mode
        res = await fetch(
          `http://localhost:8080/api/batches/${editingBatchId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error("Failed to update batch");
      } else {
        // Create mode
        res = await fetch("http://localhost:8080/api/batches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create batch");
      }

      // Refresh batches
      const batchesResponse = await fetch(
        `http://localhost:8080/api/batches?adminId=${localStorage.getItem(
          "userId"
        )}&department=${adminData.div}`
      );
      if (!batchesResponse.ok) throw new Error("Failed to fetch batches");
      const batchesData = await batchesResponse.json();
      setBatches(batchesData);

      setFormData({
        batchName: "",
        department: adminData.div, // Reset to admin's div
        academicYear: "",
      });
      setIsModalOpen(false);
      setEditingBatchId(null);
      alert(
        editingBatchId
          ? "Batch updated successfully!"
          : "Batch created successfully!"
      );
    } catch (err) {
      console.error("Error saving batch:", err);
      alert("Something went wrong while saving the batch.");
    }
  };

  // Delete a batch
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

      // Refresh batches
      const batchesResponse = await fetch(
        `http://localhost:8080/api/batches?adminId=${localStorage.getItem(
          "userId"
        )}&department=${adminData.div}`
      );
      if (!batchesResponse.ok) throw new Error("Failed to fetch batches");
      const batchesData = await batchesResponse.json();
      setBatches(batchesData);
      alert("Batch deleted successfully!");
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch.");
    }
  };

  // Handle edit button click
  const handleEditBatch = (batch) => {
    setFormData({
      batchName: batch.name,
      department: adminData.div, // Always use admin's div
      academicYear: batch.year,
    });
    setEditingBatchId(batch._id);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex min-h-screen mt-16">
      <div className="w-64 flex-shrink-0 bg-white border-r border-blue-200">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gradient-to-br from-blue-50 to-white p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Batch Management
                </h1>
                <p className="text-gray-600">
                  Create and manage student batches and classes
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-1/3 mb-6">
            <input
              type="text"
              placeholder="Search by batch name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 pr-10 py-2 border border-blue-200 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-blue-400">
              <i className="fas fa-search"></i>
            </span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-blue-900">
                Batch Management
              </h2>
              <p className="text-blue-600">
                Create and manage student batches and classes
              </p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  batchName: "",
                  department: adminData.div,
                  academicYear: "",
                });
                setEditingBatchId(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-white shadow-sm"
              disabled={!adminData.div}>
              <Plus className="w-4 h-4" />
              <span>Create Batch</span>
            </button>
          </div>

          {/* Batch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches
              .filter((batch) =>
                batch.name?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => {
                const aNum = parseInt(a.name.replace(/[^\d]/g, ""), 10);
                const bNum = parseInt(b.name.replace(/[^\d]/g, ""), 10);
                return aNum - bNum;
              })
              .map((batch) => {
                return (
                  <div
                    key={batch._id}
                    className="bg-white rounded-lg p-6 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-blue-900">
                        {batch.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBatch(batch)}
                          className="p-1 text-blue-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(batch._id)}
                          className="p-1 text-red-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-blue-600">
                        <span className="font-medium text-blue-900">
                          Department:
                        </span>{" "}
                        {batch.department}
                      </p>
                      <p className="text-sm text-blue-600">
                        <span className="font-medium text-blue-900">Year:</span>{" "}
                        {batch.year}
                      </p>
                      <div className="flex items-center text-sm text-blue-600">
                        <Users className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="font-medium text-blue-900">
                          Students:
                        </span>
                        <span className="ml-1">{batch.students.length}</span>
                      </div>
                      <p className="text-xs text-blue-500 italic mt-2">
                        Batch Under: {batch.createdBy?.name}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-blue-900">
                {editingBatchId ? "Edit Batch" : "Create New Batch"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBatchId(null);
                  setFormData({
                    batchName: "",
                    department: adminData.div,
                    academicYear: "",
                  });
                }}
                className="text-blue-400 hover:text-blue-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateBatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-900">
                  Batch Name
                </label>
                <input
                  type="text"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleInputChange}
                  placeholder="e.g. CS-A"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-blue-900">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={adminData.div || "Loading..."}
                  disabled
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-gray-100 text-blue-600 cursor-not-allowed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-blue-900">
                  Academic Year
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  placeholder="e.g. 2025"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                disabled={!adminData.div}>
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
