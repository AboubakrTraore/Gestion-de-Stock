const express = require('express');
const router = express.Router();
const CategorieController = require('../controllers/categories.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');

// Routes pour les catégories
router.get('/', checkAuth, checkRole('admin', 'employé'),CategorieController.getAllCategories);
router.get('/:id', CategorieController.getCategoryById);
router.post('/', checkAuth, checkRole('admin', 'employé'),CategorieController.createCategory);
router.put('/:id', checkAuth, checkRole('admin', 'employé'),CategorieController.updateCategory);
router.delete('/:id', checkAuth, checkRole('admin', 'employé'), CategorieController.deleteCategory);

module.exports = router;