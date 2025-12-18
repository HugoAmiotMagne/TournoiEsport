const express = require('express');
const router = express.Router();
const partieController = require('../controllers/partie');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Parties
 *   description: Gestion des parties
 */

// Routes publiques

/**
 * @swagger
 * /api/parties:
 *   get:
 *     summary: Récupérer toutes les parties
 *     tags: [Parties]
 *     responses:
 *       200:
 *         description: Liste des parties
 */
router.get('/', partieController.getAllParties);

/**
 * @swagger
 * /api/parties/match/{matchId}:
 *   get:
 *     summary: Récupérer les parties d'un match
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parties du match
 */
router.get('/match/:matchId', partieController.getPartiesByMatch);

/**
 * @swagger
 * /api/parties/{id}:
 *   get:
 *     summary: Récupérer une partie par ID
 *     tags: [Parties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Partie trouvée
 *       404:
 *         description: Partie non trouvée
 */
router.get('/:id', partieController.getPartieById);

// Routes protégées

/**
 * @swagger
 * /api/parties:
 *   post:
 *     summary: Créer une partie
 *     tags: [Parties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Partie créée
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, partieController.createPartie);

/**
 * @swagger
 * /api/parties/{id}:
 *   put:
 *     summary: Mettre à jour une partie
 *     tags: [Parties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Partie mise à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, partieController.updatePartie);

/**
 * @swagger
 * /api/parties/{id}:
 *   delete:
 *     summary: Supprimer une partie
 *     tags: [Parties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Partie supprimée
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, partieController.deletePartie);

module.exports = router;
