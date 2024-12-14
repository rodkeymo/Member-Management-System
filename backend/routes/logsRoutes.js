const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { getAllLogs } = require('../controllers/logController');

const router = express.Router();


// router.use(authenticateToken);

// Route to get all logs
router.get('/',getAllLogs);



module.exports = router;
