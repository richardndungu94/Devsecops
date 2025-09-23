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

// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";


export default function App() {
  const [view, setView] = useState("login"); // 'login' | 'register' | 'profile'
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
      const res = await fetch(`${API_BASE}/me`, {
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
      const res = await fetch(`${API_BASE}/register`, {
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
      const res = await fetch(`${API_BASE}/login`, {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Vulnerable Auth UI</h1>
          <p className="text-sm text-gray-500">A simple frontend to test the vulnerable-auth-API</p>
        </header>

        <nav className="flex gap-2 mb-4">
          <button onClick={() => setView("login")} className={`px-3 py-1 rounded ${view === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Login
          </button>
          <button onClick={() => setView("register")} className={`px-3 py-1 rounded ${view === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Register
          </button>
          
          <button onClick={() => fetchProfile()} className={`px-3 py-1 rounded ${view === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
           Me
         </button>
        </nav>

        {message && (
          <div className="mb-4 p-2 rounded bg-red-50 text-red-700 text-sm">{message}</div>
        )}

        {loading && <div className="mb-4 text-sm">Loading…</div>}

        {view === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <label className="block">
              <div className="text-sm text-gray-600">Name</div>
              <input name="name" required className="mt-1 w-full p-2 border rounded" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-600">Email</div>
              <input type="email" name="email" required className="mt-1 w-full p-2 border rounded" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-600">Password</div>
              <input type="password" name="password" required className="mt-1 w-full p-2 border rounded" />
            </label>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Register</button>
            </div>
          </form>
        )}

        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-3">
            <label className="block">
              <div className="text-sm text-gray-600">Email</div>
              <input type="email" name="email" required className="mt-1 w-full p-2 border rounded" />
            </label>
            <label className="block">
              <div className="text-sm text-gray-600">Password</div>
              <input type="password" name="password" required className="mt-1 w-full p-2 border rounded" />
            </label>
            <div className="flex items-center justify-between">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Login</button>
              <small className="text-xs text-gray-500">Tip: this API is intentionally insecure — use test accounts only</small>
            </div>
          </form>
        )}

        {view === "profile" && (
          <div>
            {user ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="font-medium">{user.name || user.username || user.email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>
                <div className="flex gap-2 mt-3">
                  <button onClick={fetchProfile} className="px-3 py-1 rounded bg-gray-200">Refresh</button>
                  <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm">No profile loaded. Please login.</p>
              </div>
            )}
          </div>
        )}

        <footer className="mt-4 text-xs text-gray-400">
          <div>API base: <code className="bg-gray-100 px-1 rounded">{API_BASE}</code></div>
        </footer>
      </div>
    </div>
  );
}
