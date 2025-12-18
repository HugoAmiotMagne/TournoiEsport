const Tournoi = require('../models/Tournoi');
const Jeu = require('../models/Jeu');
const Salle = require('../models/Salle');
const Inscription = require('../models/Inscription');

// Créer un tournoi
exports.createTournoi = async (req, res) => {
  try {
    const { Name, description, date_debut, date_fin, jeu, salle, prix_inscription, nombre_equipes_max } = req.body;

    // Validation
    if (!Name || !description || !date_debut || !date_fin || !jeu) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier que la date de fin est après la date de début
    if (new Date(date_fin) <= new Date(date_debut)) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
    }

    // Vérifier que le jeu existe
    const jeuExists = await Jeu.findById(jeu);
    if (!jeuExists) {
      return res.status(404).json({ message: 'Jeu non trouvé' });
    }

    // Vérifier que la salle existe si fournie
    if (salle) {
      const salleExists = await Salle.findById(salle);
      if (!salleExists) {
        return res.status(404).json({ message: 'Salle non trouvée' });
      }
    }

    const tournoi = new Tournoi({
      Name,
      description,
      date_debut,
      date_fin,
      jeu,
      salle,
      prix_inscription,
      nombre_equipes_max,
      createur: req.user.id
    });

    await tournoi.save();
    await tournoi.populate('jeu');
    await tournoi.populate('salle');
    await tournoi.populate('createur', '-Password');
    
    res.status(201).json(tournoi);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du tournoi', error: error.message });
  }
};

// Obtenir tous les tournois
exports.getAllTournois = async (req, res) => {
  try {
    const tournois = await Tournoi.find()
      .populate('jeu')
      .populate('salle')
      .populate('createur', '-Password')
      .sort({ date_debut: -1 });
    res.status(200).json(tournois);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tournois', error: error.message });
  }
};

// Obtenir un tournoi par ID
exports.getTournoiById = async (req, res) => {
  try {
    const tournoi = await Tournoi.findById(req.params.id)
      .populate('jeu')
      .populate('salle')
      .populate('createur', '-Password');
    
    if (!tournoi) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }
    
    res.status(200).json(tournoi);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du tournoi', error: error.message });
  }
};

// Obtenir un tournoi avec ses inscriptions
exports.getTournoiWithInscriptions = async (req, res) => {
  try {
    const tournoi = await Tournoi.findById(req.params.id)
      .populate('jeu')
      .populate('salle')
      .populate('createur', '-Password');
    
    if (!tournoi) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Récupérer les inscriptions (si le model existe)
    let inscriptions = [];
    try {
      inscriptions = await Inscription.find({ tournoi: req.params.id })
        .populate('user', '-Password')
        .populate('equipe');
    } catch (err) {
      // Si le model Inscription n'existe pas encore
      inscriptions = [];
    }
    
    res.status(200).json({
      ...tournoi.toObject(),
      inscriptions,
      nombreInscrits: inscriptions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du tournoi', error: error.message });
  }
};

// Obtenir mes tournois (créés par l'utilisateur connecté)
exports.getMyTournois = async (req, res) => {
  try {
    const tournois = await Tournoi.find({ createur: req.user.id })
      .populate('jeu')
      .populate('salle')
      .populate('createur', '-Password')
      .sort({ date_debut: -1 });
    res.status(200).json(tournois);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos tournois', error: error.message });
  }
};

// Mettre à jour un tournoi
exports.updateTournoi = async (req, res) => {
  try {
    const { Name, description, date_debut, date_fin, jeu, salle, statut, prix_inscription, nombre_equipes_max } = req.body;

    const tournoi = await Tournoi.findById(req.params.id);
    
    if (!tournoi) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Vérifier que l'utilisateur est le créateur
    if (tournoi.createur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce tournoi' });
    }

    if (date_debut && date_fin && new Date(date_fin) <= new Date(date_debut)) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
    }

    const updatedTournoi = await Tournoi.findByIdAndUpdate(
      req.params.id,
      { Name, description, date_debut, date_fin, jeu, salle, statut, prix_inscription, nombre_equipes_max },
      { new: true, runValidators: true }
    )
      .populate('jeu')
      .populate('salle')
      .populate('createur', '-Password');

    res.status(200).json(updatedTournoi);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du tournoi', error: error.message });
  }
};

// Changer le statut d'un tournoi
exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const validStatuts = ['à venir', 'en cours', 'terminé', 'annulé'];
    
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ 
        message: 'Statut invalide. Valeurs possibles: à venir, en cours, terminé, annulé' 
      });
    }

    const tournoi = await Tournoi.findById(req.params.id);
    
    if (!tournoi) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Vérifier que l'utilisateur est le créateur
    if (tournoi.createur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce tournoi' });
    }

    tournoi.statut = statut;
    await tournoi.save();
    await tournoi.populate('jeu');
    await tournoi.populate('salle');
    await tournoi.populate('createur', '-Password');

    res.status(200).json(tournoi);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};

// Supprimer un tournoi
exports.deleteTournoi = async (req, res) => {
  try {
    const tournoi = await Tournoi.findById(req.params.id);

    if (!tournoi) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Vérifier que l'utilisateur est le créateur
    if (tournoi.createur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce tournoi' });
    }

    await Tournoi.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tournoi supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du tournoi', error: error.message });
  }
};