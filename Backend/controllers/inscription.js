const Inscription = require('../models/Inscription');
const Tournoi = require('../models/Tournoi');
const Equipe = require('../models/Equipe');

// Créer une inscription
exports.createInscription = async (req, res) => {
  try {
    const { date_limite, statut, classement, tournoi, equipe, prix_paye, commentaire } = req.body;

    // Validation
    if (!date_limite || !tournoi || !equipe) {
      return res.status(400).json({ message: 'Date limite, tournoi et équipe sont obligatoires' });
    }

    // Vérifier que le tournoi existe
    const tournoiExists = await Tournoi.findById(tournoi);
    if (!tournoiExists) {
      return res.status(404).json({ message: 'Tournoi non trouvé' });
    }

    // Vérifier que l'équipe existe
    const equipeExists = await Equipe.findById(equipe);
    if (!equipeExists) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    // Vérifier que l'équipe n'est pas déjà inscrite
    const inscriptionExistante = await Inscription.findOne({ tournoi, equipe });
    if (inscriptionExistante) {
      return res.status(400).json({ message: 'Cette équipe est déjà inscrite à ce tournoi' });
    }

    // Vérifier le nombre maximum d'équipes
    if (tournoiExists.nombre_equipes_max) {
      const nombreInscriptions = await Inscription.countDocuments({ 
        tournoi, 
        statut: { $in: ['en_attente', 'acceptee'] } 
      });
      
      if (nombreInscriptions >= tournoiExists.nombre_equipes_max) {
        return res.status(400).json({ message: 'Le nombre maximum d\'équipes est atteint' });
      }
    }

    const inscription = new Inscription({
      date_limite,
      statut,
      classement,
      tournoi,
      equipe,
      prix_paye,
      commentaire
    });

    await inscription.save();
    await inscription.populate(['tournoi', 'equipe']);
    
    res.status(201).json(inscription);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'inscription', error: error.message });
  }
};

// Obtenir toutes les inscriptions
exports.getAllInscriptions = async (req, res) => {
  try {
    const inscriptions = await Inscription.find()
      .populate('tournoi')
      .populate('equipe');
    res.status(200).json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des inscriptions', error: error.message });
  }
};

// Obtenir une inscription par ID
exports.getInscriptionById = async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id)
      .populate('tournoi')
      .populate('equipe');
    
    if (!inscription) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }
    
    res.status(200).json(inscription);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'inscription', error: error.message });
  }
};

// Obtenir les inscriptions d'un tournoi
exports.getInscriptionsByTournoi = async (req, res) => {
  try {
    const inscriptions = await Inscription.find({ tournoi: req.params.tournoiId })
      .populate('tournoi')
      .populate('equipe');
    res.status(200).json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des inscriptions', error: error.message });
  }
};

// Obtenir les inscriptions d'une équipe
exports.getInscriptionsByEquipe = async (req, res) => {
  try {
    const inscriptions = await Inscription.find({ equipe: req.params.equipeId })
      .populate('tournoi')
      .populate('equipe');
    res.status(200).json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des inscriptions', error: error.message });
  }
};

// Obtenir les inscriptions de mon équipe (utilisateur connecté)
exports.getMyInscriptions = async (req, res) => {
  try {
    // Trouver les équipes dont l'utilisateur est membre ou capitaine
    const mesEquipes = await Equipe.find({
      $or: [
        { capitaine: req.user.id },
        { membres: req.user.id }
      ]
    });
    
    const equipeIds = mesEquipes.map(equipe => equipe._id);
    
    const inscriptions = await Inscription.find({ equipe: { $in: equipeIds } })
      .populate('tournoi')
      .populate('equipe');
    
    res.status(200).json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos inscriptions', error: error.message });
  }
};

// Mettre à jour une inscription
exports.updateInscription = async (req, res) => {
  try {
    const { date_limite, statut, classement, prix_paye, commentaire } = req.body;

    const inscription = await Inscription.findById(req.params.id);
    
    if (!inscription) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }

    const updatedInscription = await Inscription.findByIdAndUpdate(
      req.params.id,
      { date_limite, statut, classement, prix_paye, commentaire },
      { new: true, runValidators: true }
    )
      .populate('tournoi')
      .populate('equipe');

    res.status(200).json(updatedInscription);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'inscription', error: error.message });
  }
};

// Supprimer une inscription
exports.deleteInscription = async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id);

    if (!inscription) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }

    await Inscription.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inscription supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'inscription', error: error.message });
  }
};