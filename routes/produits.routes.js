const express = require('express');
const router = express.Router();
const ProduitController = require('../controllers/produits.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');

// Routes pour les produits
router.get('/', ProduitController.getAllProduits);
router.get('/search', ProduitController.searchProduits);
router.get('/filter', ProduitController.filterProduitsByCategorie);
router.get('/:id', ProduitController.getProduitById);
router.post('/', checkAuth, checkRole('admin'), ProduitController.createProduit);
router.put('/:id', checkAuth, checkRole('admin'), ProduitController.updateProduit);
router.delete('/:id', checkAuth, checkRole('admin'), ProduitController.deleteProduit);