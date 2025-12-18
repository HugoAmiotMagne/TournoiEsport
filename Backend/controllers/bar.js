const Bar = require('../models/Bar');
const Salle = require('../models/Salle');
const User = require('../models/User');

// Créer un bar
exports.createBar = async (req, res) => {
  try {
    const { nom, adresse, email, telephone, horaires, description } = req.body || {};

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Le corps de la requête est vide ou mal formé. Veuillez envoyer du JSON avec Content-Type: application/json' });
    }

    // Validation
    if (!nom || !adresse || !email) {
      return res.status(400).json({ message: 'Les champs nom, adresse et email sont requis' });
    }

    // Vérifier si le bar existe déjà avec cet email
    const barExists = await Bar.findOne({ email });
    if (barExists) {
      return res.status(400).json({ message: 'Un bar avec cet email existe déjà' });
    }

    const bar = new Bar({
      nom,
      adresse,
      email,
      telephone,
      horaires,
      description,
      proprietaire: req.user.id
    });

    await bar.save();
    await bar.populate('proprietaire', '-Password');
    
    res.status(201).json(bar);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du bar', error: error.message });
  }
};

// Obtenir tous les bars
exports.getAllBars = async (req, res) => {
  try {
    const bars = await Bar.find()
      .populate('proprietaire', '-Password')
      .populate('salles');
    res.status(200).json(bars);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des bars', error: error.message });
  }
};

// Obtenir un bar par ID
exports.getBarById = async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id)
      .populate('proprietaire', '-Password')
      .populate('salles');
    
    if (!bar) {
      return res.status(404).json({ message: 'Bar non trouvé' });
    }
    
    res.status(200).json(bar);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du bar', error: error.message });
  }
};

// Obtenir un bar avec ses salles (version manuelle sans virtual)
exports.getBarWithSalles = async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id)
      .populate('proprietaire', '-Password');
    
    if (!bar) {
      return res.status(404).json({ message: 'Bar non trouvé' });
    }

    // Récupérer toutes les salles de ce bar
    const salles = await Salle.find({ bar: req.params.id });
    
    res.status(200).json({
      ...bar.toObject(),
      salles
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du bar', error: error.message });
  }
};

// Obtenir les bars de l'utilisateur connecté
exports.getMyBars = async (req, res) => {
  try {
    const bars = await Bar.find({ proprietaire: req.user.id })
      .populate('proprietaire', '-Password')
      .populate('salles');
    res.status(200).json(bars);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos bars', error: error.message });
  }
};

// Mettre à jour un bar
exports.updateBar = async (req, res) => {
  try {
    const { nom, adresse, email, telephone, horaires, description } = req.body || {};

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Le corps de la requête est vide ou mal formé. Veuillez envoyer du JSON avec Content-Type: application/json' });
    }

    const bar = await Bar.findById(req.params.id);
    
    if (!bar) {
      return res.status(404).json({ message: 'Bar non trouvé' });
    }

     // Vérifier que l'utilisateur est le propriétaire
     if (bar.proprietaire.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce bar' });
    }

    const updatedBar = await Bar.findByIdAndUpdate(
      req.params.id,
      { nom, adresse, email, telephone, horaires, description },
      { new: true, runValidators: true }
    )
      .populate('proprietaire', '-Password')
      .populate('salles');

    res.status(200).json(updatedBar);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du bar', error: error.message });
  }
};

// Supprimer un bar
exports.deleteBar = async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);

    if (!bar) {
      return res.status(404).json({ message: 'Bar non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (bar.proprietaire.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce bar' });
    }

    // Supprimer toutes les salles associées
    await Salle.deleteMany({ bar: req.params.id });

    await Bar.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bar et toutes ses salles supprimés avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du bar', error: error.message });
  }
};