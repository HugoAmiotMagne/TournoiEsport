const mongoose = require('mongoose');

const equipeSchema = new mongoose.Schema({
  Name: { type: String, required: true, unique: true },
  date_creation: { type: Date, default: Date.now },
  logo: { type: String }, 
  description: { type: String },
  jeu_principal: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeu' },
  capitaine: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  membres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour les matchs de l'équipe
equipeSchema.virtual('matchs', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'participants'
});

module.exports = mongoose.model('Equipe', equipeSchema);
