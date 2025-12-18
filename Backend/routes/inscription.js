const express = require('express');
const router = express.Router();
const inscriptionController = require('../controllers/inscription');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Inscriptions
 *   description: Gestion des inscriptions
 */

// Routes publiques

/**
 * @swagger
 * /api/inscriptions/tournoi/{tournoiId}:
 *   get:
 *     summary: Récupérer les inscriptions d'un tournoi
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: tournoiId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des inscriptions du tournoi
 */
router.get('/tournoi/:tournoiId', inscriptionController.getInscriptionsByTournoi);

/**
 * @swagger
 * /api/inscriptions/equipe/{equipeId}:
 *   get:
 *     summary: Récupérer les inscriptions d'une équipe
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des inscriptions de l'équipe
 */
router.get('/equipe/:equipeId', inscriptionController.getInscriptionsByEquipe);

/**
 * @swagger
 * /api/inscriptions/{id}:
 *   get:
 *     summary: Récupérer une inscription par ID
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscription trouvée
 *       404:
 *         description: Inscription non trouvée
 */
router.get('/:id', inscriptionController.getInscriptionById);

/**
 * @swagger
 * /api/inscriptions:
 *   get:
 *     summary: Récupérer toutes les inscriptions
 *     tags: [Inscriptions]
 *     responses:
 *       200:
 *         description: Liste de toutes les inscriptions
 */
router.get('/', inscriptionController.getAllInscriptions);

// Routes protégées

/**
 * @swagger
 * /api/inscriptions/mes-inscriptions:
 *   get:
 *     summary: Récupérer mes inscriptions (utilisateur connecté)
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des inscriptions de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/mes-inscriptions', auth, inscriptionController.getMyInscriptions);

/**
 * @swagger
 * /api/inscriptions:
 *   post:
 *     summary: Créer une inscription
 *     tags: [Inscriptions]
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
 *         description: Inscription créée
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, inscriptionController.createInscription);

/**
 * @swagger
 * /api/inscriptions/{id}:
 *   put:
 *     summary: Mettre à jour une inscription
 *     tags: [Inscriptions]
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
 *         description: Inscription mise à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, inscriptionController.updateInscription);

/**
 * @swagger
 * /api/inscriptions/{id}:
 *   delete:
 *     summary: Supprimer une inscription
 *     tags: [Inscriptions]
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
 *         description: Inscription supprimée
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, inscriptionController.deleteInscription);

module.exports = router;
