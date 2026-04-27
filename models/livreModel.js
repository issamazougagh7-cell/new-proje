const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    auteur: { type: String, required: true },
    isbn: { type: String, unique: true }, // زوين بزاف
    etat: { 
        type: String, 
        enum: ['disponible', 'emprunté'], 
        default: 'disponible' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
