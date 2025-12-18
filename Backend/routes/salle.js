const express = require('express');
const router = express.Router();
const salleController = require('../controllers/salle');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Salles
 *   description: Gestion des salles
 */

// Routes publiques

/**
 * @swagger
 * /api/salles:
 *   get:
 *     summary: Récupérer toutes les salles
 *     tags: [Salles]
 *     responses:
 *       200:
 *         description: Liste des salles
 */
router.get('/', salleController.getAllSalles);

/**
 * @swagger
 * /api/salles/bar/{barId}:
 *   get:
 *     summary: Récupérer les salles d'un bar
 *     tags: [Salles]
 *     parameters:
 *       - in: path
 *         name: barId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des salles du bar
 */
router.get('/bar/:barId', salleController.getSallesByBar);

/**
 * @swagger
 * /api/salles/{id}:
 *   get:
 *     summary: Récupérer une salle par ID
 *     tags: [Salles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Salle trouvée
 *       404:
 *         description: Salle non trouvée
 */
router.get('/:id', salleController.getSalleById);

// Routes protégées

/**
 * @swagger
 * /api/salles/mes-salles:
 *   get:
 *     summary: Récupérer mes salles (utilisateur connecté)
 *     tags: [Salles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des salles de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/mes-salles', auth, salleController.getMySalles);

/**
 * @swagger
 * /api/salles:
 *   post:
 *     summary: Créer une salle
 *     tags: [Salles]
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
 *         description: Salle créée
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, salleController.createSalle);

/**
 * @swagger
 * /api/salles/{id}:
 *   put:
 *     summary: Mettre à jour une salle
 *     tags: [Salles]
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
 *         description: Salle mise à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, salleController.updateSalle);

/**
 * @swagger
 * /api/salles/{id}:
 *   delete:
 *     summary: Supprimer une salle
 *     tags: [Salles]
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
 *         description: Salle supprimée
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, salleController.deleteSalle);

module.exports = router;
