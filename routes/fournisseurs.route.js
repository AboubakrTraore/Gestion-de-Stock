const express = require('express');
const router = express.Router();
const FournisseurController = require('../controllers/fournisseurs.controller');
const checkAuth = require('../middleware/check-auth');
const checkRole = require('../middleware/check-role');

// Routes pour les fournisseurs
router.get('/', FournisseurController.getAllFournisseurs);
router.get('/:id', FournisseurController.getFournisseurById);
router.post('/', FournisseurController.createFournisseur);
router.put('/:id', FournisseurController.updateFournisseur);
router.delete('/:id', FournisseurController.deleteFournisseur);

module.exports = router;
