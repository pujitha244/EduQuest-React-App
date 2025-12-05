// src/pages/admin/AdminTeam.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
  });

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get("/team");
      setTeam(res.data);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      role: "",
      bio: "",
    });
  };

  const startEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      const res = await api.put(`/team/${editing.id}`, {
        ...editing,
        ...form,
      });
      setTeam((prev) =>
        prev.map((t) => (t.id === editing.id ? res.data : t))
      );
    } else {
      const res = await api.post("/team", form);
      setTeam((prev) => [...prev, res.data]);
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    await api.delete(`/team/${id}`);
    setTeam((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Team Management
          </h1>
          <p className="text-xs text-slate-500">
            Add instructors and staff members who appear on the Team page.
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-500">
          Total members:{" "}
          <span className="font-semibold text-slate-900">{team.length}</span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            {editing ? "Edit Member" : "Add New Member"}
          </h2>
          {editing && (
            <button
              onClick={resetForm}
              className="text-xs text-indigo-600 hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>

        <form className="space-y-3 text-sm" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
              placeholder="Instructor, Mentor, etc."
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            {editing ? "Update Member" : "Add Member"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Team Members
        </h2>

        <div className="space-y-3 text-sm">
          {team.map((person) => (
            <div
              key={person.id}
              className="border border-slate-200 rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-slate-900">{person.name}</p>
                <p className="text-xs text-indigo-600">{person.role}</p>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {person.bio}
                </p>
              </div>

              <div className="text-xs flex flex-col gap-2">
                <button
                  onClick={() => startEdit(person)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(person.id)}
                  className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!loading && team.length === 0 && (
            <p className="text-xs text-slate-500">No team members yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
