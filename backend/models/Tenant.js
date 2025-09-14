const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },// acme/globex
  slug: { type: String, required: true, unique: true },//reference in routes or links
  tenant_id: { type: String, required: true, unique: true },
  subscription_plan: { type: String, enum: ['Free', 'Pro'], default: 'Free' },
  note_limit: { type: Number, default: 3 },
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
