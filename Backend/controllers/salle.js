const Salle = require('../models/Salle');
const Bar = require('../models/Bar');

// Créer une salle
exports.createSalle = async (req, res) => {
  try {
    const { Name, capacite_spectateur, equipement, nombre_joueur, bar, prix_location, description, disponible } = req.body;

    // Validation
    if (!Name || !capacite_spectateur || !equipement || !nombre_joueur || !bar) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier que le bar existe
    const barExists = await Bar.findById(bar);
    if (!barExists) {
      return res.status(404).json({ message: 'Bar non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire du bar
    if (barExists.proprietaire.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à ajouter une salle à ce bar' });
    }

    const salle = new Salle({
      Name,
      capacite_spectateur,
      equipement,
      nombre_joueur,
      bar,
      prix_location,
      description,
      disponible
    });

    await salle.save();
    await salle.populate('bar');
    
    res.status(201).json(salle);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la salle', error: error.message });
  }
};

// Obtenir toutes les salles
exports.getAllSalles = async (req, res) => {
  try {
    const salles = await Salle.find().populate('bar');
    res.status(200).json(salles);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des salles', error: error.message });
  }
};

// Obtenir une salle par ID
exports.getSalleById = async (req, res) => {
  try {
    const salle = await Salle.findById(req.params.id).populate('bar');
    
    if (!salle) {
      return res.status(404).json({ message: 'Salle non trouvée' });
    }
    
    res.status(200).json(salle);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la salle', error: error.message });
  }
};

// Obtenir les salles d'un bar spécifique
exports.getSallesByBar = async (req, res) => {
  try {
    const salles = await Salle.find({ bar: req.params.barId }).populate('bar');
    res.status(200).json(salles);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des salles', error: error.message });
  }
};

// Obtenir les salles de mes bars (utilisateur connecté)
exports.getMySalles = async (req, res) => {
  try {
    // Trouver tous les bars de l'utilisateur
    const myBars = await Bar.find({ proprietaire: req.user.id });
    const barIds = myBars.map(bar => bar._id);
    
    // Trouver toutes les salles de ces bars
    const salles = await Salle.find({ bar: { $in: barIds } }).populate('bar');
    res.status(200).json(salles);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos salles', error: error.message });
  }
};

// Mettre à jour une salle
exports.updateSalle = async (req, res) => {
  try {
    const { Name, capacite_spectateur, equipement, nombre_joueur, prix_location, description, disponible } = req.body;

    const salle = await Salle.findById(req.params.id).populate('bar');
    
    if (!salle) {
      return res.status(404).json({ message: 'Salle non trouvée' });
    }

    // Vérifier que l'utilisateur est le propriétaire du bar
    if (salle.bar.proprietaire.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette salle' });
    }

    const updatedSalle = await Salle.findByIdAndUpdate(
      req.params.id,
      { Name, capacite_spectateur, equipement, nombre_joueur, prix_location, description, disponible },
      { new: true, runValidators: true }
    ).populate('bar');

    res.status(200).json(updatedSalle);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la salle', error: error.message });
  }
};

// Supprimer une salle
exports.deleteSalle = async (req, res) => {
  try {
    const salle = await Salle.findById(req.params.id).populate('bar');

    if (!salle) {
      return res.status(404).json({ message: 'Salle non trouvée' });
    }

    // Vérifier que l'utilisateur est le propriétaire du bar
    if (salle.bar.proprietaire.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette salle' });
    }

    await Salle.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Salle supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la salle', error: error.message });
  }
};