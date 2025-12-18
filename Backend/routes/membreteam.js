const express = require('express');
const router = express.Router();
const membreTeamController = require('../controllers/membreteam');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: MembresTeams
 *   description: Gestion des membres d'équipes
 */

// Routes publiques

/**
 * @swagger
 * /api/membreteams/equipe/{equipeId}:
 *   get:
 *     summary: Récupérer les membres d'une équipe
 *     tags: [MembresTeams]
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des membres de l'équipe
 */
router.get('/equipe/:equipeId', membreTeamController.getMembresByEquipe);

/**
 * @swagger
 * /api/membreteams/user/{userId}:
 *   get:
 *     summary: Récupérer les équipes d'un utilisateur
 *     tags: [MembresTeams]
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
router.get('/user/:userId', membreTeamController.getEquipesByUser);

/**
 * @swagger
 * /api/membreteams/{id}:
 *   get:
 *     summary: Récupérer un membre par ID
 *     tags: [MembresTeams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membre trouvé
 *       404:
 *         description: Membre non trouvé
 */
router.get('/:id', membreTeamController.getMembreById);

/**
 * @swagger
 * /api/membreteams:
 *   get:
 *     summary: Récupérer tous les membres
 *     tags: [MembresTeams]
 *     responses:
 *       200:
 *         description: Liste de tous les membres
 */
router.get('/', membreTeamController.getAllMembres);

// Routes protégées

/**
 * @swagger
 * /api/membreteams/mon-equipe:
 *   get:
 *     summary: Récupérer mon équipe (utilisateur connecté)
 *     tags: [MembresTeams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Équipe de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/mon-equipe', auth, membreTeamController.getMyTeams);

/**
 * @swagger
 * /api/membreteams:
 *   post:
 *     summary: Ajouter un membre à une équipe
 *     tags: [MembresTeams]
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
 *         description: Membre ajouté à l'équipe
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, membreTeamController.addMembreToTeam);

/**
 * @swagger
 * /api/membreteams/{id}:
 *   put:
 *     summary: Mettre à jour un membre
 *     tags: [MembresTeams]
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
 *         description: Membre mis à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', auth, membreTeamController.updateMembre);

/**
 * @swagger
 * /api/membreteams/{id}:
 *   delete:
 *     summary: Supprimer un membre
 *     tags: [MembresTeams]
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
 *         description: Membre supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', auth, membreTeamController.removeMembre);

module.exports = router;
