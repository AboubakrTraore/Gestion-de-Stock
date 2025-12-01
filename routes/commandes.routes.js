const express = require('express');
const router = express.Router();

const CommandeController = require('../controllers/commandes.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');

// Routes pour les commandes
router.get('/', checkAuth, checkRole('admin', 'employé'), CommandeController.getAllCommandes);
router.get('/:id', checkAuth, checkRole('admin', 'employé'), CommandeController.getCommandeById);
router.post('/', checkAuth, checkRole('admin', 'employé'), CommandeController.createCommande);
router.put('/:id', checkAuth, checkRole('admin', 'employé'), CommandeController.updateCommande);
router.delete('/:id', checkAuth, checkRole('admin', 'employé'), CommandeController.deleteCommande);