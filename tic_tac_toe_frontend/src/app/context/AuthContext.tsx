import React, { createContext, useContext, useState, useEffect } from "react";
import { apiMe } from "../api";

type AuthContextType = {
  token: string | null;
  user: { username: string; score: number } | null;
  setAuth: (token: string, user: { username: string; score: number }) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setAuth: () => {},
  logout: () => {},
  loading: true
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string; score: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, attempt to load token/user from localStorage
    const t = (typeof window !== "undefined") ? localStorage.getItem("jwt") : null;
    const u = (typeof window !== "undefined") ? localStorage.getItem("user") : null;
    if (t && u) {
      setToken(t);
      try {
        const parsed = JSON.parse(u);
        setUser(parsed);
      } catch {}
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Validate token & update user info if needed
    if (token && !user) {
      apiMe(token)
        .then(u => {
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));
        })
        .catch(() => {
          logout();
        });
    }
    // eslint-disable-next-line
  }, [token]);

  function setAuth(token: string, userData: { username: string; score: number }) {
    setToken(token);
    setUser(userData);
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ token, user, setAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
