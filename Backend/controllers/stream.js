const Stream = require('../models/Stream');
const Partie = require('../models/Partie');

// Créer un stream
exports.createStream = async (req, res) => {
  try {
    const { nom, plateforme, url, partie, statut, nombre_viewers } = req.body;

    // Validation
    if (!nom || !plateforme || !url || !partie) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier que la partie existe
    const partieExists = await Partie.findById(partie);
    if (!partieExists) {
      return res.status(404).json({ message: 'Partie non trouvée' });
    }

    const stream = new Stream({
      nom,
      plateforme,
      url,
      partie,
      statut,
      nombre_viewers
    });

    await stream.save();
    await stream.populate('partie');
    
    res.status(201).json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du stream', error: error.message });
  }
};

// Obtenir tous les streams
exports.getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find()
      .populate({
        path: 'partie',
        populate: {
          path: 'match',
          populate: ['tournoi', 'participant1', 'participant2']
        }
      });
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des streams', error: error.message });
  }
};

// Obtenir un stream par ID
exports.getStreamById = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id)
      .populate({
        path: 'partie',
        populate: {
          path: 'match',
          populate: ['tournoi', 'participant1', 'participant2']
        }
      });
    
    if (!stream) {
      return res.status(404).json({ message: 'Stream non trouvé' });
    }
    
    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du stream', error: error.message });
  }
};

// Obtenir les streams d'une partie
exports.getStreamsByPartie = async (req, res) => {
  try {
    const streams = await Stream.find({ partie: req.params.partieId })
      .populate({
        path: 'partie',
        populate: {
          path: 'match',
          populate: ['tournoi', 'participant1', 'participant2']
        }
      });
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des streams', error: error.message });
  }
};

// Obtenir les streams en direct
exports.getLiveStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ statut: 'en_direct' })
      .populate({
        path: 'partie',
        populate: {
          path: 'match',
          populate: ['tournoi', 'participant1', 'participant2']
        }
      });
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des streams en direct', error: error.message });
  }
};

// Mettre à jour un stream
exports.updateStream = async (req, res) => {
  try {
    const { nom, plateforme, url, statut, nombre_viewers } = req.body;

    const stream = await Stream.findById(req.params.id);
    
    if (!stream) {
      return res.status(404).json({ message: 'Stream non trouvé' });
    }

    const updatedStream = await Stream.findByIdAndUpdate(
      req.params.id,
      { nom, plateforme, url, statut, nombre_viewers },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'partie',
        populate: {
          path: 'match',
          populate: ['tournoi', 'participant1', 'participant2']
        }
      });

    res.status(200).json(updatedStream);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du stream', error: error.message });
  }
};

// Supprimer un stream
exports.deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);

    if (!stream) {
      return res.status(404).json({ message: 'Stream non trouvé' });
    }

    await Stream.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Stream supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du stream', error: error.message });
  }
};