import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

export default function Enrolled() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/enrolledCourses");
        const enrolled = res.data;

        const enriched = await Promise.all(
          enrolled.map(async (course) => {
            const resProg = await api.get(
              `/progress?courseId=${course.courseId}`
            );
            const prog = resProg.data[0];

            let percent = 0;
            if (prog && prog.totalLessons > 0) {
              percent = Math.round(
                (prog.completedLessons.length / prog.totalLessons) * 100
              );
            }

            return {
              ...course,
              progress: percent,
            };
          })
        );

        setCourses(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this course?")) return;
    await api.delete(`/enrolledCourses/${id}`);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        title="My Enrolled Courses"
        subtitle="Continue where you left off and track what you've completed."
      />

      {loading && (
        <p className="text-sm text-slate-500">Loading enrolled courses...</p>
      )}

      {!loading && courses.length === 0 && (
        <p className="text-sm text-slate-500">
          You haven’t enrolled in any courses yet.{" "}
          <Link to="/courses" className="text-indigo-600 underline">
            Browse courses
          </Link>
          .
        </p>
      )}

      <div className="space-y-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 shadow-sm"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-32 h-20 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">
                {course.title}
              </h3>
              <p className="text-sm text-indigo-600">
                {course.level} • {course.duration}
              </p>

              {/* Progress */}
              <div className="mt-3">
                <div className="w-full bg-slate-200 h-2 rounded-full">
                  <div
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {course.progress || 0}% completed
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-3 text-sm">
                <Link
                  to={`/learn/${course.courseId}`}
                  className="px-4 py-1 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
                >
                  Continue learning
                </Link>

                {course.progress === 100 && (
                  <Link
                    to={`/certificate/${course.courseId}`}
                    className="px-4 py-1 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
                  >
                    View certificate 🎓
                  </Link>
                )}

                <button
                  onClick={() => handleRemove(course.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
