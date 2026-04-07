const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titre: String,
  auteur: String,
  etat: {
    type: String,
    enum: ['disponible', 'emprunté'],
    default: 'disponible'
  }
});

module.exports = mongoose.model('Book', bookSchema);