// src/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // While checking user state
  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Checking access...
      </p>
    );
  }

  // Not logged in → send to login page
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // If roles specified and current role not allowed → back to home
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Allowed → render the protected content
  return children;
}
