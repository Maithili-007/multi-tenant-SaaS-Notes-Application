import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import NotesList from "./NotesList.jsx";
import NoteForm from "./NoteForm.jsx";
import UpgradePrompt from "./UpgradePrompt.jsx";
import { getNotes } from "../services/api.js";
import InviteUser from "./InviteUser.jsx";

export default function Dashboard() {
  const { user, tenant, logout, updateTenant } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      setNotes(res.notes || []);
    } catch {
      // error silent for demo, add error messages as needed
    }
    setLoading(false);
  };

  const handleCreateNote = () => {
  if (tenant.subscription_plan === "Free" && notes.length >= 3) {
    setShowNoteForm(false); // ensure note form stays closed
    setShowUpgradePrompt(true); // show upgrade/contact dialog
  } else {
    setEditingNote(null);
    setShowNoteForm(true);
  }
};


  return (
  <div className="dashboard">
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div className="card__header">Notes Dashboard</div>
        <div className="header-user">
          <span>{user?.email}</span>
          <span style={{ fontWeight: "500", color: "#bdbdbf", fontSize: 14 }}>
            {tenant.subscription_plan === "Pro" ? "Pro Plan" : "Free Plan"}
          </span>
          <button className="btn-muted" style={{ fontSize: 14 }} onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="dashboard-main">
        <div>
          <button style={{ marginBottom: 16 }} className="create-note-button" onClick={handleCreateNote}>
            + Create Note
          </button>
          {showNoteForm && (
            <NoteForm
              note={editingNote}
              onClose={() => setShowNoteForm(false)}
              onSuccess={() => {
                setShowNoteForm(false);
                loadNotes();
              }}
            />
          )}
          {showUpgradePrompt && (
            <UpgradePrompt
              onClose={() => setShowUpgradePrompt(false)}
              onUpgradeSuccess={updateTenant}
            />
          )}
          {loading ? (
            <div className="card" style={{ textAlign: "center" }}>Loading notes...</div>
          ) : (
            <NotesList
              notes={notes}
              onEditNote={(note) => {
                setEditingNote(note);
                setShowNoteForm(true);
              }}
              onDeleteSuccess={loadNotes}
            />
          )}
        </div>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card__header" style={{ marginBottom: 12 }}>Team & Actions</div>
            <div style={{ marginBottom: 12 }}>
              {tenant.subscription_plan === "Pro" ? "Unlimited notes" : "Up to 3 notes"}
            </div>
            {user.role === "Admin" ? (
  <button
    className="btn-muted"
    style={{ marginBottom: 10 }}
    onClick={() => setShowInvite(true)}
  >
    Invite Team Member
  </button>
) : (
  <div style={{ fontSize: 14, color: "#bdbdbf", marginBottom: 10 }}>
    Only admins can invite new team members
  </div>
)}

            {showInvite && (
              <InviteUser
                onClose={() => setShowInvite(false)}
                onSuccess={loadNotes}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
