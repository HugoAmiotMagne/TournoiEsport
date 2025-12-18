const mongoose = require('mongoose');

const membreTeamSchema = new mongoose.Schema({
  role: { type: String, enum: ['capitaine', 'joueur', 'remplacant', 'coach'], default: 'joueur'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //Many to One
  equipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: true }, //Many to One
  date_adhesion: { type: Date, default: Date.now }, 
  numero_maillot: { type: Number, min: 1, max: 99 },
  statut: { type: String, enum: ['actif', 'inactif', 'suspendu'], default: 'actif' }
}, { timestamps: true });

// Index pour éviter qu'un utilisateur rejoigne plusieurs fois la même équipe
membreTeamSchema.index({ user: 1, equipe: 1 }, { unique: true });

// Validation : le capitaine doit être unique par équipe
membreTeamSchema.pre('save', async function(next) {
  if (this.role === 'capitaine') {
    const existingCapitaine = await mongoose.model('MembreTeam').findOne({
      equipe: this.equipe,
      role: 'capitaine',
      _id: { $ne: this._id }
    });
    
    if (existingCapitaine) {
      next(new Error('Cette équipe a déjà un capitaine'));
    }
  }
  next();
});

module.exports = mongoose.model('MembreTeam', membreTeamSchema);