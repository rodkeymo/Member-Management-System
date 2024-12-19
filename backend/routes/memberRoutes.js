const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { getAllMembers, updateMember, upload, getMemberByUserId, deleteMember, getTotalMemberCount } = require('../controllers/memberController');

const router = express.Router();

// Protect all routes
// router.use(authenticateToken);


router.get('/', getAllMembers);
router.get('/count', getTotalMemberCount);
router.get('/:userId', getMemberByUserId);
router.delete('/:id', deleteMember);
router.put('/:userId', upload, updateMember);

module.exports = router;
