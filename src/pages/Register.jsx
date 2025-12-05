// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(form); // auto-login
      navigate("/"); // go home
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900 mb-1">Create Account</h1>
      <p className="text-xs text-slate-500 mb-4">
        Students can sign up freely. Admin accounts are added manually in JSON Server.
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg mb-3">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="space-y-3 text-sm">
        <div>
          <label className="block text-xs mb-1 text-slate-600">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-xs mb-1 text-slate-600">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-xs mb-1 text-slate-600">Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 mt-2 text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-50 shine"
        >
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-xs text-center mt-4 text-slate-500">
        Already have an account?{" "}
        <a href="/login" className="text-purple-600 underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
