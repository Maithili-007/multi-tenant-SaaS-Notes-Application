const Tenant = require('../models/Tenant');

const upgradeTenant = async (req, res) => {
  try {
    const { slug } = req.params;
    const { tenant_slug, role } = req.user;
    if (role !== "Admin")
      return res.status(403).json({ message: "Only admins can upgrade subscriptions" });
    if (slug !== tenant_slug)
      return res.status(403).json({ message: "Cannot upgrade other tenants" });

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    if (tenant.subscription_plan === "Pro")
      return res.status(400).json({ message: "Already on Pro plan" });

    tenant.subscription_plan = "Pro";
    tenant.note_limit = -1; // Unlimited notes
    await tenant.save();

    res.json({
      success: true,
      message: "Successfully upgraded to Pro plan",
      tenant: {
        name: tenant.name,
        subscription_plan: tenant.subscription_plan,
        note_limit: tenant.note_limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { upgradeTenant };
