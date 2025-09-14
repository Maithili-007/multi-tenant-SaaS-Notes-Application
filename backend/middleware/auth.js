const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-production';

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access token required" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.tenant_id !== decoded.tenant_id) return res.status(401).json({ message: "Invalid token" });

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      tenant_id: decoded.tenant_id,
      tenant_slug: decoded.tenant_slug,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
