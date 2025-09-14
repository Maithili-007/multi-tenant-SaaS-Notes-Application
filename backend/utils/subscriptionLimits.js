const Tenant = require('../models/Tenant');
const Note = require('../models/Note');

const checkNoteLimit = async (tenant_id) => {
  const tenant = await Tenant.findOne({ tenant_id });
  if (!tenant) throw new Error('Tenant not found');
  if (tenant.subscription_plan === 'Pro') return { canCreate: true, remaining: -1 }; // Unlimited

  const noteCount = await Note.countDocuments({ tenant_id });
  const remaining = Math.max(0, tenant.note_limit - noteCount);
  return { canCreate: remaining > 0, remaining, limit: tenant.note_limit, current: noteCount };
};

module.exports = { checkNoteLimit };
