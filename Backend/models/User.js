const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  date_de_naissance: { type: Date, required: true },
  
}, {
  timestamps: true
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);