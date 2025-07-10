import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import Sidebar from "./Sidebar";
import axios from "../../axios";

const TeacherManager = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    ID_Name: "",
    password: "",
    batch: [],
    subjects: [],
  });
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
    fetchBatches();
  }, []);

  const fetchTeachers = async () => {
    try {
      const adminId = localStorage.getItem("userId");
      const res = await axios.get(`/api/teacher?adminId=${adminId}`);
      console.log("Fetched teachers:", res.data);
      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/subjects");
      console.log("Fetched subjects:", res.data);
      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setSubjects([]);
    }
  };

  const fetchBatches = async () => {
    try {
      const adminId = localStorage.getItem("userId");
      const res = await axios.get(
        `http://localhost:8080/api/batches?adminId=${adminId}`
      );
      console.log("Fetched batches:", res.data);
      setBatches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setBatches([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminId = localStorage.getItem("userId");

    try {
      const payload = {
        ...formData,
        password: formData.password || "default123",
        adminId,
      };

      if (editingId) {
        delete payload.password;
        await axios.put(`/api/teacher/${editingId}`, payload);
      } else {
        await axios.post("/api/teacher", payload);
      }

      fetchTeachers();
      setIsAddTeacherOpen(false);
      setFormData({
        name: "",
        ID_Name: "",
        password: "",
        batch: [],
        subjects: [],
      });
      setEditingId(null);
      alert("✅ Teacher successfully saved");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Unknown error";
      alert("❌ Failed to add/update teacher: " + errorMessage);
    }
  };

  const handleDelete = async (id, name) => {
    const adminId = localStorage.getItem("userId");
    const confirmed = window.confirm(
      `🗑️ Are you sure you want to remove teacher "${name}" from your administration?`
    );
    if (!confirmed) return;

    try {
      // Pass adminId as query parameter to only remove this admin's association
      await axios.delete(`/api/teacher/${id}?adminId=${adminId}`);
      fetchTeachers();
      alert(`✅ "${name}" was removed from your administration successfully.`);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("❌ Failed to remove teacher.");
    }
  };

  const handleEdit = (teacher) => {
    setIsAddTeacherOpen(true);
    setEditingId(teacher._id);
    setFormData({
      name: teacher.name || "",
      ID_Name: teacher.ID_Name || "",
      password: "",
      batch: Array.isArray(teacher.batch) ? teacher.batch : [],
      subjects: Array.isArray(teacher.subjects)
        ? teacher.subjects.map((s) => (typeof s === "string" ? s : s._id))
        : [],
    });
  };

  const handleBatchChange = (batchId) => {
    setFormData((prev) => ({
      ...prev,
      batch: prev.batch.includes(batchId)
        ? prev.batch.filter((id) => id !== batchId)
        : [...prev.batch, batchId],
    }));
  };

  const handleSubjectChange = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter((id) => id !== subjectId)
        : [...prev.subjects, subjectId],
    }));
  };

  const removeBatch = (batchId) => {
    setFormData((prev) => ({
      ...prev,
      batch: prev.batch.filter((id) => id !== batchId),
    }));
  };

  const removeSubject = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((id) => id !== subjectId),
    }));
  };

  const getBatchName = (batchItem) => {
    if (typeof batchItem === "object" && batchItem.name) return batchItem.name;
    const batch = batches.find(
      (b) => b._id === batchItem || b.name === batchItem
    );
    return batch ? batch.name : batchItem;
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s._id === subjectId);
    return subject ? subject.name : subjectId;
  };

  // ✅ Check if current admin can edit/delete this teacher
  const canEditTeacher = (teacher) => {
    const currentAdminId = localStorage.getItem("userId");
    return Array.isArray(teacher.admin)
      ? teacher.admin.some((admin) => admin._id === currentAdminId)
      : teacher.admin?._id === currentAdminId;
  };

  const filteredTeachers = (teachers || []).filter(
    (t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ID_Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0 bg-gray-50">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 mt-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Teacher Management
            </h1>
            <p className="text-gray-600 mt-2">
              Add, edit, and manage teacher accounts
            </p>
          </div>
          <button
            onClick={() => {
              setIsAddTeacherOpen(true);
              setEditingId(null);
              setFormData({
                name: "",
                ID_Name: "",
                password: "",
                batch: [],
                subjects: [],
              });
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Teacher</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search teachers by ID Name or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Teachers
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Batches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Admins
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td className="px-6 py-4">{teacher.name}</td>
                    <td className="px-6 py-4">{teacher.ID_Name}</td>
                    <td className="px-6 py-4">
                      {(teacher.batch || [])
                        .map((batch) => getBatchName(batch))
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4">
                      {(teacher.subjects || [])
                        .map((s) => {
                          if (typeof s === "object" && s?.name) return s.name;
                          const match = subjects.find((subj) => subj._id === s);
                          return match ? match.name : "Unknown";
                        })
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4">
                      {/* ✅ Display multiple admins */}
                      {Array.isArray(teacher.admin)
                        ? teacher.admin.map((admin) => admin.name).join(", ")
                        : teacher.admin?.name || "-"}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {/* ✅ Check if current admin can edit/delete */}
                      {canEditTeacher(teacher) && (
                        <>
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="text-blue-500 hover:underline">
                            <Edit className="inline-block w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(teacher._id, teacher.name)
                            }
                            className="text-red-500 hover:underline">
                            <Trash2 className="inline-block w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTeachers.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No teachers found.
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {isAddTeacherOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? "Edit Teacher" : "Add New Teacher"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="e.g. Prof. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Name
                  </label>
                  <input
                    type="text"
                    value={formData.ID_Name}
                    onChange={(e) =>
                      setFormData({ ...formData, ID_Name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="e.g. DDP"
                  />
                </div>

                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="Set password"
                    />
                  </div>
                )}

                {/* Batches Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Batches
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBatchChange(e.target.value);
                        e.target.value = "";
                      }
                    }}>
                    <option value="">Select a batch to add...</option>
                    {batches
                      .filter((batch) => !formData.batch.includes(batch._id))
                      .map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.name}
                        </option>
                      ))}
                  </select>

                  {/* Selected Batches */}
                  {formData.batch.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.batch.map((batchId) => (
                        <span
                          key={batchId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {getBatchName(batchId)}
                          <button
                            type="button"
                            onClick={() => removeBatch(batchId)}
                            className="ml-2 text-blue-600 hover:text-blue-800">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subjects Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Subjects
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSubjectChange(e.target.value);
                        e.target.value = "";
                      }
                    }}>
                    <option value="">Select a subject to add...</option>
                    {subjects
                      .filter(
                        (subject) => !formData.subjects.includes(subject._id)
                      )
                      .map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                  </select>

                  {/* Selected Subjects */}
                  {formData.subjects.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.subjects.map((subjectId) => (
                        <span
                          key={subjectId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          {getSubjectName(subjectId)}
                          <button
                            type="button"
                            onClick={() => removeSubject(subjectId)}
                            className="ml-2 text-green-600 hover:text-green-800">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddTeacherOpen(false);
                      setEditingId(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    {editingId ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherManager;
