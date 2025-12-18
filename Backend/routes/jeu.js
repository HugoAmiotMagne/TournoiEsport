const express = require('express');
const router = express.Router();
const jeuController = require('../controllers/jeu');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Jeux
 *   description: Gestion des jeux
 */

// Routes publiques

/**
 * @swagger
 * /api/jeux:
 *   get:
 *     summary: Récupérer tous les jeux
 *     tags: [Jeux]
 *     responses:
 *       200:
 *         description: Liste des jeux
 */
router.get('/', jeuController.getAllJeux);

/**
 * @swagger
 * /api/jeux/{id}/tournois:
 *   get:
 *     summary: Récupérer un jeu avec ses tournois
 *     tags: [Jeux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jeu et tournois associés
 *       404:
 *         description: Jeu non trouvé
 */
router.get('/:id/tournois', jeuController.getJeuWithTournois);

/**
 * @swagger
 * /api/jeux/{id}:
 *   get:
 *     summary: Récupérer un jeu par ID
 *     tags: [Jeux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jeu trouvé
 *       404:
 *         description: Jeu non trouvé
 */
router.get('/:id', jeuController.getJeuById);

// Routes protégées (admin)

/**
 * @swagger
 * /api/jeux:
 *   post:
 *     summary: Créer un jeu
 *     tags: [Jeux]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Counter-Strike 2
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Jeu créé
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, jeuController.createJeu);

/**
 * @swagger
 * /api/jeux/{id}:
 *   put:
 *     summary: Mettre à jour un jeu
 *     tags: [Jeux]
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
 *         description: Jeu mis à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, jeuController.updateJeu);

/**
 * @swagger
 * /api/jeux/{id}:
 *   delete:
 *     summary: Supprimer un jeu
 *     tags: [Jeux]
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
 *         description: Jeu supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, jeuController.deleteJeu);

module.exports = router;
