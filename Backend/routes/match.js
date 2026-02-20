const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Matchs
 *   description: Gestion des matchs
 */

// Routes publiques

/**
 * @swagger
 * /api/match:
 *   get:
 *     summary: Récupérer tous les matchs
 *     tags: [Matchs]
 *     responses:
 *       200:
 *         description: Liste des matchs
 */
router.get('/', matchController.getAllMatches);

/**
 * @swagger
 * /api/match/tournois/{id}:
 *   get:
 *     summary: Récupérer les matchs d'un tournoi
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matchs du tournoi
 */
router.get('/match/:id', matchController.getMatchesByTournoi);

/**
 * @swagger
 * /api/match/tournois/{tournoiId}:
 *   get:
 *     summary: Récupérer les matchs d'un tournoi
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: tournoiId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matchs du tournoi
 */
router.get('/tournois/:tournoiId', matchController.getMatchesByTournoi);

/**
 * @swagger
 * /api/match/equipe/{equipeId}:
 *   get:
 *     summary: Récupérer les matchs d'une équipe
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matchs de l'équipe
 */
router.get('/equipe/:equipeId', matchController.getMatchesByEquipe);

/**
 * @swagger
 * /api/match/{id}:
 *   get:
 *     summary: Récupérer un match par ID
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match trouvé
 *       404:
 *         description: Match non trouvé
 */
router.get('/:id', matchController.getMatchById);

// Routes protégées

/**
 * @swagger
 * /api/match:
 *   post:
 *     summary: Créer un match
 *     tags: [Matchs]
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
 *         description: Match créé
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, matchController.createMatch);

/**
 * @swagger
 * /api/match/{id}:
 *   put:
 *     summary: Mettre à jour un match
 *     tags: [Matchs]
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
 *         description: Match mis à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, matchController.updateMatch);

/**
 * @swagger
 * /api/match/{id}:
 *   delete:
 *     summary: Supprimer un match
 *     tags: [Matchs]
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
 *         description: Match supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, matchController.deleteMatch);

module.exports = router;