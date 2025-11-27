// routes/auth.route.js
const express = require('express');
const router = express.Router();

//Importer le controller d'authentification
const AuthController = require('../controllers/auth.controller');
const validateLogin = require('../validations/user.validations');

//Routes d'authentification
router.post('/login', AuthController.login);
//Route pour la déconnexion
router.post('/logout', AuthController.logout);

module.exports = router;