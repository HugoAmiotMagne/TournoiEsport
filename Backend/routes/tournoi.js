const express = require('express');
const router = express.Router();
const tournoiController = require('../controllers/tournoi');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Tournois
 *   description: Gestion des tournois
 */

// Routes publiques

/**
 * @swagger
 * /api/tournois:
 *   get:
 *     summary: Récupérer tous les tournois
 *     tags: [Tournois]
 *     responses:
 *       200:
 *         description: Liste des tournois
 */
router.get('/', tournoiController.getAllTournois);

/**
 * @swagger
 * /api/tournois/{id}/inscriptions:
 *   get:
 *     summary: Récupérer un tournoi avec ses inscriptions
 *     tags: [Tournois]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournoi avec inscriptions
 *       404:
 *         description: Tournoi non trouvé
 */
router.get('/:id/inscriptions', tournoiController.getTournoiWithInscriptions);

/**
 * @swagger
 * /api/tournois/{id}:
 *   get:
 *     summary: Récupérer un tournoi par ID
 *     tags: [Tournois]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournoi trouvé
 *       404:
 *         description: Tournoi non trouvé
 */
router.get('/:id', tournoiController.getTournoiById);

// Routes protégées

/**
 * @swagger
 * /api/tournois/mes-tournois:
 *   get:
 *     summary: Récupérer mes tournois (utilisateur connecté)
 *     tags: [Tournois]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tournois de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/mes-tournois', auth, tournoiController.getMyTournois);

/**
 * @swagger
 * /api/tournois:
 *   post:
 *     summary: Créer un tournoi
 *     tags: [Tournois]
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
 *         description: Tournoi créé
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, tournoiController.createTournoi);

/**
 * @swagger
 * /api/tournois/{id}:
 *   put:
 *     summary: Mettre à jour un tournoi
 *     tags: [Tournois]
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
 *         description: Tournoi mis à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, tournoiController.updateTournoi);

/**
 * @swagger
 * /api/tournois/{id}/statut:
 *   patch:
 *     summary: Mettre à jour le statut d'un tournoi
 *     tags: [Tournois]
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
 *             properties:
 *               statut:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       401:
 *         description: Non autorisé
 */
router.patch('/:id/statut', auth, tournoiController.updateStatut);

/**
 * @swagger
 * /api/tournois/{id}:
 *   delete:
 *     summary: Supprimer un tournoi
 *     tags: [Tournois]
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
 *         description: Tournoi supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, tournoiController.deleteTournoi);

module.exports = router;
