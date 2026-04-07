const express = require('express');
const router = express.Router();

const Emprunt = require('../models/empruntModel');
const Book = require('../models/bookModel');

// POST /emprunt
router.post('/emprunt', async (req, res) => {
  try {
    const { idClient, idLivre } = req.body;

    // check book
    const book = await Book.findById(idLivre);
    if (!book || book.etat === 'emprunté') {
      return res.status(400).json({ message: 'Livre non disponible' });
    }

    // create emprunt
    const emprunt = await Emprunt.create({
      idClient,
      idLivre
    });

    // update book
    book.etat = 'emprunté';
    await book.save();

    res.status(200).json(emprunt);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;