const mongoose = require('mongoose');

const tournoiSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  description: { type: String, required: true },
  date_debut: { type: Date, required: true },
  date_fin: { type: Date, required: true },
  jeu: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeu', required: true },
  salle: { type: mongoose.Schema.Types.ObjectId, ref: 'Salle' },
  statut: { type: String, enum: ['à venir', 'en cours', 'terminé', 'annulé'], default: 'à venir' },
  prix_inscription: { type: Number, default: 0 },
  nombre_equipes_max: { type: Number, default: 16 },
  createur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
}, { timestamps: true });

// Validation des dates
tournoiSchema.pre('save', function(next) {
  if (this.date_fin <= this.date_debut) {
    next(new Error('La date de fin doit être après la date de début'));
  }
  next();
});

// Virtual pour récupérer les inscriptions
tournoiSchema.virtual('inscriptions', {
  ref: 'Inscription',
  localField: '_id',
  foreignField: 'tournoi'
});

// Virtual pour récupérer les matchs
tournoiSchema.virtual('matchs', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'tournoi'
});

tournoiSchema.set('toJSON', { virtuals: true });
tournoiSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tournoi', tournoiSchema);
