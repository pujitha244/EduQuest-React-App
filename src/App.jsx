import { Routes, Route } from "react-router-dom";

// Public pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Team from "./pages/Team";
import Testimonials from "./pages/Testimonials";

import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import Enrolled from "./pages/Enrolled";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import LearnCourse from "./pages/LearnCourse";
import Certificate from "./pages/Certificate";

// Admin pages
import AdminCourses from "./pages/admin/AdminCourses";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminLessons from "./pages/admin/AdminLessons";

// Auth
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />

            {/* Courses */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />

            {/* Learning Page */}
            <Route path="/learn/:courseId" element={<LearnCourse />} />

            {/* Certificates */}
            <Route path="/certificate/:courseId" element={<Certificate />} />

            {/* Other Public Pages */}
            <Route path="/team" element={<Team />} />
            <Route path="/testimonials" element={<Testimonials />} />

            
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/enrolled" element={<Enrolled />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            {/* ===================== ADMIN ROUTES ===================== */}
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminCourses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminBlog />
                </ProtectedRoute>
              }
            />



            <Route
              path="/admin/team"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminTeam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/testimonials"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminTestimonials />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/lessons"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminLessons />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}
