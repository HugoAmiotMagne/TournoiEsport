const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date_debut: { type: Date, required: true },
  status: { type: String, enum: ['en_attente', 'en_cours', 'termine', 'annule'], default: 'en_attente' },
  tournoi: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournoi', required: true }, //Many-to-One
  participant1: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: true }, //MAny-to-One
  participant2: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: true }, //Many-to-One
  parties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partie' }] //One-to-Many
}, { timestamps: true });

// Validation pour s'assurer que participant1 et participant2 sont différents
matchSchema.pre('save', function(next) {
  if (this.participant1.toString() === this.participant2.toString()) {
    next(new Error('Les deux participants doivent être différents'));
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema);