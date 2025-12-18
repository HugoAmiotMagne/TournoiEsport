const Equipe = require('../models/Equipe');
const User = require('../models/User');
const Jeu = require('../models/Jeu');

// Créer une équipe
exports.createEquipe = async (req, res) => {
  try {
    const { Name, logo, description, jeu_principal } = req.body;

    // Validation
    if (!Name) {
      return res.status(400).json({ message: 'Le nom de l\'équipe est requis' });
    }

    // Vérifier si l'équipe existe déjà
    const equipeExists = await Equipe.findOne({ Name });
    if (equipeExists) {
      return res.status(400).json({ message: 'Une équipe avec ce nom existe déjà' });
    }

    // Vérifier que le jeu existe si fourni
    if (jeu_principal) {
      const jeuExists = await Jeu.findById(jeu_principal);
      if (!jeuExists) {
        return res.status(404).json({ message: 'Jeu non trouvé' });
      }
    }

    const equipe = new Equipe({
      Name,
      logo,
      description,
      jeu_principal,
      capitaine: req.user.id, // Le créateur devient capitaine
      membres: [req.user.id] // Le créateur est aussi membre
    });

    await equipe.save();
    await equipe.populate('capitaine', '-Password');
    await equipe.populate('membres', '-Password');
    await equipe.populate('jeu_principal');
    
    res.status(201).json(equipe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'équipe', error: error.message });
  }
};

// Obtenir toutes les équipes
exports.getAllEquipes = async (req, res) => {
  try {
    const equipes = await Equipe.find()
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

    // Vérifier que l'utilisateur est le capitaine
    if (equipe.capitaine.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Seul le capitaine peut modifier l\'équipe' });
    }

    // Vérifier si le nouveau nom existe déjà (si différent de l'actuel)
    if (Name && Name !== equipe.Name) {
      const nameExists = await Equipe.findOne({ Name });
      if (nameExists) {
        return res.status(400).json({ message: 'Une équipe avec ce nom existe déjà' });
      }
    }

    // Vérifier que le jeu existe si fourni
    if (jeu_principal) {
      const jeuExists = await Jeu.findById(jeu_principal);
      if (!jeuExists) {
        return res.status(404).json({ message: 'Jeu non trouvé' });
      }
    }

    const updatedEquipe = await Equipe.findByIdAndUpdate(
      req.params.id,
      { Name, logo, description, jeu_principal },
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

    // Vérifier que l'utilisateur est le capitaine OU le membre lui-même
    if (equipe.capitaine.toString() !== req.user.id && req.user.id !== membreId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à retirer ce membre' });
    }

    // Empêcher le capitaine de se retirer lui-même
    if (membreId === equipe.capitaine.toString()) {
      return res.status(400).json({ message: 'Le capitaine ne peut pas quitter l\'équipe. Transférez d\'abord le rôle de capitaine.' });
    }

    // Vérifier que l'utilisateur est bien membre
    if (!equipe.membres.includes(membreId)) {
      return res.status(400).json({ message: 'Cet utilisateur n\'est pas membre de l\'équipe' });
    }

    equipe.membres = equipe.membres.filter(membre => membre.toString() !== membreId);
    await equipe.save();
    await equipe.populate('capitaine', '-Password');
    await equipe.populate('membres', '-Password');
    await equipe.populate('jeu_principal');

    res.status(200).json({
      message: 'Membre retiré avec succès',
      equipe
    });
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

    // Vérifier que l'utilisateur est membre
    if (!equipe.membres.includes(req.user.id)) {
      return res.status(400).json({ message: 'Vous n\'êtes pas membre de cette équipe' });
    }

    // Empêcher le capitaine de quitter
    if (equipe.capitaine.toString() === req.user.id) {
      return res.status(400).json({ message: 'Le capitaine ne peut pas quitter l\'équipe. Transférez d\'abord le rôle de capitaine ou supprimez l\'équipe.' });
    }

    equipe.membres = equipe.membres.filter(membre => membre.toString() !== req.user.id);
    await equipe.save();
    await equipe.populate('capitaine', '-Password');
    await equipe.populate('membres', '-Password');
    await equipe.populate('jeu_principal');

    res.status(200).json({
      message: 'Vous avez quitté l\'équipe avec succès',
      equipe
    });
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

    // Vérifier que l'utilisateur est le capitaine
    if (equipe.capitaine.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Seul le capitaine peut supprimer l\'équipe' });
    }

    await Equipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Équipe supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'équipe', error: error.message });
  }
};