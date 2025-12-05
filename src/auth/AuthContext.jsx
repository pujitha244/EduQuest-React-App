// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name?, email, role }
  const [loading, setLoading] = useState(true);

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("eduquest_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("eduquest_user");
      }
    }
    setLoading(false);
  }, []);

  // LOGIN: validate admin or treat as student
  const login = (email, password) => {
    const adminEmail = "admin@eduquest.com";
    const adminPass = "admin@123";

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      throw new Error("Please enter email and password.");
    }

    let role = "student";
    if (trimmedEmail === adminEmail && trimmedPass === adminPass) {
      role = "admin";
    }

    const authUser = { email: trimmedEmail, role };
    setUser(authUser);
    localStorage.setItem("eduquest_user", JSON.stringify(authUser));
    return authUser;
  };

  // REGISTER: create student (or admin if email matches), then auto-login
  const register = async ({ name, email, password }) => {
    const trimmedName = name?.trim() || "";
    const trimmedEmail = email?.trim() || "";
    const trimmedPass = password?.trim() || "";

    if (!trimmedName || !trimmedEmail || !trimmedPass) {
      throw new Error("Please fill all fields.");
    }
    if (trimmedPass.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    // Match your UI note: students can sign up freely; admin accounts manual.
    // If you still want to flag admin by email, keep this logic; otherwise force 'student'.
    const adminEmail = "admin@eduquest.com";
    let role = trimmedEmail === adminEmail ? "admin" : "student";

    const newUser = { name: trimmedName, email: trimmedEmail, role };
    setUser(newUser);
    localStorage.setItem("eduquest_user", JSON.stringify(newUser));
    return newUser;
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("eduquest_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        login,
        logout,
        register, // added
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Helpful guard to catch missing provider during development
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
