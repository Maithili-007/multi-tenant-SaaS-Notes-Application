const express = require('express');
const { upgradeTenant } = require('../controllers/tenantController');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/rbac');

const router = express.Router();
router.use(authenticateToken);

router.post('/:slug/upgrade', authorize(['Admin']), upgradeTenant);

module.exports = router;
