const express = require('express');
const router = express.Router();
const billetCtrl = require('../controllers/billet');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Billets
 *   description: Gestion des billets
 */

// Routes publiques

/**
 * @swagger
 * /api/billets:
 *   get:
 *     summary: Récupérer tous les billets
 *     tags: [Billets]
 *     responses:
 *       200:
 *         description: Liste de tous les billets
 */
router.get('/', billetCtrl.getAllBillets);

/**
 * @swagger
 * /api/billets/{id}:
 *   get:
 *     summary: Récupérer un billet par ID
 *     tags: [Billets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billet trouvé
 *       404:
 *         description: Billet non trouvé
 */
router.get('/:id', billetCtrl.getBilletById);

// Routes protégées

/**
 * @swagger
 * /api/billets:
 *   post:
 *     summary: Créer un billet
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: ""
 *               prix:
 *                 type: number
 *                 example: 0
 *               quantite:
 *                 type: number
 *                 example: 0
 *               user:
 *                 type: string
 *                 example: ""
 *               salle:
 *                 type: string
 *                 example: ""
 *               tournoi:
 *                 type: string
 *                 example: ""
 *               statut:
 *                 type: string
 *                 example: ""
 *               date_achat:
 *                 type: string
 *                 format: date-time
 *                 example: ""
 *               date_evenement:
 *                 type: string
 *                 format: date-time
 *                 example: ""
 *     responses:
 *       201:
 *         description: Billet créé
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, billetCtrl.createBillet);

/**
 * @swagger
 * /api/billets/mes-billets:
 *   get:
 *     summary: Récupérer mes billets (utilisateur connecté)
 *     tags: [Billets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des billets de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/mes-billets', auth, billetCtrl.getMesBillets);

/**
 * @swagger
 * /api/billets/{id}/annuler:
 *   put:
 *     summary: Annuler un billet
 *     tags: [Billets]
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
 *         description: Billet annulé
 *       401:
 *         description: Non autorisé
 */
router.put('/:id/annuler', auth, billetCtrl.annulerBillet);

/**
 * @swagger
 * /api/billets/{id}:
 *   delete:
 *     summary: Supprimer un billet
 *     tags: [Billets]
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
 *         description: Billet supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, billetCtrl.deleteBillet);

module.exports = router;
