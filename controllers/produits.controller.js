const Produit = require('../models/produit.model');
const { Op } = require('sequelize');

class ProduitController {
    // Fonction pour lister tous les produits (GET /api/produits)
    static getAllProduits = async (req, res) => {
        try {
            const produits = await Produit.findAll();
            if (produits.length === 0) {
                return res.status(404).json({ message: 'Aucun produit trouvé' });
            }
            return res.status(200).json(produits);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits :', error);
            res.status(500).json({ error: error.message });
        }
    }
    
    //Recherche de produits par nom ou description (GET /api/produits/search?query=...)
    static searchProduits = async (req, res) => {
        const query = req.query.query;
        try {
            const produits = await Produit.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${query}%` } },
                        { description: { [Op.iLike]: `%${query}%` } }
                    ]
                }
            });
            if (produits.length === 0) {
                return res.status(404).json({ message: 'Aucun produit trouvé pour la recherche donnée' });
            }
            return res.status(200).json(produits);
        } catch (error) {
            res.json({ message: 'Erreur lors de la recherche des produits', error: error.message });
            res.status(500).json({ error: error.message });
        }
    }
    
    //Filtre des produits par catégorie (GET /api/produits/filter?categorie_id=...)
    static filterProduitsByCategorie = async (req, res) => {
        const categorieId = req.query.categorie_id;
        try {
            const produits = await Produit.findAll({
                where: { categorie_id: categorieId }
            }); 
            if (produits.length === 0) {
                return res.status(404).json({ message: 'Aucun produit trouvé pour cette catégorie' });
            }
            return res.status(200).json(produits);
        } catch (error) {
            res.json({ message: 'Erreur lors du filtrage des produits par catégorie', error: error.message });
            res.status(500).json({ error: error.message });
        }
    }

    // Fonction pour récupérer un produit par son id (GET /api/produits/:id)
    static getProduitById = async (req, res) => {
        const produitId = req.params.id;
        try {
            const produit = await Produit.findByPk(produitId);
            if (!produit) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            return res.status(200).json(produit);
        }
        catch (error) {
            console.error('Erreur lors de la récupération du produit :', error);
            res.status(500).json({ error: error.message });
        }
    }
    // Fonction pour créer un nouveau produit (POST /api/produits)
    static createProduit = async (req, res) => {
        const { name, description, Prix_vente, quantite_stock, categorie_id } = req.body;
        try {
            //Vérification si le produit existe déjà
            const exist = await Produit.findOne({ where: { name: { [Op.iLike]: name } } });
            if(exist){
                return res.status(400).json({ message: 'Un produit avec ce nom existe déjà.' });
            }

            //Vérification des champs obligatoires
            if(!name || !Prix_vente || !quantite_stock || !categorie_id){
                return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
            }
            

            const produit = await Produit.create({ name, description, Prix_vente, quantite_stock, categorie_id, created_by: req.user.id });
            return res.status(201).json(produit);
        }
        catch (error) {
            console.error('Erreur lors de la création du produit :', error);
            res.status(500).json({ error: error.message });
        }
    }
    // Fonction pour mettre à jour un produit (PUT /api/produits/:id)
    static updateProduit = async (req, res) => {
        const produitId = req.params.id;
        const { name, description, Prix_vente, quantite_stock, categorie_id } = req.body;
        try {
            const produit = await Produit.findByPk(produitId);
            if (!produit) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            await produit.update({ name, description, Prix_vente, quantite_stock, categorie_id, updated_by: req.user.id });
            return res.status(200).json(produit);
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du produit :', error);
            res.status(500).json({ error: error.message });
        }
    
    }
    // Fonction pour supprimer un produit (DELETE /api/produits/:id)
    static deleteProduit = async (req, res) => {
        const produitId = req.params.id;
        try {
            const produit = await Produit.findByPk(produitId);
            if (!produit) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            await produit.destroy();
            return res.status(200).json({ message: 'Produit supprimé avec succès' });
        }
        catch (error) {
            console.error('Erreur lors de la suppression du produit :', error);
            res.status(500).json({ error: error.message });
        }
    }

    //Afficher les détails d'un produit (GET /api/produits/:id/details)
    static getProduitDetails = async (req, res) => {
        const produitId = req.params.id;
        try {
            const produit = await Produit.findByPk(produitId, {
                include: ['categorie', 'createdByUser', 'updatedByUser']
            });
            if (!produit) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            return res.status(200).json(produit);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des détails du produit :', error);
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = ProduitController;