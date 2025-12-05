import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import eduQuestLogo from "../assets/eduquest-logo.png";

const base = "text-sm font-medium hover:text-purple-600 transition-colors";
const active = "text-purple-600 font-semibold";

export default function Navbar() {
  const { user, role, logout } = useAuth();

  return (
    <header className="border-b border-purple-100 glass sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={eduQuestLogo}
            alt="EduQuest logo"
            className="h-12 w-12 md:h-14 md:w-14 rounded-2xl object-contain"
          />
          <div className="leading-tight">
            <p className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight">
              EduQuest
            </p>
            <p className="text-[11px] md:text-sm text-slate-500 tracking-wide">
              Explore • Learn • Thrive
            </p>
          </div>
        </Link>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/about">About</NavItem>
          <NavItem to="/courses">Courses</NavItem>
          <NavItem to="/blog">Blog</NavItem>
          <NavItem to="/team">Team</NavItem>
          <NavItem to="/testimonials">Testimonials</NavItem>
          <NavItem to="/enrolled">Enrolled</NavItem>
          <NavItem to="/contact">Contact</NavItem>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {role === "admin" && <AdminMenu />}

          {user && (
            <span className="hidden md:inline text-xs text-slate-600">
              Hi, {user.name || user.email.split("@")[0]}
            </span>
          )}

          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-xs px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shine"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

/*****************************
 * NAV LINK
 *****************************/
function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => base + (isActive ? " " + active : "")}
    >
      {children}
    </NavLink>
  );
}

/*****************************
 * ADMIN MENU (CLICK DROPDOWN)
 *****************************/
function AdminMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-xs px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shine"
      >
        Admin Panel ▾
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
          <DropdownLink to="/admin/courses">Manage Courses</DropdownLink>
          <DropdownLink to="/admin/blog">Manage Blog</DropdownLink>
          <DropdownLink to="/admin/team">Manage Team</DropdownLink>
          <DropdownLink to="/admin/testimonials">
            Manage Testimonials
          </DropdownLink>
          <DropdownLink to="/admin/lessons">Manage Lessons</DropdownLink>
        </div>
      )}
    </div>
  );
}

function DropdownLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
    >
      {children}
    </Link>
  );
}
