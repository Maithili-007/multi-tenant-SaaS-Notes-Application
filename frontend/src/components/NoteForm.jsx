import React, { useEffect, useState } from "react";
import { createNote, updateNote } from "../services/api.js";

export default function NoteForm({ note, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (note) setFormData({ title: note.title, content: note.content });
  }, [note]);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (note) {
        await updateNote(note._id, formData);
      } else {
        const res = await createNote(formData);
        if (res.limit_reached) {
          setError("Note limit reached. Upgrade to Pro for unlimited notes.");
          return;
        }
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
  <form className="note-form" onSubmit={handleSubmit}>
    <div className="card__header" style={{ marginBottom: 16 }}>
      {note ? "Edit Note" : "Create Note"}
    </div>
    <div className="form-group">
      <label className="form-label">Title</label>
      <input
        className="form-control"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Note title"
        maxLength={64}
        required
      />
    </div>
    <div className="form-group">
      <label className="form-label">Content</label>
      <textarea
        className="form-control"
        name="content"
        value={formData.content}
        onChange={handleInputChange}
        rows={4}
        placeholder="Start writing your note..."
        required
      />
    </div>
    {error && <div className="error-message">{error}</div>}
    <div style={{ display: "flex", gap: 12 }}>
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Saving..." : note ? "Update" : "Create"}
      </button>
      <button className="btn-muted" type="button" onClick={onClose}>Cancel</button>
    </div>
  </form>
);
}
