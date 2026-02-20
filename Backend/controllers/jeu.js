const Jeu = require('../models/Jeu');
const Tournoi = require('../models/Tournoi');

// Créer un jeu
exports.createJeu = async (req, res) => {
  try {
    const { Name, Mode, Map, plateforme, min_joueur, max_joueur, image: imageFromBody } = req.body;
    const file = req.file;

    // Validation
    if (!Name || !Mode || !Map || !plateforme || !min_joueur || !max_joueur) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (min_joueur > max_joueur) {
      return res.status(400).json({ message: 'Le nombre minimum de joueurs ne peut pas être supérieur au maximum' });
    }

    // Disallow Base64 in body; prefer multipart upload via `image` field
    if (imageFromBody && /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(imageFromBody)) {
      return res.status(400).json({ message: 'Envoyez l\'image via multipart/form-data (champ `image`) plutôt qu\'en Base64.' });
    }

    let imagePath = null;
    if (file) {
      imagePath = `/uploads/images/${file.filename}`;
    } else if (imageFromBody && /^https?:\/\//i.test(imageFromBody)) {
      imagePath = imageFromBody;
    }

    const jeu = new Jeu({
      Name,
      Mode,
      Map,
      plateforme,
      min_joueur,
      max_joueur,
      ...(imagePath && { image: imagePath })
    });

    await jeu.save();
    res.status(201).json(jeu);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du jeu', error: error.message });
  }
};

// Obtenir tous les jeux
exports.getAllJeux = async (req, res) => {
  try {
    const jeux = await Jeu.find();
    res.status(200).json(jeux);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des jeux', error: error.message });
  }
};

// Obtenir un jeu par ID
exports.getJeuById = async (req, res) => {
  try {
    const jeu = await Jeu.findById(req.params.id);
    
    if (!jeu) {
      return res.status(404).json({ message: 'Jeu non trouvé' });
    }
    
    res.status(200).json(jeu);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du jeu', error: error.message });
  }
};

// Obtenir un jeu avec ses tournois
exports.getJeuWithTournois = async (req, res) => {
  try {
    const jeu = await Jeu.findById(req.params.id);
    
    if (!jeu) {
      return res.status(404).json({ message: 'Jeu non trouvé' });
    }

    // Récupérer tous les tournois de ce jeu
    const tournois = await Tournoi.find({ jeu: req.params.id })
      .populate('salle')
      .populate('createur', '-Password');
    
    res.status(200).json({
      ...jeu.toObject(),
      tournois
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du jeu', error: error.message });
  }
};

// Mettre à jour un jeu
exports.updateJeu = async (req, res) => {
  try {
    const { Name, Mode, Map, plateforme, min_joueur, max_joueur, image: imageFromBody } = req.body;
    const file = req.file;

    if (min_joueur && max_joueur && min_joueur > max_joueur) {
      return res.status(400).json({ message: 'Le nombre minimum de joueurs ne peut pas être supérieur au maximum' });
    }

    // Disallow Base64 in body on update
    if (imageFromBody && /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(imageFromBody)) {
      return res.status(400).json({ message: 'Envoyez l\'image via multipart/form-data (champ `image`) plutôt qu\'en Base64.' });
    }

    const updateData = { Name, Mode, Map, plateforme, min_joueur, max_joueur };
    if (file) {
      updateData.image = `/uploads/images/${file.filename}`;
    } else if (imageFromBody !== undefined) {
      // If provided and is a URL, keep it; if empty string/null, clear the image
      if (imageFromBody === '' || imageFromBody === null) {
        updateData.image = null;
      } else if (/^https?:\/\//i.test(imageFromBody)) {
        updateData.image = imageFromBody;
      }
    }

    const jeu = await Jeu.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!jeu) {
      return res.status(404).json({ message: 'Jeu non trouvé' });
    }

    res.status(200).json(jeu);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du jeu', error: error.message });
  }
};

// Supprimer un jeu
exports.deleteJeu = async (req, res) => {
  try {
    // Vérifier s'il y a des tournois associés
    const tournoiCount = await Tournoi.countDocuments({ jeu: req.params.id });
    
    if (tournoiCount > 0) {
      return res.status(400).json({ 
        message: `Impossible de supprimer ce jeu car ${tournoiCount} tournoi(s) y sont associés` 
      });
    }

    const jeu = await Jeu.findByIdAndDelete(req.params.id);

    if (!jeu) {
      return res.status(404).json({ message: 'Jeu non trouvé' });
    }

    res.status(200).json({ message: 'Jeu supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du jeu', error: error.message });
  }
};