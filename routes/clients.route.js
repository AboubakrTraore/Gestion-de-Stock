const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clients.controller');
const checkAuth = require('../middleware/check-auth');
const checkRole = require('../middleware/check-role');

// Routes pour les clients
router.get('/', ClientController.getAllClients);
router.get('/:id', ClientController.getClientById);
router.post('/', ClientController.createClient);
router.put('/:id', ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);

module.exports = router;
