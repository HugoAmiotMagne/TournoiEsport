const mongoose = require('mongoose');

const billetSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['Standard', 'VIP', 'PRESSE'] },
  prix: { type: Number, required: true, min: 0 },
  quantite: { type: Number, required: true, default:1, min: 1 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Many to One
  salle: { type: mongoose.Schema.Types.ObjectId, ref: 'Salle', required: true }, // Many to One
  tournoi: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournoi' }, // Many to One
  statut: { type: String, enum: ['disponible', 'vendu', 'utilisé', 'annulé'], default: 'disponible' },
  date_achat: { type: Date, default: Date.now },
  date_evenement: { type: Date }
}, {
  timestamps: true
});

// Générer un code QR unique avant sauvegarde
billetSchema.pre('save', function(next) {
  if (!this.code_qr) {
    this.code_qr = `BIL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

billetSchema.set('toJSON', { virtuals: true });
billetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Billet', billetSchema);