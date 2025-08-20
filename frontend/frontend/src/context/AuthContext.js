// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children, onRequireAuth }) {
  const [user, setUser] = useState(null);
  const [rehydrated, setRehydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Rehydrate user if a token exists
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("ch_token");
    if (!token) { setRehydrated(true); return; }
    (async () => {
      try {
        const me = await apiFetch("/auth/me", { method: "GET" });
        setUser(me);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("ch_token");
      } finally {
        setRehydrated(true);
      }
    })();
  }, []);

  // Open login modal on 401
  useEffect(() => {
    const handler = () => onRequireAuth?.();
    window.addEventListener("auth:unauthorized", handler);
    return () => window.removeEventListener("auth:unauthorized", handler);
  }, [onRequireAuth]);

  async function signup(payload) {
    setLoading(true);
    try {
      const resp = await apiFetch("/auth/signup", {
        method: "POST",
        auth: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      localStorage.setItem("token", resp.access_token);
      localStorage.setItem("ch_token", resp.access_token);
      setUser(resp.user);
      return resp.user;
    } finally { setLoading(false); }
  }

  async function login(payload) {
    setLoading(true);
    try {
      const resp = await apiFetch("/auth/login", {
        method: "POST",
        auth: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      localStorage.setItem("token", resp.access_token);
      localStorage.setItem("ch_token", resp.access_token);
      setUser(resp.user);
      return resp.user;
    } finally { setLoading(false); }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("ch_token");
    setUser(null);
  }

  const value = { user, isAuthed: !!user, loading, signup, login, logout };
  return <AuthContext.Provider value={value}>{rehydrated ? children : null}</AuthContext.Provider>;
}
