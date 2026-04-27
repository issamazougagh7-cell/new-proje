const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // ضروري نعيطو للموديل

// --- REGISTER (تسجيل مستخدم جديد) ---
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. واش المستخدم كاين ديجا؟
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json("Email déjà utilisé");

    // 2. تشفير الكلمة السرية
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. التسجيل فـ MongoDB
    const newUser = await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN (تسجيل الدخول) ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. قلب على المستخدم فـ الداتابيز
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Utilisateur non trouvé");

    // 2. تأكد من الكلمة السرية
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Mot de passe incorrect");

    // 3. صايب الـ Token (كنديرو فيه id ديال MongoDB)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "Connecté !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
