import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import ProgressAPI from "../api/progress";
import SectionHeader from "../components/SectionHeader";

export default function LearnCourse() {
  const { courseId } = useParams();
  const numericCourseId = Number(courseId);

  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const resLessons = await api.get(`/lessons?courseId=${numericCourseId}`);
      setLessons(resLessons.data);

      let prog = await ProgressAPI.get(numericCourseId);
      if (!prog) {
        prog = await ProgressAPI.create(
          numericCourseId,
          resLessons.data.length
        );
      }

      setProgress(prog);
      setLoading(false);
    }
    load();
  }, [numericCourseId]);

  const toggleComplete = async (lessonId) => {
    if (!progress) return;

    const isCompleted = progress.completedLessons.includes(lessonId);

    const updated = {
      ...progress,
      completedLessons: isCompleted
        ? progress.completedLessons.filter((l) => l !== lessonId)
        : [...progress.completedLessons, lessonId],
      lastLesson: lessonId,
    };

    const saved = await ProgressAPI.update(progress.id, updated);
    setProgress(saved);
  };

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading lessons...</p>;
  }

  if (!lessons.length) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          No lessons have been added for this course yet.
        </p>
        <Link
          to="/courses"
          className="text-indigo-600 underline text-sm"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  const completedCount = progress?.completedLessons.length || 0;
  const total = progress?.totalLessons || lessons.length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;
  const isCompleted = percent === 100 && total > 0;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Course Lessons"
        subtitle="Watch videos, read resources, and track your progress."
      />

      {/* Progress Bar & Certificate Button */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[220px]">
          <p className="text-sm font-semibold text-slate-700 mb-2">
            Progress: {completedCount}/{total} lessons ({percent}%)
          </p>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-3 bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {isCompleted && (
          <Link
            to={`/certificate/${numericCourseId}`}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            View Certificate 🎓
          </Link>
        )}
      </div>

      {/* Lessons List */}
      <div className="space-y-6">
        {lessons.map((lesson) => {
          const done =
            progress && progress.completedLessons.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  {done && <span className="text-green-600 text-xl">✔</span>}
                  {lesson.title}
                </h3>

                <button
                  onClick={() => toggleComplete(lesson.id)}
                  className={`px-4 py-1 rounded-xl text-sm font-semibold ${
                    done
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {done ? "Completed" : "Mark Complete"}
                </button>
              </div>

              <p className="text-sm text-slate-600 mt-1">
                {lesson.description}
              </p>

              {/* Video */}
              <div className="mt-4 rounded-xl overflow-hidden shadow-sm">
                <iframe
                  className="w-full h-64 md:h-80"
                  src={lesson.videoUrl}
                  title={lesson.title}
                  allowFullScreen
                />
              </div>

              {/* PDF Link */}
              {lesson.pdfUrl && (
                <div className="mt-3">
                  <a
                    href={lesson.pdfUrl}
                    target="_blank"
                    className="text-indigo-600 underline text-sm"
                  >
                    Download PDF Resource
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
