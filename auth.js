const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel"); // الربط مع الموديل ديال المستخدم

// --- 1. REGISTER: تسجيل مستخدم جديد ---
router.post("/register", async (req, res) => {
    try {
        const { email, password, nom, prenom } = req.body;

        // التأكد واش الإيميل ديجا كاين
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "هاد الإيميل مسجل ديجا" });
        }

        // تشفير الكلمة السرية
        const hashedPassword = await bcrypt.hash(password, 10);

        // إنشاء المستخدم فـ MongoDB
        const newUser = await User.create({
            nom,
            prenom,
            email,
            password: hashedPassword
        });

        res.status(201).json({ 
            message: "تم إنشاء الحساب بنجاح", 
            userId: newUser._id 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. LOGIN: تسجيل الدخول ---
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // البحث على المستخدم بالإيميل
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "المستخدم غير موجود" });
        }

        // مقارنة الكلمة السرية المشفرة
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "كلمة السر خاطئة" });
        }

        // إنشاء الـ Token (كنصيفطو الـ ID ديالو وسط الـ Payload)
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.json({ 
            message: "تم تسجيل الدخول !",
            token: token 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
