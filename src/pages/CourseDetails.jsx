import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import SectionHeader from "../components/SectionHeader";
import ProgressAPI from "../api/progress";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [course, setCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [error, setError] = useState("");
  const [enrollStatus, setEnrollStatus] = useState("");

  const courseId = Number(id);

  /* -------------------------------- LOAD COURSE -------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [courseRes, reviewsRes, allCoursesRes, enrolledRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/reviews?courseId=${courseId}`),
          api.get("/courses"),
          api.get(`/enrolledCourses?courseId=${courseId}`),
        ]);

        setCourse(courseRes.data);
        setReviews(reviewsRes.data);
        setAllCourses(allCoursesRes.data);

        if (enrolledRes.data.length > 0) {
          setEnrollStatus("already");
        } else {
          setEnrollStatus("");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  /* ------------------------------ AVERAGE RATING ------------------------------ */
  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  /* ------------------------------ RELATED COURSES ----------------------------- */
  const relatedCourses = useMemo(() => {
    if (!course) return [];
    return allCourses
      .filter((c) => c.id !== course.id && c.level === course.level)
      .slice(0, 3);
  }, [course, allCourses]);

  /* ------------------------------ REVIEW HANDLERS ----------------------------- */
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      setError("Please fill in your name, rating, and comment.");
      return;
    }

    try {
      const payload = {
        courseId,
        name: reviewForm.name.trim(),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      };

      const { data } = await api.post("/reviews", payload);
      setReviews((prev) => [...prev, data]);

      setReviewForm({ name: "", rating: 5, comment: "" });
    } catch {
      setError("Failed to submit review. Check JSON Server.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    await api.delete(`/reviews/${reviewId}`);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  /* ------------------------------ ADMIN DELETE ------------------------------ */
  const handleAdminDeleteCourse = async () => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    await api.delete(`/courses/${courseId}`);
    navigate("/courses");
  };

  /* -------------------------------- ENROLL -------------------------------- */
  const handleEnroll = async () => {
    try {
      const existing = await api.get(`/enrolledCourses?courseId=${courseId}`);

      if (existing.data.length > 0) {
        setEnrollStatus("already");
        return;
      }

      // Enroll the course
      await api.post("/enrolledCourses", {
        courseId: course.id,
        title: course.title,
        level: course.level,
        duration: course.duration,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price
      });

      // Create progress entry
      await ProgressAPI.create(course.id, course.lessons);

      setEnrollStatus("success");
    } catch {
      setEnrollStatus("error");
    }
  };


  /* --------------------------------- UI --------------------------------- */
  if (loading) {
    return <p className="text-sm text-slate-500">Loading course...</p>;
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">Course not found.</p>
        <Link to="/courses" className="text-sm text-indigo-600 underline">
          Back to all courses
        </Link>
      </div>
    );
  }

  const isFreeCourse = course.price === 0;

  return (
    <div className="space-y-12">
      {/* ------------------------------- HERO ------------------------------ */}
      <section className="flex flex-col lg:flex-row gap-8">
        {/* Main Info */}
        <div className="flex-1 space-y-4">
          <SectionHeader
            title={course.title}
            subtitle={`A ${course.level} level course designed to build real skills.`}
          />

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            {averageRating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{averageRating}</span>
                <span>({reviews.length} reviews)</span>
              </div>
            )}
            <span>Level: {course.level}</span>
            <span>Duration: {course.duration || "Self-paced"}</span>
            <span>Lessons: {course.lessons || 12}</span>
          </div>

          <p className="text-sm text-slate-700">{course.description}</p>

          {/* ENROLLMENT STATUS + BUTTONS */}
          <div className="space-y-3 pt-3">

            {/* SUCCESS */}
            {enrollStatus === "success" && (
              <div className="space-y-2">
                <p className="text-green-600 text-sm font-semibold">
                  You are now enrolled in this course!
                </p>

                <Link
                  to={`/learn/${courseId}`}
                  className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  Start Learning →
                </Link>

                <Link
                  to="/enrolled"
                  className="block text-sm text-indigo-600 underline"
                >
                  Go to My Courses
                </Link>
              </div>
            )}

            {/* ALREADY ENROLLED */}
            {enrollStatus === "already" && (
              <div className="space-y-2">
                <p className="text-blue-600 text-sm font-semibold">
                  You are already enrolled.
                </p>

                <Link
                  to={`/learn/${courseId}`}
                  className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                >
                  Continue Learning →
                </Link>

                <Link
                  to="/enrolled"
                  className="block text-sm text-indigo-600 underline"
                >
                  View Enrolled Courses
                </Link>
              </div>
            )}

            {/* ERROR */}
            {enrollStatus === "error" && (
              <p className="text-red-600 text-sm">
                Something went wrong while enrolling.
              </p>
            )}

            {/* ENROLL BUTTON */}
            <button
              onClick={handleEnroll}
              className={`px-5 py-2 rounded-xl text-sm font-semibold text-white
                ${isFreeCourse ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}
              `}
            >
              {isFreeCourse ? "Enroll for Free" : "Enroll Now"}
            </button>

            <Link
              to="/courses"
              className="px-5 py-2 rounded-xl border border-slate-300 text-sm font-semibold hover:bg-slate-100"
            >
              Back to Courses
            </Link>
          </div>

          {/* ADMIN BUTTONS */}
          {admin && (
            <div className="pt-3 flex gap-3">
              <Link
                to="/admin/courses"
                className="px-3 py-1 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 text-xs"
              >
                Edit in Admin Panel
              </Link>
              <button
                onClick={handleAdminDeleteCourse}
                className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600"
              >
                Delete Course
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72">
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-5 space-y-3">
              <p
                className={`text-2xl font-extrabold ${isFreeCourse ? "text-emerald-600" : "text-slate-900"
                  }`}
              >
                {isFreeCourse ? "FREE" : `$${course.price}`}
              </p>

              <ul className="space-y-1 text-slate-600 text-sm">
                <li>• Mobile + Desktop access</li>
                <li>• Downloadable resources</li>
                <li>• Self-paced learning</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>

      {/* ------------------------------- REVIEWS ------------------------------ */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Student Reviews</h3>

          {reviews.length === 0 && (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          )}

          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white border rounded-2xl p-4 flex justify-between"
              >
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-yellow-500">
                    {"★".repeat(r.rating)}
                  </p>
                  <p className="text-sm">{r.comment}</p>
                </div>

                {admin && (
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="px-2 py-1 text-white bg-red-500 rounded-lg text-xs"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Review */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Add Your Review</h3>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border p-2 rounded-lg">
              {error}
            </p>
          )}

          <form
            onSubmit={handleReviewSubmit}
            className="bg-white border rounded-2xl p-5 space-y-3 text-sm"
          >
            <div>
              <label className="text-xs text-slate-600">Name</label>
              <input
                name="name"
                value={reviewForm.name}
                onChange={handleReviewChange}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Rating</label>
              <select
                name="rating"
                value={reviewForm.rating}
                onChange={handleReviewChange}
                className="w-full border rounded-xl px-3 py-2"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600">Comment</label>
              <textarea
                name="comment"
                value={reviewForm.comment}
                onChange={handleReviewChange}
                className="w-full border rounded-xl px-3 py-2 h-24 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* ---------------------------- RELATED COURSES ---------------------------- */}
      {relatedCourses.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Related Courses</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedCourses.map((rc) => (
              <Link
                key={rc.id}
                to={`/courses/${rc.id}`}
                className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md"
              >
                <h4 className="font-semibold">{rc.title}</h4>
                <p className="text-xs text-indigo-600">
                  {rc.level} • {rc.duration}
                </p>
                <p className="text-sm mt-1">{rc.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
