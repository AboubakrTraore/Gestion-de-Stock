const express = require('express');
const Fournisseur = require('../models/fournisseur.model');

class FournisseurController {
 
    // Fonction pour lister tous les fournisseurs (GET /api/fournisseurs)
    static getAllFournisseurs = async (req, res) => {
        try {
            const fournisseurs = await Fournisseur.findAll();
            if (fournisseurs.length === 0) {
                return res.status(404).json({ message: 'Aucun fournisseur trouvé' });
            }
            return res.status(200).json(fournisseurs);
        } catch (error) {
            console.error('Erreur lors de la récupération des fournisseurs :', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Fonction pour récupérer un fournisseur par son id (GET /api/fournisseurs/:id)
    static getFournisseurById = async (req, res) => {
        const fournisseurId = req.params.id;
        try {
            const fournisseur = await Fournisseur.findByPk(fournisseurId);
            if (!fournisseur) {
                return res.status(404).json({ message: 'Fournisseur non trouvé' });
            }
            return res.status(200).json(fournisseur);
        } catch (error) {
            console.error('Erreur lors de la récupération du fournisseur :', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Fonction pour ajouter un fournisseur (POST /api/fournisseurs)
    static createFournisseur = async (req, res) => {
        const { name, email, tel, address } = req.body;
        try {

            //Vérification des champs obligatoire
            if (!name || !email || !tel || !address) {  
                return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
            }

            // Création du fournisseur
            const fournisseur = await Fournisseur.create({
                name,
                email,
                tel,
                address
            });
            return res.status(201).json(fournisseur);
        } catch (error) {
            console.error('Erreur lors de la création du fournisseur :', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Fonction pour mettre à jour un fournisseur (PUT /api/fournisseurs/:id)
    static updateFournisseur = async (req, res) => {
        const fournisseurId = req.params.id;
        const { name, email, tel, address } = req.body;
        try {
            const fournisseur = await Fournisseur.findByPk(fournisseurId);
            if (!fournisseur) {
                return res.status(404).json({ message: 'Fournisseur non trouvé' });
            }
            fournisseur.name = name;
            fournisseur.email = email;
            fournisseur.tel = tel;
            fournisseur.address = address;
            await fournisseur.save();
            return res.status(200).json(fournisseur);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du fournisseur :', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Fonction pour supprimer un fournisseur (DELETE /api/fournisseurs/:id)
    static deleteFournisseur = async (req, res) => {
        const fournisseurId = req.params.id;
        try {
            const fournisseur = await Fournisseur.findByPk(fournisseurId);
            if (!fournisseur) {
                return res.status(404).json({ message: 'Fournisseur non trouvé' });
            }
            await fournisseur.destroy();
            return res.status(200).json({ message: 'Fournisseur supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du fournisseur :', error);
            res.status(500).json({ error: error.message });
        }
    }
    
}

module.exports = FournisseurController;
