const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// INSCRIPTION
exports.signUpUser = async (req, res, next) => {
  try {
    // Récupération et validation des champs requis
    const { email, password, nom, prenom, date_de_naissance } = req.body;
    
    // Vérification que tous les champs sont présents
    if (!email || !password || !nom || !prenom || !date_de_naissance) {
      return res.status(400).json({ 
        message: "Tous les champs sont requis",
        champsManquants: {
          email: !email,
          password: !password,
          nom: !nom,
          prenom: !prenom,
          date_de_naissance: !date_de_naissance
        }
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Format d'email invalide" 
      });
    }

    // Validation du mot de passe (minimum 8 caractères)
    if (password.length < 8) {
      return res.status(400).json({ 
        message: "Le mot de passe doit contenir au moins 8 caractères" 
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        message: "Cet email est déjà utilisé" 
      });
    }

    // Validation de la date de naissance
    const dateNaissance = new Date(date_de_naissance);
    if (isNaN(dateNaissance.getTime())) {
      return res.status(400).json({ 
        message: "Format de date de naissance invalide" 
      });
    }

    // Vérifier que l'utilisateur a au moins 13 ans (exemple)
    const age = (new Date() - dateNaissance) / (1000 * 60 * 60 * 24 * 365);
    if (age < 13) {
      return res.status(400).json({ 
        message: "Vous devez avoir au moins 13 ans pour vous inscrire" 
      });
    }

    // Hasher le mot de passe avec un salt de 10 rounds
    const hash = await bcrypt.hash(password, 10);
    
    // Créer le nouvel utilisateur avec TOUTES les informations
    const user = new User({
      email: email.toLowerCase().trim(), // Normaliser l'email
      password: hash,
      nom: nom.trim(),
      prenom: prenom.trim(),
      date_de_naissance: dateNaissance
    });

    // Sauvegarder l'utilisateur dans la base de données
    await user.save();
    
    // Réponse de succès (sans le mot de passe)
    res.status(201).json({ 
      message: "Utilisateur créé avec succès !",
      user: {
        id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        date_de_naissance: user.date_de_naissance,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    // Gestion des erreurs spécifiques de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Erreur de validation",
        erreurs: Object.keys(error.errors).map(key => ({
          champ: key,
          message: error.errors[key].message
        }))
      });
    }
    
    // Erreur de duplication (email déjà existant)
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: "Cet email est déjà utilisé" 
      });
    }

    // Autres erreurs
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: "Erreur lors de la création du compte",
      error: error.message 
    });
  }
};

// LOGIN
exports.loginUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Paire login/mot de passe incorrecte",
        });
      }

      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({
            message: "Paire login/mot de passe incorrecte",
          });
        }

        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET || "RANDOM_TOKEN_SECRET",
          { expiresIn: "24h" }
        );

        res.status(200).json({
          userId: user._id,
          token,
          user: {
            email: user.email,
            nom: user.nom,
            prenom: user.prenom
          }
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// OBTENIR LE PROFIL D'UN UTILISATEUR
exports.getUserProfile = (req, res, next) => {
  User.findById(req.params.id)
    .select('-password')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json(user);
    })
    .catch((error) => res.status(500).json({ error }));
};

// METTRE À JOUR LE PROFIL
exports.updateUserProfile = (req, res, next) => {
  if (req.auth.userId.toString() !== req.params.id) {
    return res.status(403).json({ 
      message: "Action non autorisée : vous ne pouvez modifier/supprimer que votre propre profil" 
    });
  }

  const userUpdates = {};
  if (req.body.nom) userUpdates.nom = req.body.nom.trim();
  if (req.body.prenom) userUpdates.prenom = req.body.prenom.trim();
  if (req.body.date_de_naissance) userUpdates.date_de_naissance = req.body.date_de_naissance;
  if (req.body.email) userUpdates.email = req.body.email.toLowerCase().trim();

  User.findByIdAndUpdate(req.params.id, userUpdates, { new: true })
    .select('-password')
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json({ message: "Profil mis à jour !", user });
    })
    .catch((error) => res.status(400).json({ error }));
};

// SUPPRIMER UN UTILISATEUR
exports.deleteUser = (req, res, next) => {
  if (req.auth.userId.toString() !== req.params.id) {
    return res.status(403).json({ 
      message: "Action non autorisée : vous ne pouvez modifier/supprimer que votre propre profil" 
    });
  }

  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json({ 
        message: "Votre compte a été supprimé avec succès" 
      });
    })
    .catch((error) => res.status(500).json({ error }));
};