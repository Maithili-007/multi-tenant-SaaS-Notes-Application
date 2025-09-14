const express = require('express');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const ensureTenantIsolation = require('../middleware/tenantIsolation');

const router = express.Router();
router.use(authenticateToken);
router.use(ensureTenantIsolation);

router.post('/', authorize(['Admin', 'Member']), createNote);
router.get('/', authorize(['Admin', 'Member']), getNotes);
router.get('/:id', authorize(['Admin', 'Member']), getNote);
router.put('/:id', authorize(['Admin', 'Member']), updateNote);
router.delete('/:id', authorize(['Admin', 'Member']), deleteNote);

module.exports = router;
