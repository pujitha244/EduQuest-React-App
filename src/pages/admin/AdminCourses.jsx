// src/pages/admin/AdminCourses.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null); // course or null
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    level: "Beginner",
    description: "",
    price: 0,
    duration: "",
    lessons: 0,
    thumbnail: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      level: "Beginner",
      description: "",
      price: 0,
      duration: "",
      lessons: 0,
      thumbnail: "",
    });
  };

  const startEdit = (course) => {
    setEditing(course);
    setForm({
      title: course.title,
      level: course.level,
      description: course.description,
      price: course.price,
      duration: course.duration,
      lessons: course.lessons,
      thumbnail: course.thumbnail || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "lessons" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    if (editing) {
      // update
      const res = await api.put(`/courses/${editing.id}`, {
        ...editing,
        ...form,
      });
      setCourses((prev) =>
        prev.map((c) => (c.id === editing.id ? res.data : c))
      );
    } else {
      // create new
      const res = await api.post("/courses", form);
      setCourses((prev) => [...prev, res.data]);
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    await api.delete(`/courses/${id}`);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Courses Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, update, and remove courses that appear on EduQuest.
          </p>
        </div>

        <div className="flex gap-4 text-xs text-slate-500">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200">
            Total courses:{" "}
            <span className="font-semibold text-slate-900">
              {courses.length}
            </span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            {editing ? "Edit Course" : "Create New Course"}
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

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4 text-sm"
        >
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Level
            </label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Price (USD)
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Duration
            </label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 6 weeks"
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Lessons count
            </label>
            <input
              name="lessons"
              type="number"
              value={form.lessons}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Thumbnail URL
            </label>
            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-slate-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 h-20 resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
            >
              {editing ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Existing Courses
          </h2>
          {loading && (
            <span className="text-xs text-slate-400">Loading...</span>
          )}
        </div>

        <div className="space-y-3 text-sm">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-slate-200 rounded-xl p-3 flex justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">
                  {course.title}
                </p>
                <p className="text-xs text-indigo-600">
                  {course.level} • {course.duration} • ${course.price}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <button
                  onClick={() => startEdit(course)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!loading && courses.length === 0 && (
            <p className="text-xs text-slate-500">
              No courses yet. Create your first course above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
