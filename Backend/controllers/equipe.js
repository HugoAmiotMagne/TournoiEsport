const Equipe = require('../models/Equipe');
const User = require('../models/User');
const Jeu = require('../models/Jeu');

// ── Taille max du logo : 2 Mo en Base64 ──
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2 Mo

const validateLogo = (logo) => {
  if (!logo) return null;
  if (!/^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(logo)) {
    return 'Le logo doit être une image valide (jpeg, png, gif, webp) encodée en Base64';
  }
  // Calcul taille approximative du fichier depuis la string Base64
  const base64Data = logo.split(',')[1] || '';
  const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
  if (sizeInBytes > MAX_LOGO_SIZE) {
    return 'Le logo ne doit pas dépasser 2 Mo';
  }
  return null;
};

// Créer une équipe
exports.createEquipe = async (req, res) => {
  try {
    const { Name, description, jeu_principal } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Nom requis" });
    }

    const exists = await Equipe.findOne({ Name });
    if (exists) {
      return res.status(400).json({ message: "Nom déjà utilisé" });
    }

    if (jeu_principal) {
      const jeu = await Jeu.findById(jeu_principal);
      if (!jeu) return res.status(404).json({ message: "Jeu introuvable" });
    }

    const equipe = new Equipe({
      Name,
      description,
      jeu_principal,
      logo: req.file ? `/uploads/logos/${req.file.filename}` : null,
      capitaine: req.user.id,
      membres: [req.user.id],
    });

    await equipe.save();
    await equipe.populate('capitaine membres jeu_principal');

    res.status(201).json(equipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Obtenir toutes les équipes
exports.getAllEquipes = async (req, res) => {
  try {
    // Support recherche par nom
    const filter = {};
    if (req.query.search) {
      filter.Name = { $regex: req.query.search, $options: 'i' };
    }

    const equipes = await Equipe.find(filter)
      .populate('capitaine', '-Password')
      .populate('membres', '-Password')
      .populate('jeu_principal');

    res.status(200).json(equipes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des équipes', error: error.message });
  }
};

// Obtenir une équipe par ID
exports.getEquipeById = async (req, res) => {
  try {
    const equipe = await Equipe.findById(req.params.id)
      .populate('capitaine', '-Password')
      .populate('membres', '-Password')
      .populate('jeu_principal');

    if (!equipe) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    res.status(200).json(equipe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'équipe', error: error.message });
  }
};

// Obtenir les équipes d'un utilisateur
exports.getEquipesByUser = async (req, res) => {
  try {
    const equipes = await Equipe.find({ membres: req.params.userId })
      .populate('capitaine', '-Password')
      .populate('membres', '-Password')
      .populate('jeu_principal');
    res.status(200).json(equipes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des équipes', error: error.message });
  }
};

// Obtenir mon équipe (utilisateur connecté)
exports.getMyEquipe = async (req, res) => {
  try {
    const equipes = await Equipe.find({ membres: req.user.id })
      .populate('capitaine', '-Password')
      .populate('membres', '-Password')
      .populate('jeu_principal');
    res.status(200).json(equipes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos équipes', error: error.message });
  }
};

// Mettre à jour une équipe
exports.updateEquipe = async (req, res) => {
  try {
    const { Name, logo, description, jeu_principal } = req.body;

    const equipe = await Equipe.findById(req.params.id);
    if (!equipe) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    if (equipe.capitaine.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Seul le capitaine peut modifier l\'équipe' });
    }

    if (Name && Name !== equipe.Name) {
      const nameExists = await Equipe.findOne({ Name });
      if (nameExists) {
        return res.status(400).json({ message: 'Une équipe avec ce nom existe déjà' });
      }
    }

    // Valider le logo si fourni
    if (logo !== undefined) {
      const logoError = validateLogo(logo);
      if (logoError) {
        return res.status(400).json({ message: logoError });
      }
    }

    if (jeu_principal) {
      const jeuExists = await Jeu.findById(jeu_principal);
      if (!jeuExists) {
        return res.status(404).json({ message: 'Jeu non trouvé' });
      }
    }

    const updatedEquipe = await Equipe.findByIdAndUpdate(
      req.params.id,
      {
        ...(Name        && { Name }),
        ...(logo !== undefined && { logo: logo || null }),
        ...(description !== undefined && { description }),
        ...(jeu_principal && { jeu_principal }),
      },
      { new: true, runValidators: true }
    )
      .populate('capitaine', '-Password')
      .populate('membres', '-Password')
      .populate('jeu_principal');

    res.status(200).json(updatedEquipe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'équipe', error: error.message });
  }
};

// Retirer un membre de l'équipe
exports.removeMembre = async (req, res) => {
  try {
    const { membreId } = req.params;

    const equipe = await Equipe.findById(req.params.id);
    if (!equipe) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    if (equipe.capitaine.toString() !== req.user.id && req.user.id !== membreId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à retirer ce membre' });
    }

    if (membreId === equipe.capitaine.toString()) {
      return res.status(400).json({ message: 'Le capitaine ne peut pas quitter l\'équipe. Transférez d\'abord le rôle de capitaine.' });
    }

    if (!equipe.membres.includes(membreId)) {
      return res.status(400).json({ message: 'Cet utilisateur n\'est pas membre de l\'équipe' });
    }

    equipe.membres = equipe.membres.filter(membre => membre.toString() !== membreId);
    await equipe.save();
    await equipe.populate('capitaine', '-Password');
    await equipe.populate('membres', '-Password');
    await equipe.populate('jeu_principal');

    res.status(200).json({ message: 'Membre retiré avec succès', equipe });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du retrait du membre', error: error.message });
  }
};

// Quitter une équipe (membre)
exports.quitterEquipe = async (req, res) => {
  try {
    const equipe = await Equipe.findById(req.params.id);
    if (!equipe) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    if (!equipe.membres.includes(req.user.id)) {
      return res.status(400).json({ message: 'Vous n\'êtes pas membre de cette équipe' });
    }

    if (equipe.capitaine.toString() === req.user.id) {
      return res.status(400).json({ message: 'Le capitaine ne peut pas quitter l\'équipe. Transférez d\'abord le rôle de capitaine ou supprimez l\'équipe.' });
    }

    equipe.membres = equipe.membres.filter(membre => membre.toString() !== req.user.id);
    await equipe.save();
    await equipe.populate('capitaine', '-Password');
    await equipe.populate('membres', '-Password');
    await equipe.populate('jeu_principal');

    res.status(200).json({ message: 'Vous avez quitté l\'équipe avec succès', equipe });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du départ de l\'équipe', error: error.message });
  }
};

// Supprimer une équipe
exports.deleteEquipe = async (req, res) => {
  try {
    const equipe = await Equipe.findById(req.params.id);
    if (!equipe) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    if (equipe.capitaine.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Seul le capitaine peut supprimer l\'équipe' });
    }

    await Equipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Équipe supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'équipe', error: error.message });
  }
};