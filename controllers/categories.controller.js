const Categorie = require('../models/categorie.model');
const { Op } = require('sequelize');


// Formatage de la réponse client
const formatCategorieResponse = (categorieInstance) => {
    if (!categorieInstance) return null;
    const data = categorieInstance.toJSON();
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        created_by: data.created_by,
    };
}

// Fonction pour envoyer une réponse standardisée
const sendSuccessResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        message,
        data
    });
}


class CategorieController {
    // Fonction pour lister toutes les catégories (GET /api/categories)
    static getAllCategories = async (req, res) => {
        try {
            const categories = await Categorie.findAll();
            if (categories.length === 0) {
                return res.status(404).json({ message: 'Aucune catégorie trouvée' });
            }
            return sendSuccessResponse(res, 200, 'Catégories récupérées avec succès', categories.map(formatCategorieResponse));
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
            return sendSuccessResponse(res, 200, 'Catégorie récupérée avec succès', formatCategorieResponse(category));
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
            const exist = await Categorie.findOne({ where: { name: { [Op.iLike]: name } } });

            if(exist){
                return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà.' });
            }

            //Vérification des champs obligatoire
            if (!name || !description) {  
                return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
            }

            // Création de la catégorie
            const category = await Categorie.create({ 
                name: name,
                description: description,
                created_by: req.user.id });
            return sendSuccessResponse(res, 201, 'Catégorie créée avec succès', formatCategorieResponse(category));
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
            return sendSuccessResponse(res, 200, 'Catégorie mise à jour avec succès', formatCategorieResponse(category));
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
            return sendSuccessResponse(res, 200, 'Catégorie supprimée avec succès', null);
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la catégorie :', error);
            res.status(500).json({ error: error.message });
        }
    }
    
}

module.exports = CategorieController;