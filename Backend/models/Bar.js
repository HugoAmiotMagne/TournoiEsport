const mongoose = require('mongoose');

const barSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  telephone: { type: String },
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Many to One
  horaires: { type: String },
  description: { type: String } 
}, { timestamps: true });

// Méthode virtuelle pour récupérer les salles (optionnel)
barSchema.virtual('salles', {
  ref: 'Salle',
  localField: '_id',
  foreignField: 'bar'
});

// Pour que populate fonctionne avec les virtuels
barSchema.set('toJSON', { virtuals: true });
barSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Bar', barSchema);