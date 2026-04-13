// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     nom: { type: String, required: true },
//     prenom: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);



// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // زيد هاد السطر

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // تسجيل فـ MongoDB
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Email already exists or server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }); // بحث فـ الداتابيز
  
  if (!user) return res.status(400).json("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json("Wrong password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

module.exports = router;