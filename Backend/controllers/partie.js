const Partie = require('../models/Partie');
const Match = require('../models/Match');

// Créer une partie
exports.createPartie = async (req, res) => {
  try {
    const { score, map, duree, date_debut, date_fin, match } = req.body;

    // Validation
    if (!map || !match) {
      return res.status(400).json({ message: 'La map et le match sont obligatoires' });
    }

    // Vérifier que le match existe
    const matchExists = await Match.findById(match);
    if (!matchExists) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }

    const partie = new Partie({
      score,
      map,
      duree,
      date_debut,
      date_fin,
      match
    });

    await partie.save();
    await partie.populate('match');
    
    res.status(201).json(partie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la partie', error: error.message });
  }
};

// Obtenir toutes les parties
exports.getAllParties = async (req, res) => {
  try {
    const parties = await Partie.find()
      .populate({
        path: 'match',
        populate: [
          { path: 'tournoi' },
          { path: 'participant1' },
          { path: 'participant2' }
        ]
      })
      .populate('streams');
    res.status(200).json(parties);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des parties', error: error.message });
  }
};

// Obtenir une partie par ID
exports.getPartieById = async (req, res) => {
  try {
    const partie = await Partie.findById(req.params.id)
      .populate({
        path: 'match',
        populate: [
          { path: 'tournoi' },
          { path: 'participant1' },
          { path: 'participant2' }
        ]
      })
      .populate('streams');
    
    if (!partie) {
      return res.status(404).json({ message: 'Partie non trouvée' });
    }
    
    res.status(200).json(partie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la partie', error: error.message });
  }
};

// Obtenir les parties d'un match
exports.getPartiesByMatch = async (req, res) => {
  try {
    const parties = await Partie.find({ match: req.params.matchId })
      .populate({
        path: 'match',
        populate: [
          { path: 'tournoi' },
          { path: 'participant1' },
          { path: 'participant2' }
        ]
      })
      .populate('streams');
    res.status(200).json(parties);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des parties', error: error.message });
  }
};

// Mettre à jour une partie
exports.updatePartie = async (req, res) => {
  try {
    const { score, map, duree, date_debut, date_fin } = req.body;

    const partie = await Partie.findById(req.params.id);
    
    if (!partie) {
      return res.status(404).json({ message: 'Partie non trouvée' });
    }

    const updatedPartie = await Partie.findByIdAndUpdate(
      req.params.id,
      { score, map, duree, date_debut, date_fin },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'match',
        populate: [
          { path: 'tournoi' },
          { path: 'participant1' },
          { path: 'participant2' }
        ]
      })
      .populate('streams');

    res.status(200).json(updatedPartie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la partie', error: error.message });
  }
};

// Supprimer une partie
exports.deletePartie = async (req, res) => {
  try {
    const partie = await Partie.findById(req.params.id);

    if (!partie) {
      return res.status(404).json({ message: 'Partie non trouvée' });
    }

    await Partie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Partie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la partie', error: error.message });
  }
};