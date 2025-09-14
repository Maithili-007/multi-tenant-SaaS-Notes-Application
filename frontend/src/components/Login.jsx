import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const testAccounts = [
  { email: "admin@acme.test", password: "password", label: "Acme Admin", role: "Admin" },
  { email: "user@acme.test", password: "password", label: "Acme Member", role: "Member" },
  { email: "admin@globex.test", password: "password", label: "Globex Admin", role: "Admin" },
  { email: "user@globex.test", password: "password", label: "Globex Member", role: "Member" },
];

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = (acc) =>
    setFormData({ email: acc.email, password: acc.password });

  return (
  <form className="login-form" onSubmit={handleSubmit}>
    <div className="card__header" style={{ textAlign: "center", marginBottom: 20 }}>
      Sign in to access your notes
    </div>
    <div className="form-group">
      <label className="form-label">Email</label>
      <input
        className="form-control"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="you@email.com"
      />
    </div>
    <div className="form-group">
      <label className="form-label">Password</label>
      <input
        className="form-control"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
      />
    </div>
    {error && <div className="error-message">{error}</div>}
    <button className="btn-primary" type="submit" disabled={loading}>
      {loading ? "Signing in..." : "Sign In"}
    </button>
    <div style={{ marginTop: 22 }}>
      <div className="card__header" style={{ fontSize: 16, marginBottom: 8 }}>Test Accounts</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {testAccounts.map(acc => (
          <button
            key={acc.label}
            type="button"
            className="btn-muted"
            onClick={() => handleTestLogin(acc)}
          >
            {acc.label}
          </button>
        ))}
      </div>
    </div>
  </form>
);
}

export default Login;
