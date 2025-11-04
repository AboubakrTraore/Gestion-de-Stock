// routes/auth.route.js
const express = require('express');
const router = express.Router();

//Importer le controller d'authentification
const AuthController = require('../controllers/auth.controller');

//Routes d'authentification
router.post('/login', AuthController.login);

module.exports = router;