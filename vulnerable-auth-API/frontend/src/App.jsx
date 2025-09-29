/*
Front-end UI for vulnerable-auth-API
- Single-file React component (App.jsx) suitable for Vite + React setup
- Uses Tailwind classes (you can remove or adapt if not using Tailwind)
- Features: Register, Login, Profile (protected), logout, error handling
- Config: set API_BASE in the code (default: http://localhost:3000)

How to use:
1. Create a Vite React project: `npm create vite@latest frontend -- --template react`
2. Install deps and Tailwind (optional) or just run with plain CSS.
3. Replace src/App.jsx with this file, run `npm install` and `npm run dev`.

This file is intentionally minimal but production-ready enough to connect to the API.
*/

import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";

// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";


export default function App() {
  const [view, setView] = useState("login"); // 'login' | 'register' | 'profile' | 'admin'
  const [token, setToken] = useState(localStorage.getItem("vuln_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  async function fetchProfile() {
    setLoading(true);
    setMessage("");
    try {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
      //const res = await fetch(`${API_BASE}/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user || data);
        setView("profile");
      } else {
        setMessage(data.message || JSON.stringify(data));
        // token might be invalid
        setToken("");
        localStorage.removeItem("vuln_token");
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    const form = e.target;
    const body = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
    };
    setLoading(true);
    try {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registered successfully. You can now log in.");
        setView("login");
      } else {
        setMessage(data.message || JSON.stringify(data));
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    const form = e.target;
    const body = {
      email: form.email.value,
      password: form.password.value,
    };
    setLoading(true);
    try {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        // common patterns: { token: '...', user: {...} } or {token}
        const t = data.token || data.accessToken || data.authToken;
        if (t) {
          localStorage.setItem("vuln_token", t);
          setToken(t);
          setMessage("Login successful.");
        } else {
          setMessage("Login succeeded but server didn't return a token.");
        }
      } else {
        setMessage(data.message || JSON.stringify(data));
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("vuln_token");
    setView("login");
  }

  // --- BEGIN RETURN STATEMENT ---
  return (
  <div className="bg-black font-mono min-h-screen w-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl p-6 border border-green-400 neon-glow">
        <header className="mb-8 text-center z-10 relative">
          <h1 className="text-4xl font-extrabold text-green-400 tracking-widest animate-pulse drop-shadow-lg" style={{zIndex: 10}}>VULN AUTH TERMINAL</h1>
          <p className="text-lg text-green-300 mt-2">Cybersecurity Demo Portal</p>
        </header>

        <nav className="flex gap-2 mb-4 justify-center">
          <button onClick={() => setView("login")}
            className={`px-3 py-1 rounded border border-green-400 transition-all duration-150 ${view === 'login' ? 'bg-green-400 text-black neon-btn' : 'bg-gray-800 text-green-300 hover:bg-green-700 hover:text-black'}`}>Login</button>
          <button onClick={() => setView("register")}
            className={`px-3 py-1 rounded border border-green-400 transition-all duration-150 ${view === 'register' ? 'bg-green-400 text-black neon-btn' : 'bg-gray-800 text-green-300 hover:bg-green-700 hover:text-black'}`}>Register</button>
          <button onClick={() => fetchProfile()}
            className={`px-3 py-1 rounded border border-green-400 transition-all duration-150 ${view === 'profile' ? 'bg-green-400 text-black neon-btn' : 'bg-gray-800 text-green-300 hover:bg-green-700 hover:text-black'}`}>Me</button>
          {user && user.role === 'admin' && (
            <button onClick={() => setView('admin')}
              className={`px-3 py-1 rounded border border-green-400 transition-all duration-150 ${view === 'admin' ? 'bg-purple-400 text-black neon-btn' : 'bg-gray-800 text-purple-300 hover:bg-purple-700 hover:text-black'}`}>Admin</button>
          )}
        </nav>

        {message && (
          <div className="mb-4 p-2 rounded bg-black text-red-400 border border-red-400 text-sm animate-pulse">{message}</div>
        )}

        {loading && <div className="mb-4 text-green-400 text-sm animate-pulse">Loading…</div>}

        {view === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <label className="block">
              <div className="text-sm text-green-300">Name</div>
              <input name="name" required className="mt-1 w-full p-2 border border-green-400 rounded bg-black text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </label>
            <label className="block">
              <div className="text-sm text-green-300">Email</div>
              <input type="email" name="email" required className="mt-1 w-full p-2 border border-green-400 rounded bg-black text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </label>
            <label className="block">
              <div className="text-sm text-green-300">Password</div>
              <input type="password" name="password" required className="mt-1 w-full p-2 border border-green-400 rounded bg-black text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </label>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 rounded bg-green-400 text-black font-bold border border-green-400 neon-btn">Register</button>
            </div>
          </form>
        )}

        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-3">
            <label className="block">
              <div className="text-sm text-green-300">Email</div>
              <input type="text" name="email" className="mt-1 w-full p-2 border border-green-400 rounded bg-black text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </label>
            <label className="block">
              <div className="text-sm text-green-300">Password</div>
              <input type="text" name="password" className="mt-1 w-full p-2 border border-green-400 rounded bg-black text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </label>
            <div className="flex items-center justify-between">
              <button type="submit" className="px-4 py-2 rounded bg-green-400 text-black font-bold border border-green-400 neon-btn">Login</button>
              <small className="text-xs text-green-400">Tip: this API is intentionally insecure — use test accounts only</small>
            </div>
          </form>
        )}

        {view === "profile" && (
          <div>
            {user ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-green-300">Name</div>
                  <div className="font-bold text-green-400">{user.name || user.username || user.email}</div>
                </div>
                <div>
                  <div className="text-xs text-green-300">Email</div>
                  <div className="font-bold text-green-400">{user.email}</div>
                </div>
                <pre className="mt-2 p-2 bg-black border border-green-400 rounded text-xs text-green-400 overflow-auto">{JSON.stringify(user, null, 2)}</pre>
                <div className="flex gap-2 mt-3">
                  <button onClick={fetchProfile} className="px-3 py-1 rounded bg-gray-800 text-green-300 border border-green-400 hover:bg-green-700 hover:text-black">Refresh</button>
                  <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white border border-red-400 font-bold">Logout</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-green-400">No profile loaded. Please login.</p>
              </div>
            )}
          </div>
        )}

        {view === "admin" && user && user.role === "admin" && (
          <AdminDashboard />
        )}

        {/* Footer removed as requested */}
        <style>{`
          .neon-glow {
            box-shadow: 0 0 20px #39ff14, 0 0 40px #39ff1444;
          }
          .neon-btn {
            box-shadow: 0 0 8px #39ff14, 0 0 16px #39ff1444;
          }
        `}</style>
      </div>
    </div>
  );
  // --- END RETURN STATEMENT ---
}



