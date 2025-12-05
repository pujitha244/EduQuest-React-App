import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const postId = Number(id);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [postRes, listRes] = await Promise.all([
          api.get(`/blogPosts/${postId}`),
          api.get("/blogPosts"),
        ]);
        setPost(postRes.data);
        setOtherPosts(
          listRes.data.filter((p) => p.id !== postId).slice(0, 3)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading article...</p>;
  }

  if (!post) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">
          Blog post not found or failed to load.
        </p>
        <Link
          to="/blog"
          className="text-sm text-indigo-600 hover:underline"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[2fr,1fr] gap-10">
      {/* Main content */}
      <article className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <p className="text-xs uppercase text-indigo-600 font-semibold mb-2">
          EduQuest Blog
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
          {post.title}
        </h1>
        <p className="text-xs text-slate-500 mb-5">
          by {post.author || "EduQuest Team"}
        </p>

        <div className="prose prose-sm max-w-none text-slate-800">
          {/* For now, treat content as plain text with line breaks */}
          <p className="whitespace-pre-line">{post.content}</p>
        </div>

        <div className="mt-6">
          <Link
            to="/blog"
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to all articles
          </Link>
        </div>
      </article>

      {/* Sidebar: other posts */}
      <aside className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">
          More from EduQuest
        </h3>
        {otherPosts.length === 0 && (
          <p className="text-xs text-slate-500">
            More posts will appear here.
          </p>
        )}
        <div className="space-y-3">
          {otherPosts.map((p) => (
            <Link
              key={p.id}
              to={`/blog/${p.id}`}
              className="block bg-white border border-slate-200 rounded-2xl p-3 text-sm hover:shadow-sm"
            >
              <p className="font-semibold text-slate-900">{p.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {p.author || "EduQuest Team"}
              </p>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
