import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import api from "../api/api";

const emptyForm = {
  name: "",
  email: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await api.post("/contacts", form);
      setForm(emptyForm);
      setStatus("Thank you! Your message has been sent successfully.");
    } catch {
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Contact Us"
        subtitle="Have questions about our courses, pricing, or need technical support? We're here to help."
      />

      <section className="grid md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-4 text-sm text-slate-600">
          <p>
            At EduQuest, we value our community of learners and educators. 
            Whether you are looking for guidance on which course to take, 
            need assistance with your account, or want to explore partnership 
            opportunities, our team is ready to assist you.
          </p>
          <p>
            We believe in prompt and personal communication. Once you submit 
            your inquiry, it is routed directly to our support specialists 
            who will ensure you get the answers you need to keep moving forward 
            in your learning journey.
          </p>

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-900">Get in touch directly</p>
            <p>Email: support@eduquest.com</p>
            <p>Response time: Typically within 24 hours</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          {status && (
            <p className="text-xs mb-3 text-green-600 bg-green-50 border border-green-200 p-2 rounded-lg">
              {status}
            </p>
          )}
          {error && (
            <p className="text-xs mb-3 text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}