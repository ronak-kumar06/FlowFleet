const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getDrivers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.post('/register', registerUser);
router.get('/me', protect, getUserProfile);
router.get('/drivers', protect, getDrivers);

module.exports = router;
