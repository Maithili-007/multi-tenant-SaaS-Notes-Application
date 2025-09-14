import React, { useState } from "react";
import { deleteNote } from "../services/api.js";

function formatDate(dt) {
  return new Date(dt).toLocaleString();
}

export default function NotesList({ notes, onEditNote, onDeleteSuccess }) {
  const [deletingId, setDeletingId] = useState(null);
  if (!notes.length)
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No notes yet</h3>
        <p>Create your first note!</p>
      </div>
    );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    setDeletingId(id);
    try {
      await deleteNote(id);
      onDeleteSuccess();
    } catch (e) {
      alert("Failed to delete: " + e.message);
    }
    setDeletingId(null);
  };

  if (!notes.length) return (
  <div className="card empty-state" style={{ padding: "48px", textAlign: "center" }}>
    <div className="card__header" style={{ marginBottom: 8 }}>Create your first note!</div>
    <div style={{ fontSize: 16, color: "#bdbdbf" }}>No notes available yet.</div>
  </div>
);
return (
  <div className="notes-grid">
    {notes.map(note => (
      <div key={note._id} className="note-card">
        <div className="note-header">
          <div className="note-title">{note.title}</div>
          <div className="note-date">{formatDate(note.updatedAt || note.createdAt)}</div>
        </div>
        <div className="note-content">{note.content}</div>
        <div className="note-actions">
          <button
            className="edit-button"
            title="Edit"
            onClick={() => onEditNote(note)}
            disabled={!!deletingId}
          >
            Edit
          </button>
          <button
            className="delete-button"
            title="Delete"
            onClick={async () => {
              setDeletingId(note._id);
              await deleteNote(note._id);
              setDeletingId(null);
              onDeleteSuccess();
            }}
            disabled={!!deletingId}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);
}
