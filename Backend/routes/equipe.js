const express    = require('express');
const router     = express.Router();
const equipeController = require('../controllers/equipe');
const auth       = require('../middleware/auth');
const upload     = require('../middleware/uploadLogo');

// ── Routes publiques ──

router.get('/user/:userId', equipeController.getEquipesByUser);

router.get('/mon-equipe',   auth, equipeController.getMyEquipe);

router.get('/:id',          equipeController.getEquipeById);

router.get('/',             equipeController.getAllEquipes);

// ── Routes protégées ──

router.post('/new', auth, upload, equipeController.createEquipe);

router.put('/:id', auth, upload, equipeController.updateEquipe);

router.post('/:id/quitter', auth, equipeController.quitterEquipe);

router.delete('/:id/membres/:membreId', auth, equipeController.removeMembre);

router.delete('/:id', auth, equipeController.deleteEquipe);

module.exports = router;