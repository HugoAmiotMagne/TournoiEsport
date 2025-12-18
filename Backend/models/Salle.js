const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  capacite_spectateur: { type: Number, required: true, min: 0 },
  equipement: { type: String, required: true },
  disponible: { type: Boolean, default: true },
  nombre_joueur: { type: Number, required: true, min: 0 },
  bar: { type: mongoose.Schema.Types.ObjectId, ref: 'Bar', required: true }, // Many to One
  description: { type: String }
}, { timestamps: true });

// Middleware pour mettre à jour la liste des salles du bar
salleSchema.post('save', async function() {
  const Bar = mongoose.model('Bar');
  await Bar.findByIdAndUpdate(
    this.bar,
    { $addToSet: { salles: this._id } }
  );
});

// Middleware pour retirer la salle de la liste du bar lors de la suppression
salleSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Bar = mongoose.model('Bar');
    await Bar.findByIdAndUpdate(
      doc.bar,
      { $pull: { salles: doc._id } }
    );
  }
});

module.exports = mongoose.model('Salle', salleSchema);