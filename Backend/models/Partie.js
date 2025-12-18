const mongoose = require('mongoose');

const partieSchema = new mongoose.Schema({
  score: { type: String, default: '0-0' },
  map: { type: String, required: true },
  duree: { type: Number, min: 0 }, 
  date_debut: { type: Date, default: Date.now },
  date_fin: { type: Date },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, //Many-to-One
  streams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stream' }] //One-to-Many
}, { timestamps: true });

// Middleware pour ajouter la partie au match lors de la création
partieSchema.post('save', async function() {
  const Match = mongoose.model('Match');
  await Match.findByIdAndUpdate(
    this.match,
    { $addToSet: { parties: this._id } }
  );
});

// Middleware pour retirer la partie du match lors de la suppression
partieSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Match = mongoose.model('Match');
    await Match.findByIdAndUpdate(
      doc.match,
      { $pull: { parties: doc._id } }
    );
  }
});

module.exports = mongoose.model('Partie', partieSchema);