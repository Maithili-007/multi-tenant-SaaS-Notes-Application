const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-production';

const initializeTestData = async () => {
  try {
    const acmeTenant = await Tenant.findOneAndUpdate(
      { slug: 'acme' },
      {
        name: 'Acme Corporation',
        slug: 'acme',
        tenant_id: 'acme_123',
        subscription_plan: 'Free',
        note_limit: 3,
      },
      { upsert: true, new: true }
    );
    const globexTenant = await Tenant.findOneAndUpdate(
      { slug: 'globex' },
      {
        name: 'Globex Corporation',
        slug: 'globex',
        tenant_id: 'globex_456',
        subscription_plan: 'Free',
        note_limit: 3,
      },
      { upsert: true, new: true }
    );

    const users = [
      { email: 'admin@acme.test', password: 'password', role: 'Admin', tenant_id: acmeTenant.tenant_id, tenant_slug: 'acme' },
      { email: 'user@acme.test', password: 'password', role: 'Member', tenant_id: acmeTenant.tenant_id, tenant_slug: 'acme' },
      { email: 'admin@globex.test', password: 'password', role: 'Admin', tenant_id: globexTenant.tenant_id, tenant_slug: 'globex' },
      { email: 'user@globex.test', password: 'password', role: 'Member', tenant_id: globexTenant.tenant_id, tenant_slug: 'globex' },
    ];

    for (const userData of users) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) await User.create(userData);
    }
    console.log('Test tenants/users ensured.');
  } catch (e) {
    console.error('Init test data error:', e);
  }
};

initializeTestData();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const tenant = await Tenant.findOne({ tenant_id: user.tenant_id });
    if (!tenant)
      return res.status(500).json({ message: "Tenant not found" });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
        tenant_slug: user.tenant_slug,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
        tenant_slug: user.tenant_slug,
      },
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

const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { tenant_id, tenant_slug } = req.user;

    if (!email || !role)
      return res.status(400).json({message: "Email and role required"});
    if (!['Admin', 'Member'].includes(role))
      return res.status(400).json({message: "Invalid role"});
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({message: "User already exists"});

    // For demo, always "password" (change in production!)
    const password = "password";
    const newUser = await User.create({
      email,
      password, // Will be hashed
      role,
      tenant_id,
      tenant_slug
    });

    res.status(201).json({
      message: "User invited successfully",
      user: {email: newUser.email, role, tempPassword: password}
    });
  } catch(err) {
    res.status(500).json({message: "Internal server error"});
  }
};


module.exports = { login, inviteUser };
