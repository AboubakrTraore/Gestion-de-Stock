const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clients.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');

// Routes pour les clients
router.get('/', checkAuth, checkRole(['Admin', 'employé']), ClientController.getAllClients);
router.get('/:id', checkAuth, checkRole(['Admin', 'employé']), ClientController.getClientById);
router.post('/',checkAuth, checkRole(['Admin', 'employé']), ClientController.createClient);
router.put('/:id', ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);

module.exports = router;
