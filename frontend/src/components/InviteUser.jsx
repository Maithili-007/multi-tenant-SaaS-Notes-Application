import React, { useState } from "react";
import { inviteUser } from "../services/api.js";

export default function InviteUser({ onClose, onSuccess }) {
  const [form, setForm] = useState({ email: "", role: "Member" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(null);
    try {
      const result = await inviteUser(form.email, form.role);
      setSuccess(result.user);
      onSuccess && onSuccess(result.user);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
  <form className="invite-form" onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="form-label">Email</label>
      <input
        className="form-control"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter email..."
        required
      />
    </div>
    <div className="form-group">
      <label className="form-label">Role</label>
      <select
        className="form-control"
        name="role"
        value={form.role}
        onChange={handleChange}
      >
        <option>Member</option>
        <option>Admin</option>
      </select>
    </div>
    {error && <div className="error-message">{error}</div>}
    {success && <div className="success-message">User invited!</div>}
    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Inviting..." : "Invite"}
      </button>
      <button className="btn-muted" type="button" onClick={onClose}>Cancel</button>
    </div>
  </form>
);
}
