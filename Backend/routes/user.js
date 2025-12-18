const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Authentification des utilisateurs
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     tags: [Users]
 *     summary: Inscription utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nom
 *               - prenom
 *               - date_de_naissance
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               date_de_naissance:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non autorisé
 */
router.post("/signup", userCtrl.signUpUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non autorisé
 */
router.post("/login", userCtrl.loginUser);

// Routes protégées

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer le profil utilisateur
 *     tags: [Users]
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
 *         description: Profil utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get("/:id", auth, userCtrl.getUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour son profil
 *     tags: [Users]
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
 *         description: Profil mis à jour
 */
router.put("/:id", auth, userCtrl.updateUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer son compte
 *     tags: [Users]
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
 *         description: Compte supprimé
 */
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
