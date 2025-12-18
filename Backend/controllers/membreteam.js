const MembreTeam = require('../models/MembreTeam');
const Equipe = require('../models/Equipe');
const User = require('../models/User');

// Ajouter un membre à une équipe
exports.addMembreToTeam = async (req, res) => {
  try {
    const { role, user, equipe, numero_maillot, statut } = req.body;

    // Validation
    if (!user || !equipe) {
      return res.status(400).json({ message: 'L\'utilisateur et l\'équipe sont obligatoires' });
    }

    // Vérifier que l'équipe existe
    const equipeExists = await Equipe.findById(equipe);
    if (!equipeExists) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    // Vérifier que l'utilisateur existe
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier que l'utilisateur n'est pas déjà dans l'équipe
    const membreExistant = await MembreTeam.findOne({ user, equipe });
    if (membreExistant) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà membre de cette équipe' });
    }

    const membre = new MembreTeam({
      role,
      user,
      equipe,
      numero_maillot,
      statut
    });

    await membre.save();
    await membre.populate(['user', 'equipe']);
    
    res.status(201).json(membre);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du membre', error: error.message });
  }
};

// Obtenir tous les membres
exports.getAllMembres = async (req, res) => {
  try {
    const membres = await MembreTeam.find()
      .populate('user')
      .populate('equipe');
    res.status(200).json(membres);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des membres', error: error.message });
  }
};

// Obtenir un membre par ID
exports.getMembreById = async (req, res) => {
  try {
    const membre = await MembreTeam.findById(req.params.id)
      .populate('user')
      .populate('equipe');
    
    if (!membre) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }
    
    res.status(200).json(membre);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du membre', error: error.message });
  }
};

// Obtenir tous les membres d'une équipe
exports.getMembresByEquipe = async (req, res) => {
  try {
    const membres = await MembreTeam.find({ equipe: req.params.equipeId })
      .populate('user')
      .populate('equipe');
    res.status(200).json(membres);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des membres', error: error.message });
  }
};

// Obtenir toutes les équipes d'un utilisateur
exports.getEquipesByUser = async (req, res) => {
  try {
    const memberships = await MembreTeam.find({ user: req.params.userId })
      .populate('user')
      .populate('equipe');
    res.status(200).json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des équipes', error: error.message });
  }
};

// Obtenir mes équipes (utilisateur connecté)
exports.getMyTeams = async (req, res) => {
  try {
    const memberships = await MembreTeam.find({ user: req.user.id })
      .populate('user')
      .populate('equipe');
    res.status(200).json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos équipes', error: error.message });
  }
};

// Mettre à jour un membre (rôle, statut, numéro)
exports.updateMembre = async (req, res) => {
  try {
    const { role, numero_maillot, statut } = req.body;

    const membre = await MembreTeam.findById(req.params.id);
    
    if (!membre) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }

    // Si on change le rôle en capitaine, vérifier qu'il n'y en a pas déjà un
    if (role === 'capitaine' && membre.role !== 'capitaine') {
      const existingCapitaine = await MembreTeam.findOne({
        equipe: membre.equipe,
        role: 'capitaine',
        _id: { $ne: membre._id }
      });
      
      if (existingCapitaine) {
        return res.status(400).json({ message: 'Cette équipe a déjà un capitaine' });
      }
    }

    const updatedMembre = await MembreTeam.findByIdAndUpdate(
      req.params.id,
      { role, numero_maillot, statut },
      { new: true, runValidators: true }
    )
      .populate('user')
      .populate('equipe');

    res.status(200).json(updatedMembre);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du membre', error: error.message });
  }
};

// Retirer un membre d'une équipe
exports.removeMembre = async (req, res) => {
  try {
    const membre = await MembreTeam.findById(req.params.id);

    if (!membre) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }

    // Empêcher de retirer le capitaine s'il reste des membres
    if (membre.role === 'capitaine') {
      const autresMembres = await MembreTeam.countDocuments({
        equipe: membre.equipe,
        _id: { $ne: membre._id }
      });
      
      if (autresMembres > 0) {
        return res.status(400).json({ 
          message: 'Le capitaine ne peut pas quitter l\'équipe tant qu\'il reste des membres. Nommez d\'abord un nouveau capitaine.' 
        });
      }
    }

    await MembreTeam.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Membre retiré de l\'équipe avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du retrait du membre', error: error.message });
  }
};