/**
 * @swagger
 * /api/v1/emprunt:
 * post:
 * summary: Ajouter un nouvel emprunt
 * tags: [Emprunt]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * idClient:
 * type: string
 * description: ID unique du client (User)
 * idLivre:
 * type: string
 * description: ID du livre à emprunter
 * dateRetourPrevue:
 * type: string
 * format: date
 * description: La date prévue pour rendre le livre
 * responses:
 * 200:
 * description: Emprunt ajouté avec succès
 * 400:
 * description: Données invalides
 */
router.post('/emprunt', (req, res) => {
  // هنا كيكون الكود ديال logic لي كيخدم بالـ Model لي صاوبتي
/**
 * @swagger
 * /api/v1/emprunt:
 * post:
 * summary: Ajouter un nouvel emprunt
 * tags: [Emprunt]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * idClient:
 * type: string
 * description: ID unique du client (User)
 * idLivre:
 * type: string
 * description: ID du livre à emprunter
 * dateRetourPrevue:
 * type: string
 * format: date
 * description: La date prévue pour rendre le livre
 * responses:
 * 200:
 * description: Emprunt ajouté avec succès
 * 400:
 * description: Données invalides
 */
router.post('/emprunt', (req, res) => {
  // هنا كيكون الكود ديال logic لي كيخدم بالـ Model لي صاوبتي

const express = require('express');
const router = express.Router();
const Emprunt = require('../models/empruntModel');
const Book = require('../models/bookModel');
const isAuthenticated = require('../middleware/isAuthenticated'); // ضروري باش نعرفو شكون اللي سلف

// --- 1. إضافة تسليفة جديدة (US1) ---
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { idLivre, dateRetourPrevue } = req.body;

        // 1. تأكد واش الكتاب موجود ومتاح
        const book = await Book.findById(idLivre);
        if (!book || book.etat === 'emprunté') {
            return res.status(400).json({ message: 'Livre non disponible ou introuvable' });
        }

        // 2. إنشاء التسليفة (كناخدو idClient من الـ Token أوتوماتيكياً)
        const emprunt = await Emprunt.create({
            idClient: req.user.id, // هادي جاية من isAuthenticated
            idLivre,
            dateRetourPrevue
        });

        // 3. تحديث حالة الكتاب
        book.etat = 'emprunté';
        await book.save();

        res.status(201).json({ message: "Emprunt réussi", emprunt });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. ترجاع كتاب (US2) ---
router.put('/return/:id', isAuthenticated, async (req, res) => {
    try {
        const emprunt = await Emprunt.findById(req.params.id);
        if (!emprunt) return res.status(404).json("Emprunt non trouvé");

        // تسجيل تاريخ الترجاع الحقيقي
        emprunt.dateRetourReelle = Date.now();
        await emprunt.save();

        // رجع الكتاب "disponible"
        await Book.findByIdAndUpdate(emprunt.idLivre, { etat: 'disponible' });

        res.json({ message: "Livre retourné avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
    });
