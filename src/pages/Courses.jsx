import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function Courses({ adminMode }) {
  const { admin } = useAuth();
  const isAdmin = admin && adminMode;

  const emptyForm = {
    id: null,
    title: "",
    level: "",
    description: "",
    price: "",
    duration: "",
    lessons: "",
    thumbnail: "",
  };

  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch all courses
  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load courses. Please start JSON Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.level.trim() || !form.price) {
      setError("Please fill in Title, Level, and Price.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      level: form.level.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      duration: form.duration.trim(),
      lessons: form.lessons ? Number(form.lessons) : undefined,
      thumbnail: form.thumbnail.trim(),
    };

    try {
      setSaving(true);

      if (isEditing) {
        const { data } = await api.put(`/courses/${form.id}`, payload);
        setCourses((prev) =>
          prev.map((c) => (c.id === form.id ? data : c))
        );
      } else {
        const { data } = await api.post("/courses", payload);
        setCourses((prev) => [...prev, data]);
      }

      cancelEditing();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (course) => {
    setIsEditing(true);
    setForm({
      id: course.id,
      title: course.title,
      level: course.level,
      description: course.description,
      price: course.price,
      duration: course.duration || "",
      lessons: course.lessons || "",
      thumbnail: course.thumbnail || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete the course.");
    }
  };

  return (
    <div>
      <SectionHeader
        title={isAdmin ? "Admin Course Management" : "EduQuest Courses"}
        subtitle={
          isAdmin
            ? "Add, update, and manage courses available in the EduQuest platform."
            : "Explore expert-designed courses to accelerate your learning journey."
        }
      />

      {/* ADMIN PANEL */}
      {isAdmin && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-12">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {isEditing ? "Edit Course" : "Add New Course"}
          </h3>

          {error && (
            <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 p-2 rounded-lg">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6 text-sm"
          >
            {/* Course Title */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Course Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="React for Beginners"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Level
              </label>
              <input
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Beginner / Intermediate / Advanced"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="49"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Duration
              </label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="6 weeks / Self-paced"
              />
            </div>

            {/* Lessons */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Total Lessons
              </label>
              <input
                type="number"
                name="lesss"
                value={form.lessons}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="16"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Thumbnail (Image URL)
              </label>
              <input
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 h-28 resize-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write a detailed description of this course..."
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex gap-3 items-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {isEditing ? "Update Course" : "Add Course"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-6 py-2 bg-slate-200 text-slate-800 rounded-xl font-semibold hover:bg-slate-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* COURSES DISPLAY */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
          >
            <Link to={`/courses/${course.id}`} className="flex-1 flex flex-col">
              {/* Thumbnail */}
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                  No Image
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {course.title}
                  </h3>
                  <p className="text-xs text-indigo-600 font-medium mt-1">
                    {course.level} • {course.duration || "Self-paced"} •{" "}
                    {course.lessons || 12} lessons
                  </p>
                </div>

                <p className="text-sm text-slate-600 flex-1">
                  {course.description}
                </p>

                <p className="text-xl font-bold text-slate-900">
                  ${course.price}
                </p>
              </div>
            </Link>

            {isAdmin && (
              <div className="flex gap-2 px-5 pb-4">
                <button
                  onClick={() => startEdit(course)}
                  className="px-3 py-1 text-xs bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCourse(course.id)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && courses.length === 0 && (
        <p className="text-sm text-slate-500 mt-4">
          No courses available at the moment.
        </p>
      )}
    </div>
  );
}
