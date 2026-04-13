const mongoose = require('mongoose');

const empruntSchema = new mongoose.Schema({
    // الربط مع المستخدم (Client)
    idClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // نفس السمية اللي عطينا للموديل فـ userModel.js
        required: true
    },
    // الربط مع الكتاب (Livre)
    idLivre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // تأكد أنها 'Book' حيت هادي هي اللي كاينا فـ bookModel.js
    required: true
},
    dateEmprunt: {
        type: Date,
        default: Date.now
    },
    dateRetourPrevue: {
        type: Date,
        required: true
    },
    dateRetourReelle: {
        type: Date // غاتبقى خاوية حتى يرجع الكتاب
    }
}, { timestamps: true });

module.exports = mongoose.model('Emprunt', empruntSchema);