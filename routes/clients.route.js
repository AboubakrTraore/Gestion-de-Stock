const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clients.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');

// Routes pour les clients
router.get('/', ClientController.getAllClients);
router.get('/:id', ClientController.getClientById);
router.post('/', ClientController.createClient);
router.put('/:id', ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);

module.exports = router;
