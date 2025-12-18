const express = require('express');
const router = express.Router();
const streamController = require('../controllers/stream');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Streams
 *   description: Gestion des streams
 */

// Routes publiques

/**
 * @swagger
 * /api/streams:
 *   get:
 *     summary: Récupérer tous les streams
 *     tags: [Streams]
 *     responses:
 *       200:
 *         description: Liste des streams
 */
router.get('/', streamController.getAllStreams);

/**
 * @swagger
 * /api/streams/live:
 *   get:
 *     summary: Récupérer les streams en direct
 *     tags: [Streams]
 *     responses:
 *       200:
 *         description: Liste des streams en live
 */
router.get('/live', streamController.getLiveStreams);

/**
 * @swagger
 * /api/streams/{id}:
 *   get:
 *     summary: Récupérer un stream par ID
 *     tags: [Streams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stream trouvé
 *       404:
 *         description: Stream non trouvé
 */
router.get('/:id', streamController.getStreamById);

/**
 * @swagger
 * /api/streams/partie/{partieId}:
 *   get:
 *     summary: Récupérer les streams liés à une partie
 *     tags: [Streams]
 *     parameters:
 *       - in: path
 *         name: partieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Streams de la partie
 */
router.get('/partie/:partieId', streamController.getStreamsByPartie);

// Routes protégées

/**
 * @swagger
 * /api/streams:
 *   post:
 *     summary: Créer un stream
 *     tags: [Streams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Stream final tournoi
 *               url:
 *                 type: string
 *                 example: https://twitch.tv/stream
 *               partieId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stream créé
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, streamController.createStream);

/**
 * @swagger
 * /api/streams/{id}:
 *   put:
 *     summary: Mettre à jour un stream
 *     tags: [Streams]
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
 *         description: Stream mis à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, streamController.updateStream);

/**
 * @swagger
 * /api/streams/{id}:
 *   delete:
 *     summary: Supprimer un stream
 *     tags: [Streams]
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
 *         description: Stream supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, streamController.deleteStream);

module.exports = router;
