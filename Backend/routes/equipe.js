const express = require('express');
const router = express.Router();
const equipeController = require('../controllers/equipe');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Equipes
 *   description: Gestion des équipes
 */

// Routes publiques

/**
 * @swagger
 * /api/equipes/user/{userId}:
 *   get:
 *     summary: Récupérer les équipes d'un utilisateur
 *     tags: [Equipes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des équipes de l'utilisateur
 */
router.get('/user/:userId', equipeController.getEquipesByUser);

/**
 * @swagger
 * /api/equipes/{id}:
 *   get:
 *     summary: Récupérer une équipe par ID
 *     tags: [Equipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Équipe trouvée
 *       404:
 *         description: Équipe non trouvée
 */
router.get('/:id', equipeController.getEquipeById);

/**
 * @swagger
 * /api/equipes:
 *   get:
 *     summary: Récupérer toutes les équipes
 *     tags: [Equipes]
 *     responses:
 *       200:
 *         description: Liste de toutes les équipes
 */
router.get('/', equipeController.getAllEquipes);

// Routes protégées

/**
 * @swagger
 * /api/equipes/mon-equipes:
 *   get:
 *     summary: Récupérer mes équipes (utilisateur connecté)
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des équipes de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/mon-equipe', auth, equipeController.getMyEquipe);

/**
 * @swagger
 * /api/equipes:
 *   post:
 *     summary: Créer une équipe
 *     tags: [Equipes]
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
 *         description: Équipe créée
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, equipeController.createEquipe);

/**
 * @swagger
 * /api/equipes/{id}:
 *   put:
 *     summary: Mettre à jour une équipe
 *     tags: [Equipes]
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
 *         description: Équipe mise à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, equipeController.updateEquipe);

/**
 * @swagger
 * /api/equipes/{id}/quitter:
 *   post:
 *     summary: Quitter une équipe
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Équipe quittée
 *       401:
 *         description: Non autorisé
 */
router.post('/:id/quitter', auth, equipeController.quitterEquipe);

/**
 * @swagger
 * /api/equipes/{id}/membres/{membreId}:
 *   delete:
 *     summary: Supprimer un membre d'une équipe
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: membreId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Membre supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id/membres/:membreId', auth, equipeController.removeMembre);

/**
 * @swagger
 * /api/equipes/{id}:
 *   delete:
 *     summary: Supprimer une équipe
 *     tags: [Equipes]
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
 *         description: Équipe supprimée
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, equipeController.deleteEquipe);

module.exports = router;
