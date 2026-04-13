const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    auteur: { type: String, required: true },
    isbn: { type: String, unique: true },
    disponible: { type: Boolean, default: true } // هادي مهمة باش نعرفو واش الكتاب كاين ولا مسلف
}, { timestamps: true });

module.exports = mongoose.model('Livre', livreSchema);