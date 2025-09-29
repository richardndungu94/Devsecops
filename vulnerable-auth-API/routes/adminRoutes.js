
const express = require('express');
const router = express.Router();
const { adminController } = require('../controllers/authcontroller');
const auth = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin dashboard
router.get('/', auth, isAdmin, adminController);

// Delete user by ID (admin only)
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted', user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
