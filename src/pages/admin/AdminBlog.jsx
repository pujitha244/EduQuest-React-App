// src/pages/admin/AdminBlog.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogPosts");
      setPosts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      author: "",
      content: "",
    });
  };

  const startEdit = (post) => {
    setEditing(post);
    setForm({
      title: post.title,
      author: post.author,
      content: post.content,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editing) {
      const res = await api.put(`/blogPosts/${editing.id}`, {
        ...editing,
        ...form,
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === editing.id ? res.data : p))
      );
    } else {
      const res = await api.post("/blogPosts", form);
      setPosts((prev) => [...prev, res.data]);
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    await api.delete(`/blogPosts/${id}`);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Blog Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish and maintain learning articles for your students.
          </p>
        </div>
        <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-500">
          Total posts:{" "}
          <span className="font-semibold text-slate-900">
            {posts.length}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            {editing ? "Edit Blog Post" : "Create New Blog Post"}
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

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Author
              </label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 h-32 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
            >
              {editing ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Existing Posts
          </h2>
          {loading && (
            <span className="text-xs text-slate-400">Loading...</span>
          )}
        </div>

        <div className="space-y-3 text-sm">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-slate-200 rounded-xl p-3 flex justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {post.title}
                </p>
                <p className="text-xs text-slate-500">
                  by {post.author || "Unknown"}
                </p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {post.content}
                </p>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <button
                  onClick={() => startEdit(post)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!loading && posts.length === 0 && (
            <p className="text-xs text-slate-500">
              No posts found. Create one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
