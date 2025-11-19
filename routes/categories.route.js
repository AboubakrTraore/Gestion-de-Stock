const express = require('express');
const router = express.Router();
const CategorieController = require('../controllers/categories.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');

// Routes pour les catégories
router.get('/', CategorieController.getAllCategories);
router.get('/:id', CategorieController.getCategoryById);
router.post('/', CategorieController.createCategory);
router.put('/:id', CategorieController.updateCategory);
router.delete('/:id', CategorieController.deleteCategory);

module.exports = router;