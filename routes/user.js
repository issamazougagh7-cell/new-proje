const express = require('express');
const router = express.Router();

const User = require('../models/userModel');

// POST /user
router.post('/user', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;