const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema({
  date_limite: { type: Date, required: true },
  statut: { type: String, enum: ['en_attente', 'acceptee', 'refusee', 'annulee'], default: 'en_attente' },
  classement: { type: Number, min: 0 },
  tournoi: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournoi', required: true }, //Many-to-One
  equipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: true },//Many-to-One
  prix_paye: { type: Number, default: 0, min: 0 },
  date_inscription: { type: Date, default: Date.now },
  commentaire: { type: String }
}, { timestamps: true });

// Index pour éviter les inscriptions en double
inscriptionSchema.index({ tournoi: 1, equipe: 1 }, { unique: true });

// Validation : vérifier que la date limite n'est pas dépassée
inscriptionSchema.pre('save', function(next) {
  if (this.date_limite && new Date() > this.date_limite) {
    next(new Error('La date limite d\'inscription est dépassée'));
  }
  next();
});

module.exports = mongoose.model('Inscription', inscriptionSchema);