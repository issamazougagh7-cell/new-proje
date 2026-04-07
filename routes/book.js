const express = require('express');
const router = express.Router();

const Book = require('../models/bookModel');

// POST /book
router.post('/book', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;