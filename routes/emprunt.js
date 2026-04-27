const express = require('express');
const router = express.Router();
const Emprunt = require('../models/empruntModel');
const Book = require('../models/bookModel');
const isAuthenticated = require('../middleware/isAuthenticated');

/**
 * @swagger
 * /api/v1/emprunt:
 * post:
 * summary: Ajouter un nouvel emprunt
 * tags: [Emprunt]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - idLivre
 * - dateRetourPrevue
 * properties:
 * idLivre:
 * type: string
 * description: ID du livre à emprunter
 * dateRetourPrevue:
 * type: string
 * format: date
 * description: La date prévue pour rendre le livre
 * responses:
 * 201:
 * description: Emprunt ajouté avec succès
 * 400:
 * description: Livre non disponible ou données invalides
 * 401:
 * description: Non autorisé (Token manquant)
 */
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { idLivre, dateRetourPrevue } = req.body;

        const book = await Book.findById(idLivre);
        if (!book || book.etat === 'emprunté') {
            return res.status(400).json({ message: 'Livre non disponible ou introuvable' });
        }

        const emprunt = await Emprunt.create({
            idClient: req.user.id, // كايجي من الـ Token
            idLivre,
            dateRetourPrevue
        });

        book.etat = 'emprunté';
        await book.save();

        res.status(201).json({ message: "Emprunt réussi", emprunt });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/v1/emprunt/return/{id}:
 * put:
 * summary: Retourner un livre emprunté
 * tags: [Emprunt]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID de l'emprunt
 * responses:
 * 200:
 * description: Livre retourné avec succès
 * 404:
 * description: Emprunt non trouvé
 */
router.put('/return/:id', isAuthenticated, async (req, res) => {
    try {
        const emprunt = await Emprunt.findById(req.params.id);
        if (!emprunt) return res.status(404).json("Emprunt non trouvé");

        emprunt.dateRetourReelle = Date.now();
        await emprunt.save();

        await Book.findByIdAndUpdate(emprunt.idLivre, { etat: 'disponible' });

        res.json({ message: "Livre retourné avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
