const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { getRoles, createRole, updateRole, deleteRole } = require('../controllers/roleController');

const router = express.Router();

// Protect all routes
router.use(authenticateToken);

router.get('/', getRoles);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
