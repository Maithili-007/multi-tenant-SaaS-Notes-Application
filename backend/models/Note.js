const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tenant_id: { type: String, required: true, index: true },//links note to the tenant
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//who actually created that note
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
