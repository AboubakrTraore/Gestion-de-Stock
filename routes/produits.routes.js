const express = require('express');
const router = express.Router();
const ProduitController = require('../controllers/produits.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');


// Routes pour les produits
router.get('/', ProduitController.getAllProduits);// Liste tous les produits
router.get('/search', ProduitController.searchProduits);// Recherche des produits par nom ou description
router.get('/filter', ProduitController.filterProduitsByCategorie);//Filtrer un produit par catégorie
router.get('/:id', ProduitController.getProduitById);//Récupérer un produit par Id
//Récupérer les détails d'un produit par Id
router.get('/details/:id', ProduitController.getProduitDetails);

// Routes protégées - nécessite authentification et rôle admin  
router.post('/', checkAuth, checkRole('admin'), ProduitController.createProduit);
router.put('/:id', checkAuth, checkRole('admin'), ProduitController.updateProduit);
router.delete('/:id', checkAuth, checkRole('admin'), ProduitController.deleteProduit);

module.exports = router;
