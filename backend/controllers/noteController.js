const Note = require('../models/Note');
const Tenant = require('../models/Tenant');

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { tenant_id, userId } = req.user;
    const tenant = await Tenant.findOne({ tenant_id });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    if (tenant.subscription_plan === 'Free') {
      const noteCount = await Note.countDocuments({ tenant_id });
      if (noteCount >= tenant.note_limit)
        return res.status(403).json({ message: "Note limit reached. Upgrade to Pro!", limit_reached: true });
    }
    const note = await Note.create({ title, content, tenant_id, created_by: userId });
    await note.populate('created_by', 'email');
    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNotes = async (req, res) => {
  try {
    const { tenant_id } = req.user;
    const notes = await Note.find({ tenant_id }).populate('created_by', 'email').sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenant_id } = req.user;
    const note = await Note.findOne({ _id: id, tenant_id }).populate('created_by', 'email');
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const { tenant_id } = req.user;
    const note = await Note.findOneAndUpdate(
      { _id: id, tenant_id },
      { title, content },
      { new: true }
    ).populate('created_by', 'email');
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenant_id } = req.user;
    const note = await Note.findOneAndDelete({ _id: id, tenant_id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };
