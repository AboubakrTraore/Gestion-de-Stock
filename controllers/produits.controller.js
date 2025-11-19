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
}
module.exports = ProduitController;