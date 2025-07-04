import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Sidebar from "./Sidebar";
import axios from "../../axios";

const TeacherManager = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    ID_Name: "",
    password: "",
    batch: [],
    subjects: [],
    batchInput: "",
    subjectInput: "",
  });
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/api/teacher");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminId = localStorage.getItem("userId");

    try {
      const subjectIds = formData.subjects
        .map((inputName) => {
          return subjects.find(
            (s) =>
              s.name?.toLowerCase().trim() === inputName.toLowerCase().trim()
          )?._id;
        })
        .filter(Boolean);

      const invalidSubjects = formData.subjects.filter(
        (inputName) =>
          !subjects.some(
            (s) =>
              s.name.toLowerCase().trim() === inputName.toLowerCase().trim()
          )
      );

      if (invalidSubjects.length > 0) {
        alert("❌ Invalid subject(s): " + invalidSubjects.join(", "));
        return;
      }

      const payload = {
        ...formData,
        subjects: subjectIds,
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
        batchInput: "",
        subjectInput: "",
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
    const confirmed = window.confirm(
      `🗑️ Are you sure you want to delete teacher "${name}"?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/teacher/${id}`);
      fetchTeachers();
      alert(`✅ "${name}" was deleted successfully.`);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("❌ Failed to delete teacher.");
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
      batchInput: (teacher.batch || []).join(", "),
      subjectInput: (teacher.subjects || [])
        .map((s) => (typeof s === "object" && s.name ? s.name : ""))
        .join(", "),
    });
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
                batchInput: "",
                subjectInput: "",
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
                    Admin
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
                      {(teacher.batch || []).join(", ")}
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
                    <td className="px-6 py-4">{teacher.admin?.name || "-"}</td>
                    <td className="px-6 py-4 space-x-2">
                      {teacher.admin?._id ===
                        localStorage.getItem("userId") && (
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. PROF001"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Set password"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batches (comma separated)
                  </label>
                  <input
                    type="text"
                    name="batchInput"
                    value={formData.batchInput || ""}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        batchInput: inputValue,
                        batch: inputValue
                          .split(",")
                          .map((b) => b.trim())
                          .filter((b) => b),
                      }));
                    }}
                    placeholder="e.g. B1, B2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects (comma separated)
                  </label>
                  <input
                    type="text"
                    name="subjectInput"
                    value={formData.subjectInput || ""}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        subjectInput: inputValue,
                        subjects: inputValue
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s),
                      }));
                    }}
                    placeholder="e.g. Data Structures, DBMS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddTeacherOpen(false);
                      setEditingId(null);
                    }}
                    className="flex-1 px-4 py-2 border text-gray-600 rounded-md">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md">
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
