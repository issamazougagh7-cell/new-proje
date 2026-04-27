const express = require('express');
const router = express.Router();
const Emprunt = require('../models/empruntModel');
const Book = require('../models/bookModel');
const isAuthenticated = require('../middleware/isAuthenticated');

/**
 * @swagger
 * tags:
 * name: Emprunt
 * description: إدارة عمليات تسليف وترجاع الكتب وتتبع المستخدمين
 */

// --- 1. POST: إضافة تسليفة جديدة (US1) ---
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
 * dateRetourPrevue:
 * type: string
 * format: date
 * responses:
 * 201:
 * description: Emprunt créé avec succès
 */
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { idLivre, dateRetourPrevue } = req.body;

        const book = await Book.findById(idLivre);
        if (!book || book.etat === 'emprunté') {
            return res.status(400).json({ message: 'Livre non disponible' });
        }

        const emprunt = await Emprunt.create({
            idClient: req.user.id, 
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

// --- 2. GET: عرض كل التسليفات (للأدمين مثلاً) ---
/**
 * @swagger
 * /api/v1/emprunt:
 * get:
 * summary: Liste de tous les emprunts (Admin)
 * tags: [Emprunt]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Succès
 */
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const emprunts = await Emprunt.find()
            .populate('idLivre', 'titre auteur') 
            .populate('idClient', 'nom prenom email');
        res.status(200).json(emprunts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. GET: عرض تسليفات كليان محدد (Task الجديد) ---
/**
 * @swagger
 * /api/v1/emprunt/client/{idClient}:
 * get:
 * summary: Consulter les emprunts d'un client spécifique
 * tags: [Emprunt]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: idClient
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Historique du client récupéré
 */
router.get('/client/:idClient', isAuthenticated, async (req, res) => {
    try {
        const { idClient } = req.params;
        const emprunts = await Emprunt.find({ idClient })
            .populate('idLivre', 'titre auteur')
            .sort({ createdAt: -1 });

        if (!emprunts.length) return res.status(404).json({ message: "Aucun emprunt trouvé" });
        
        res.status(200).json(emprunts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. PUT: ترجاع كتاب (US2) ---
/**
 * @swagger
 * /api/v1/emprunt/return/{id}:
 * put:
 * summary: Retourner un livre
 * tags: [Emprunt]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Livre retourné
 */
router.put('/return/:id', isAuthenticated, async (req, res) => {
    try {
        const emprunt = await Emprunt.findById(req.params.id);
        if (!emprunt) return res.status(404).json("Emprunt non trouvé");
        if (emprunt.dateRetourReelle) return res.status(400).json("Déjà retourné");

        emprunt.dateRetourReelle = Date.now();
        await emprunt.save();

        await Book.findByIdAndUpdate(emprunt.idLivre, { etat: 'disponible' });

        res.json({ message: "Livre retourné avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
