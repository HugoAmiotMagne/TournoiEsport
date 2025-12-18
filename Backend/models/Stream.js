const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  nom: { type: String, required: true }, 
  plateforme: { type: String, enum: ['Twitch', 'YouTube', 'Facebook Gaming', 'Kick', 'Autre'], required: true },
  url: { type: String, required: true},
  partie: { type: mongoose.Schema.Types.ObjectId, ref: 'Partie', required: true },//Many-to-One
  statut: { type: String, enum: ['en_attente', 'en_direct', 'termine', 'annule'], default: 'en_attente' }
}, { timestamps: true });

// Middleware pour ajouter le stream à la partie
streamSchema.post('save', async function() {
  const Partie = mongoose.model('Partie');
  await Partie.findByIdAndUpdate(
    this.partie,
    { $addToSet: { streams: this._id } }
  );
});

// Middleware pour retirer le stream de la partie lors de la suppression
streamSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Partie = mongoose.model('Partie');
    await Partie.findByIdAndUpdate(
      doc.partie,
      { $pull: { streams: doc._id } }
    );
  }
});

module.exports = mongoose.model('Stream', streamSchema);