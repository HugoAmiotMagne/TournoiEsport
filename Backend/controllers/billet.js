const Billet = require('../models/Billet');
const Salle = require('../models/Salle');
const Tournoi = require('../models/Tournoi');
const User = require('../models/User');

// Créer un billet (pour un admin ou propriétaire de bar)
exports.createBillet = async (req, res) => {
  try {
    const { type, prix, quantite, salle, tournoi, date_evenement } = req.body;

    // Validation
    if (!type || !prix || !salle) {
      return res.status(400).json({ message: 'Les champs type, prix et salle sont requis' });
    }

    // Vérifier que la salle existe
    const salleExists = await Salle.findById(salle);
    if (!salleExists) {
      return res.status(404).json({ message: 'Salle non trouvée' });
    }

    // Vérifier le tournoi si fourni
    if (tournoi) {
      const tournoiExists = await Tournoi.findById(tournoi);
      if (!tournoiExists) {
        return res.status(404).json({ message: 'Tournoi non trouvé' });
      }
    }

    const billet = new Billet({
      type,
      prix,
      quantite: quantite || 1,
      user: req.user.id,
      salle,
      tournoi,
      date_evenement,
      statut: 'disponible'
    });

    await billet.save();
    await billet.populate('user', '-Password');
    await billet.populate('salle');
    await billet.populate('tournoi');
    
    res.status(201).json(billet);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du billet', error: error.message });
  }
};

// Obtenir tous les billets
exports.getAllBillets = async (req, res) => {
  try {
    const billets = await Billet.find()
      .populate('user', '-Password')
      .populate('salle')
      .populate('tournoi')
      .sort({ date_achat: -1 });
    res.status(200).json(billets);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des billets', error: error.message });
  }
};

// Obtenir un billet par ID
exports.getBilletById = async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id)
      .populate('user', '-Password')
      .populate('salle')
      .populate('tournoi');
    
    if (!billet) {
      return res.status(404).json({ message: 'Billet non trouvé' });
    }
    
    res.status(200).json(billet);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du billet', error: error.message });
  }
};

// Obtenir mes billets (utilisateur connecté)
exports.getMesBillets = async (req, res) => {
  try {
    const billets = await Billet.find({ user: req.user.id })
      .populate('user', '-Password')
      .populate('salle')
      .populate('tournoi')
      .sort({ date_achat: -1 });
    res.status(200).json(billets);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos billets', error: error.message });
  }
};

// Annuler un billet
exports.annulerBillet = async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id)
      .populate('user', '-Password')
      .populate('salle')
      .populate('tournoi');
    
    if (!billet) {
      return res.status(404).json({ message: 'Billet non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire du billet
    if (billet.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à annuler ce billet' });
    }

    if (billet.statut === 'utilisé') {
      return res.status(400).json({ message: 'Impossible d\'annuler un billet déjà utilisé' });
    }

    if (billet.statut === 'annulé') {
      return res.status(400).json({ message: 'Ce billet est déjà annulé' });
    }

    billet.statut = 'annulé';
    await billet.save();

    res.status(200).json({
      message: 'Billet annulé avec succès',
      billet
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation du billet', error: error.message });
  }
};

// Mettre à jour un billet
exports.updateBillet = async (req, res) => {
  try {
    const { type, prix, quantite, date_evenement } = req.body;

    const billet = await Billet.findById(req.params.id);
    
    if (!billet) {
      return res.status(404).json({ message: 'Billet non trouvé' });
    }

    // Seul le propriétaire peut modifier
    if (billet.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce billet' });
    }

    // Ne pas permettre la modification si déjà utilisé
    if (billet.statut === 'utilisé') {
      return res.status(400).json({ message: 'Impossible de modifier un billet déjà utilisé' });
    }

    const updatedBillet = await Billet.findByIdAndUpdate(
      req.params.id,
      { type, prix, quantite, date_evenement },
      { new: true, runValidators: true }
    )
      .populate('user', '-Password')
      .populate('salle')
      .populate('tournoi');

    res.status(200).json(updatedBillet);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du billet', error: error.message });
  }
};

// Supprimer un billet
exports.deleteBillet = async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);

    if (!billet) {
      return res.status(404).json({ message: 'Billet non trouvé' });
    }

    // Seul le propriétaire peut supprimer
    if (billet.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce billet' });
    }

    // Ne pas permettre la suppression si déjà utilisé
    if (billet.statut === 'utilisé') {
      return res.status(400).json({ message: 'Impossible de supprimer un billet déjà utilisé' });
    }

    await Billet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Billet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du billet', error: error.message });
  }
};

