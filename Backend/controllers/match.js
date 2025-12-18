const Match = require('../models/Match');
const Tournoi = require('../models/Tournoi');
const Equipe = require('../models/Equipe');

// Créer un match
exports.createMatch = async (req, res) => {
  try {
    const { date_debut, status, tournoi, participant1, participant2 } = req.body;

    // Validation
    if (!date_debut || !tournoi || !participant1 || !participant2) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier que les participants sont différents
    if (participant1 === participant2) {
      return res.status(400).json({ message: 'Les deux participants doivent être différents' });
    }

    // Vérifier que le tournoi existe
    const tournoiExists = await Tournoi.findById(tournoi);
    if (!tournoiExists) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Vérifier que les équipes existent
    const equipe1Exists = await Equipe.findById(participant1);
    const equipe2Exists = await Equipe.findById(participant2);
    
    if (!equipe1Exists || !equipe2Exists) {
      return res.status(404).json({ message: 'Une ou plusieurs équipes non trouvées' });
    }

    const match = new Match({
      date_debut,
      status,
      tournoi,
      participant1,
      participant2
    });

    await match.save();
    await match.populate(['tournoi', 'participant1', 'participant2']);
    
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du match', error: error.message });
  }
};

// Obtenir tous les matchs
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('tournoi')
      .populate('participant1')
      .populate('participant2')
      .populate('parties');
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des matchs', error: error.message });
  }
};

// Obtenir un match par ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('tournoi')
      .populate('participant1')
      .populate('participant2')
      .populate('parties');
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }
    
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du match', error: error.message });
  }
};

// Obtenir les matchs d'un tournoi
exports.getMatchesByTournoi = async (req, res) => {
  try {
    const matches = await Match.find({ tournoi: req.params.tournoiId })
      .populate('tournoi')
      .populate('participant1')
      .populate('participant2')
      .populate('parties');
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des matchs', error: error.message });
  }
};

// Obtenir les matchs d'une équipe
exports.getMatchesByEquipe = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { participant1: req.params.equipeId },
        { participant2: req.params.equipeId }
      ]
    })
      .populate('tournoi')
      .populate('participant1')
      .populate('participant2')
      .populate('parties');
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des matchs', error: error.message });
  }
};

// Mettre à jour un match
exports.updateMatch = async (req, res) => {
  try {
    const { date_debut, status, participant1, participant2 } = req.body;

    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }

    // Vérifier que les participants sont différents si modifiés
    if (participant1 && participant2 && participant1 === participant2) {
      return res.status(400).json({ message: 'Les deux participants doivent être différents' });
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      { date_debut, status, participant1, participant2 },
      { new: true, runValidators: true }
    )
      .populate('tournoi')
      .populate('participant1')
      .populate('participant2')
      .populate('parties');

    res.status(200).json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du match', error: error.message });
  }
};

// Supprimer un match
exports.deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }

    await Match.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Match supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du match', error: error.message });
  }
};