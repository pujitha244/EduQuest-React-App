import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import api from "../api/api";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api
      .get("/testimonials")
      .then((res) => setTestimonials(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-10">
      <SectionHeader
        title="What learners say"
        subtitle="Feedback from students and professionals who used EduQuest-style platforms to refine their skills."
      />

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between"
          >
            <p className="text-sm text-slate-700 mb-3">
              “{t.comment}”
            </p>
            <p className="text-xs font-semibold text-slate-600">
              — {t.name}
            </p>
          </div>
        ))}

        {testimonials.length === 0 && (
          <p className="text-sm text-slate-500">
            Testimonials will appear here once data is available.
          </p>
        )}
      </section>
    </div>
  );
}
