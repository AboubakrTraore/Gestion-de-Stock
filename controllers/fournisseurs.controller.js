const express = require('express');
const Fournisseur = require('../models/fournisseur.model');
const { sendErrorResponse } = require('../utils/error.utils');
const { sendSuccessResponse } = require('../utils/response.utils');

class FournisseurController {
 
    // Fonction pour lister tous les fournisseurs (GET /api/fournisseurs)
    static getAllFournisseurs = async (req, res) => {
        try {
            const fournisseurs = await Fournisseur.findAll();
            if (fournisseurs.length === 0) {
                return res.status(404).json({ message: 'Aucun fournisseur trouvé' });
            }
            return sendSuccessResponse(res, 200, 'Fournisseurs récupérés avec succès', fournisseurs);
        } catch (error) {
            console.error('Erreur lors de la récupération des fournisseurs :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération des fournisseurs');
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
            return sendSuccessResponse(res, 200, 'Fournisseur récupéré avec succès', fournisseur);
        } catch (error) {
            console.error('Erreur lors de la récupération du fournisseur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération du fournisseur');
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
            return sendSuccessResponse(res, 201, 'Fournisseur créé avec succès', fournisseur);
        } catch (error) {
            console.error('Erreur lors de la création du fournisseur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la création du fournisseur');
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
            return sendSuccessResponse(res, 200, 'Fournisseur mis à jour avec succès', fournisseur);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du fournisseur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la mise à jour du fournisseur');
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
            return sendSuccessResponse(res, 200, 'Fournisseur supprimé avec succès', { id: fournisseurId });
        } catch (error) {
            console.error('Erreur lors de la suppression du fournisseur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la suppression du fournisseur');
        }
    }
    
}

module.exports = FournisseurController;
