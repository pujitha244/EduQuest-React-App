// src/pages/admin/AdminLessons.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    videoUrl: "",
    pdfUrl: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [lessonRes, courseRes] = await Promise.all([
      api.get("/lessons"),
      api.get("/courses"),
    ]);
    setLessons(lessonRes.data);
    setCourses(courseRes.data);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      courseId: "",
      title: "",
      description: "",
      videoUrl: "",
      pdfUrl: "",
    });
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({
      courseId: item.courseId,
      title: item.title,
      description: item.description,
      videoUrl: item.videoUrl,
      pdfUrl: item.pdfUrl,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      const res = await api.put(`/lessons/${editing.id}`, {
        ...editing,
        ...form,
        courseId: Number(form.courseId),
      });

      setLessons((prev) =>
        prev.map((l) => (l.id === editing.id ? res.data : l))
      );
    } else {
      const res = await api.post("/lessons", {
        ...form,
        courseId: Number(form.courseId),
      });
      setLessons((prev) => [...prev, res.data]);
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    await api.delete(`/lessons/${id}`);
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-slate-900">
        Lessons Management
      </h1>
      <p className="text-xs text-slate-500">
        Add videos and PDFs to courses.
      </p>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-sm">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold text-slate-800">
            {editing ? "Edit Lesson" : "Add Lesson"}
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

        <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs mb-1">Course</label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={(e) =>
                setForm((p) => ({ ...p, courseId: e.target.value }))
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
              required
            >
              <option value="">Choose course</option>

              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2 h-24 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Video URL</label>
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, videoUrl: e.target.value }))
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
              placeholder="YouTube embed link"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">PDF URL</label>
            <input
              name="pdfUrl"
              value={form.pdfUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, pdfUrl: e.target.value }))
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
              placeholder="Direct PDF link"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              {editing ? "Update Lesson" : "Create Lesson"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          All Lessons
        </h2>

        <div className="space-y-3">
          {lessons.map((l) => (
            <div
              key={l.id}
              className="border border-slate-200 rounded-xl p-3 flex justify-between"
            >
              <div>
                <p className="font-semibold">{l.title}</p>
                <p className="text-xs text-indigo-600">
                  Course:{" "}
                  {courses.find((c) => Number(c.id) === Number(l.courseId))
                    ?.title || "Unknown"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {l.description}
                </p>
              </div>

              <div className="text-xs flex flex-col gap-2">
                <button
                  onClick={() => startEdit(l)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(l.id)}
                  className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {lessons.length === 0 && (
            <p className="text-xs text-slate-500">No lessons found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
