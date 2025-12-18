const express = require('express');
const router = express.Router();
const barController = require('../controllers/bar');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Bars
 *   description: Gestion des bars
 */

// Routes publiques

/**
 * @swagger
 * /api/bars/{id}/salles:
 *   get:
 *     summary: Récupérer un bar avec ses salles
 *     tags: [Bars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bar avec ses salles
 *       404:
 *         description: Bar non trouvé
 */
router.get('/:id/salles', barController.getBarWithSalles);

/**
 * @swagger
 * /api/bars/{id}:
 *   get:
 *     summary: Récupérer un bar par ID
 *     tags: [Bars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bar trouvé
 *       404:
 *         description: Bar non trouvé
 */
router.get('/:id', barController.getBarById);

/**
 * @swagger
 * /api/bars:
 *   get:
 *     summary: Récupérer tous les bars
 *     tags: [Bars]
 *     responses:
 *       200:
 *         description: Liste de tous les bars
 */
router.get('/', barController.getAllBars);

// Routes protégées

/**
 * @swagger
 * /api/bars/mes-bars:
 *   get:
 *     summary: Récupérer mes bars (utilisateur connecté)
 *     tags: [Bars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des bars de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/mes-bars', auth, barController.getMyBars);

/**
 * @swagger
 * /api/bars:
 *   post:
 *     summary: Créer un bar
 *     tags: [Bars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - adresse
 *               - email
 *               - proprietaire
 *             properties:
 *               nom:
 *                 type: string
 *                 example: ""
 *               adresse:
 *                 type: string
 *                 example: ""
 *               email:
 *                 type: string
 *                 example: ""
 *               telephone:
 *                 type: string
 *                 example: ""
 *               proprietaire:
 *                 type: string
 *                 description: ID de l'utilisateur propriétaire
 *                 example: ""
 *               horaires:
 *                 type: string
 *                 example: ""
 *               description:
 *                 type: string
 *                 example: ""
 *     responses:
 *       201:
 *         description: Bar créé
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, barController.createBar);

/**
 * @swagger
 * /api/bars/{id}:
 *   put:
 *     summary: Mettre à jour un bar
 *     tags: [Bars]
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
 *             required:
 *               - nom
 *               - adresse
 *               - email
 *               - proprietaire
 *             properties:
 *               nom:
 *                 type: string
 *                 example: ""
 *               adresse:
 *                 type: string
 *                 example: ""
 *               email:
 *                 type: string
 *                 example: ""
 *               telephone:
 *                 type: string
 *                 example: ""
 *               proprietaire:
 *                 type: string
 *                 description: ID de l'utilisateur propriétaire
 *                 example: ""
 *               horaires:
 *                 type: string
 *                 example: ""
 *               description:
 *                 type: string
 *                 example: ""   
 *     responses:
 *       200:
 *         description: Bar mis à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, barController.updateBar);

/**
 * @swagger
 * /api/bars/{id}:
 *   delete:
 *     summary: Supprimer un bar
 *     tags: [Bars]
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
 *         description: Bar supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, barController.deleteBar);

module.exports = router;
