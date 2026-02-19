const mongoose = require('mongoose');

const jeuSchema = new mongoose.Schema({
  Name:        { type: String, required: true },
  Mode:        { type: String, required: true },
  Map:         { type: String, required: true },
  plateforme:  { type: String, required: true },
  min_joueur:  { type: Number, required: true, min: 1 },
  max_joueur:  { type: Number, required: true, min: 1 },
  image: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true;
        // Accept data URI base64 image OR http(s) URL to an image file
        const isDataUri = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(v);
        // Accept any http(s) URL as image (CDN URLs may not include a file extension)
        const isUrl = /^https?:\/\/.+/i.test(v);
        return isDataUri || isUrl;
      },
      message: "L'image doit être une image Base64 (jpeg, png, gif, webp) ou une URL d'image (http(s)://...)"
    }
  },
}, { timestamps: true });

jeuSchema.pre('save', function (next) {
  if (this.min_joueur > this.max_joueur) {
    next(new Error('Le nombre minimum de joueurs ne peut pas être supérieur au maximum'));
  }
  next();
});

jeuSchema.virtual('tournois', {
  ref: 'Tournoi',
  localField: '_id',
  foreignField: 'jeu'
});

jeuSchema.set('toJSON',   { virtuals: true });
jeuSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Jeu', jeuSchema);