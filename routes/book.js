const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');
const isAuthenticated = require('../middleware/isAuthenticated'); // حماية المسار

// 1. إضافة كتاب جديد (خاص بالأدمين مثلاً)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book); // 201 كتعني Created
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. جلب كاع الكتب (باقي غاتحتاجوها فـ الـ Frontend)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
