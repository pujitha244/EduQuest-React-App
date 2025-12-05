// src/pages/admin/AdminTestimonials.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    comment: "",
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/testimonials");
      setTestimonials(res.data);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", comment: "" });
  };

  const startEdit = (t) => {
    setEditing(t);
    setForm({ name: t.name, comment: t.comment });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      const res = await api.put(`/testimonials/${editing.id}`, {
        ...editing,
        ...form,
      });
      setTestimonials((prev) =>
        prev.map((x) => (x.id === editing.id ? res.data : x))
      );
    } else {
      const res = await api.post("/testimonials", form);
      setTestimonials((prev) => [...prev, res.data]);
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await api.delete(`/testimonials/${id}`);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Testimonials Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage student feedback shown on the website.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            {editing ? "Edit Testimonial" : "Add Testimonial"}
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
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Comment
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={(e) =>
                setForm((p) => ({ ...p, comment: e.target.value }))
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2 h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm"
          >
            {editing ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Testimonials
        </h2>

        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="border border-slate-200 rounded-xl p-3 flex justify-between"
            >
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-slate-500 mt-1">{t.comment}</p>
              </div>

              <div className="text-xs flex flex-col gap-2">
                <button
                  onClick={() => startEdit(t)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!loading && testimonials.length === 0 && (
            <p className="text-xs text-slate-500">No testimonials added.</p>
          )}
        </div>
      </div>
    </div>
  );
}
