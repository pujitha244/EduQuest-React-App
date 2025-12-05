import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import api from "../api/api";

export default function Home() {
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    // Load first 3 courses as "popular"
    api
      .get("/courses")
      .then((res) => setPopularCourses(res.data.slice(0, 3)))
      .catch(() => { });
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-10">
        {/* Left content */}
        <div className="flex-1 space-y-5">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Limitless Learning
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Unlock your potential with{" "}
            <span className="text-purple-600">EduQuest</span>.
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Join thousands of learners on a journey of discovery. Access
            top-tier courses, receive mentorship from industry experts, and
            build the practical skills you need to shape your future.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="px-5 py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 shine"
            >
              Browse Courses
            </Link>
            <Link
              to="/about"
              className="px-5 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              How EduQuest Works
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-600">
            <div>
              <p className="font-bold text-slate-900">Industry-Recognized</p>
              <p>Curriculum designed by top experts.</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Self-Paced Learning</p>
              <p>Study on your schedule, anytime.</p>
            </div>
          </div>
        </div>

        {/* Right visual / stats card */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "150+", label: "Active Courses" },
                { value: "10k+", label: "Students Enrolled" },
                { value: "4.9/5", label: "Student Rating" },
                { value: "24/7", label: "Mentor Support" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-100 p-3 text-center bg-slate-50"
                >
                  <p className="text-lg font-bold text-purple-600">
                    {item.value}
                  </p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900 mb-1">
                Start your journey today
              </p>
              <p>
                Whether you want to advance your career or explore a new hobby,
                EduQuest provides the tools and community to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Features */}
      <section>
        <SectionHeader
          title="Why learners choose EduQuest"
          subtitle="We focus on providing a seamless, interactive, and high-quality learning experience for everyone."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Expert-Led Instruction",
              text: "Learn directly from professionals who have worked at top-tier companies and mastered their fields.",
            },
            {
              title: "Interactive Projects",
              text: "Don't just watch videos. Build real-world projects that reinforce your learning and build your portfolio.",
            },
            {
              title: "Career Advancement",
              text: "Earn certificates upon completion and gain the confidence to ask for a promotion or switch careers.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <h3 className="font-semibold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Courses Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Trending Courses
          </h2>
          <Link
            to="/courses"
            className="text-sm text-purple-600 hover:underline"
          >
            View all courses →
          </Link>
        </div>

        {popularCourses.length === 0 ? (
          <p className="text-sm text-slate-500">
            Loading top courses for you...
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {popularCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {course.title}
                  </h3>
                  <p className="text-xs text-purple-600 mt-1">
                    {course.level} • {course.duration || "Self-paced"}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                    {course.description}
                  </p>
                </div>
                <p className="text-base font-bold text-slate-900 mt-3">
                  ${course.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}