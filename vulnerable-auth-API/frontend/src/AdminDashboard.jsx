import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all users (for demo, assumes /api/admin/users returns all users)
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setMessage("");
      try {
        const token = localStorage.getItem("vuln_token");
        const res = await fetch(`${API_BASE}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || data);
        } else {
          setMessage(data.message || JSON.stringify(data));
        }
      } catch (err) {
        setMessage("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Delete user
  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("vuln_token");
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        setMessage("User deleted.");
      } else {
        setMessage(data.message || JSON.stringify(data));
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-dashboard">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-2">Manage users below:</p>
      {message && <div className="mb-2 text-red-600">{message}</div>}
      {loading && <div className="mb-2">Loading…</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t">
              <td className="p-2 text-xs">{user._id}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
