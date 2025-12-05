// src/pages/Certificate.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/api";

export default function Certificate() {
  const { courseId } = useParams();
  const { user } = useAuth(); // <-- student info (name, email)
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${courseId}`)
      .then(res => setCourse(res.data))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (!user) {
    return (
      <div className="text-center text-slate-600 text-sm">
        Please <Link to="/login" className="text-indigo-600 underline">login</Link> to view your certificate.
      </div>
    );
  }

  if (loading) return <p className="text-slate-600">Loading certificate...</p>;

  if (!course) {
    return (
      <p className="text-red-600 text-sm">
        Course not found.  
        <Link to="/courses" className="text-indigo-600 underline">Back to Courses</Link>
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-300 shadow-xl rounded-2xl p-10 mt-10">

      {/* Certificate Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Certificate of Completion</h1>
        <p className="text-slate-600 mt-1">This is to certify that</p>
      </div>

      {/* Student Name */}
      <h2 className="text-center text-2xl font-bold text-indigo-700 my-4">
        {user.name || user.email.split("@")[0]}
      </h2>

      <p className="text-center text-slate-700 mb-6">
        has successfully completed the course:
      </p>

      {/* Course Title */}
      <h3 className="text-center text-xl font-semibold text-slate-800 mb-4">
        {course.title}
      </h3>

      {/* Completion message */}
      <p className="text-center text-slate-600 leading-relaxed mb-10">
        with dedication, persistence, and successful performance across lessons.
        This certificate is awarded as recognition of outstanding effort and learning progress.
      </p>

      {/* Footer section */}
      <div className="flex justify-between items-center mt-10 px-4">
        <div className="text-left">
          <p className="font-semibold text-slate-800">EduQuest Academy</p>
          <p className="text-slate-500 text-sm">Explore • Learn • Thrive</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Issued on:</p>
          <p className="font-medium text-slate-800">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-10 text-center">
        <Link
          to="/enrolled"
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          Back to My Courses
        </Link>
      </div>
    </div>
  );
}
