const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "العنوان ضروري"]
  },
  auteur: {
    type: String,
    required: [true, "المؤلف ضروري"]
  },
  etat: {
    type: String,
    enum: ['disponible', 'emprunté'],
    default: 'disponible'
  }
});

module.exports = mongoose.model('Book', bookSchema);
