const express = require('express');
const { login ,inviteUser} = require('../controllers/authController');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/rbac');

router.post('/login', login);
router.post('/invite', authenticateToken, authorize(['Admin']), inviteUser);

module.exports = router;
