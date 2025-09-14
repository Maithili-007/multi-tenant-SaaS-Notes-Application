const ensureTenantIsolation = (req, res, next) => {
  const { tenant_id } = req.user;
  if (!tenant_id)
    return res.status(400).json({ message: "Tenant context required" });
  req.tenantContext = { tenant_id };
  next();
};

module.exports = ensureTenantIsolation;
