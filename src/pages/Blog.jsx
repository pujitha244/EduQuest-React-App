import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";

const emptyForm = {
  title: "",
  author: "",
  content: "",
};

export default function Blog({ adminMode }) {
  const { admin } = useAuth();
  const isAdmin = admin && adminMode;

  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/blogPosts")
      .then((res) => setPosts(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.author.trim()) {
      setError("Please fill in the title and author.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      content: form.content.trim(),
    };

    const { data } = await api.post("/blogPosts", payload);
    setPosts((prev) => [...prev, data]);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`/blogPosts/${id}`);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        title={isAdmin ? "Blog Management" : "EduQuest Blog"}
        subtitle={
          isAdmin
            ? "Write and manage articles to support your learners."
            : "Explore learning tips, roadmap guides, and career insights."
        }
      />

      <section className="grid md:grid-cols-3 gap-8">
        {/* Admin form – only in admin route */}
        {isAdmin && (
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 h-fit">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Create new post
            </h3>

            {error && (
              <p className="text-red-600 text-xs mb-2 bg-red-50 border border-red-200 p-2 rounded-lg">
                {error}
              </p>
            )}

            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Author
                </label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Publish
              </button>
            </form>
          </div>
        )}

        {/* Posts list */}
        <div
          className={
            isAdmin ? "md:col-span-2 space-y-4" : "md:col-span-3 space-y-4"
          }
        >
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link to={`/blog/${post.id}`} className="block">
                    <h3 className="text-lg font-semibold text-slate-900 hover:underline">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-1">
                    by {post.author}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>

              <Link to={`/blog/${post.id}`} className="block">
                <p className="text-sm text-slate-700 mt-3">
                  {post.content.length > 180
                    ? post.content.slice(0, 180) + "..."
                    : post.content}
                </p>
              </Link>
            </article>
          ))}

          {posts.length === 0 && (
            <p className="text-sm text-slate-500">
              Blog posts will appear here once data is available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
