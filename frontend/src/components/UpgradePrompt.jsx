import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { upgradeTenant } from "../services/api.js";

export default function UpgradePrompt({ onClose, onUpgradeSuccess }) {
  const { user, tenant } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleUpgrade = async () => {
    if (user.role !== "Admin") {
      setError("Only admins can upgrade subscriptions");
      return;
    }
    setLoading(true);
    setError(""); 
    try {
      const response = await upgradeTenant(user.tenant_slug);
      onUpgradeSuccess(response.tenant);

      if (response.tenant.subscription_plan === "Pro") {
        setError(""); // clear error if upgraded successfully
        setSuccess("🎉 Upgraded to Pro successfully!");
      }
    } catch (err) {
      setError(err.message);
      setSuccess(""); // clear success if failed
    }
    setLoading(false);
  };


  return (
  <div className="upgrade-prompt">
    <div className="prompt-warning"> You've reached your limit of 3 notes</div>
    {user.role === "Admin" ? (
        <>
          <div className="card__body" style={{ marginBottom: 10 }}>
            You can upgrade the workspace to unlock unlimited notes.
          </div>
          <button
            className="btn-primary"
            disabled={loading}
            onClick={handleUpgrade}
            style={{ marginBottom: 14 }}
          >
            {loading ? "Upgrading..." : "Upgrade to Pro"}
          </button>
        </>
      ) : (
        <div style={{ fontSize: 14, color: "#bdbdbf", marginBottom: 14 }}>
          Please contact your admin to upgrade to Pro plan
        </div>
      )}
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <button className="btn-muted" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
