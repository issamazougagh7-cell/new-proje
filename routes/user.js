const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const isAuthenticated = require('../middleware/isAuthenticated');

// 1. جلب كاع المستخدمين (فقط للأدمن مثلاً)
// GET /api/users
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // كنرجعو كاع المستخدمين ولكن بلا ما نبينو الـ password ديالهم (لأسباب أمنية)
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. جلب معلومات المستخدم اللي داخل دابا (Profile)
// GET /api/users/profile
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. مسح مستخدم (Delete)
// DELETE /api/users/:id
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
