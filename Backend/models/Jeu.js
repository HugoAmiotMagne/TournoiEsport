const mongoose = require('mongoose');

const jeuSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Mode: { type: String, required: true },
  Map: { type: String, required: true },
  plateforme: { type: String, required: true },
  min_joueur: { type: Number, required: true, min: 1 },
  max_joueur: { type: Number, required: true, min: 1 }
}, { timestamps: true });

// Validation personnalisée
jeuSchema.pre('save', function(next) {
  if (this.min_joueur > this.max_joueur) {
    next(new Error('Le nombre minimum de joueurs ne peut pas être supérieur au maximum'));
  }
  next();
});

// Virtual pour récupérer les tournois de ce jeu
jeuSchema.virtual('tournois', {
  ref: 'Tournoi',
  localField: '_id',
  foreignField: 'jeu'
});

jeuSchema.set('toJSON', { virtuals: true });
jeuSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Jeu', jeuSchema);