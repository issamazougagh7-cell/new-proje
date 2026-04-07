const mongoose = require('mongoose');

const empruntSchema = new mongoose.Schema({
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  idLivre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  dateEmprunt: {
    type: Date,
    default: Date.now
  },
  dateRetour: Date
});

module.exports = mongoose.model('Emprunt', empruntSchema);