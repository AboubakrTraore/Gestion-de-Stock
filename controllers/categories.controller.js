const Categorie = require('../models/categorie.model');
const { Op } = require('sequelize');


class CategorieController {
    // Fonction pour lister toutes les catégories (GET /api/categories)
    static getAllCategories = async (req, res) => {
        try {
            const categories = await Categorie.findAll();
            if (categories.length === 0) {
                return res.status(404).json({ message: 'Aucune catégorie trouvée' });
            }
            return res.status(200).json(categories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
            res.status(500).json({ error: error.message });
        }
    }
    // Fonction pour récupérer une catégorie par son id (GET /api/categories/:id)
    static getCategoryById = async (req, res) => {
        const categoryId = req.params.id;
        try {
            const category = await Categorie.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
            return res.status(200).json(category);
        }
        
        catch (error) {
            console.error('Erreur lors de la récupération de la catégorie :', error);
            res.status(500).json({ error: error.message });
        }
    }
    // Fonction pour créer une nouvelle catégorie (POST /api/categories)
    static createCategory = async (req, res) => {
        const { name, description } = req.body;
        try {
            const category = await Categorie.create({ name, description, created_by: req.user.id });
            return res.status(201).json(category);
        } catch (error) {
            console.error('Erreur lors de la création de la catégorie :', error);
            res.status(500).json({ error: error.message });
        }
    }
    
    // Fonction pour mettre à jour une catégorie (PUT /api/categories/:id)
    static updateCategory = async (req, res) => {
        const categoryId = req.params.id;
        const { name, description } = req.body;
        try {
            const category = await Categorie.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
            await category.update({ name, description });
            return res.status(200).json(category);
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie :', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Fonction pour supprimer une catégorie (DELETE /api/categories/:id)
    static deleteCategory = async (req, res) => {
        const categoryId = req.params.id;
        try {
            const category = await Categorie.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
            await category.destroy();
            return res.status(200).json({ message: 'Catégorie supprimée avec succès' });
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la catégorie :', error);
            res.status(500).json({ error: error.message });
        }
    }
    
}

module.exports = CategorieController;