const Client = require('../models/client.model');
const { Op } = require('sequelize');
const { sendErrorResponse } = require('../utils/error.utils');
const { sendSuccessResponse } = require('../utils/response.utils');

class ClientController {
    // Fonction pour lister tous les clients (GET /api/clients)
    static getAllClients = async (req, res) => {
        try {
            const clients = await Client.findAll();
            if (clients.length === 0) {
                return res.status(404).json({ message: 'Aucun client trouvé' });
            }
             return sendSuccessResponse(res, 200, 'Clients récupérés avec succès', clients.map(formatClientResponse));
        } catch (error) {
            console.error('Erreur lors de la récupération des clients :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération des clients');
        }
    }

    // Fonction pour récupérer un client par son id (GET /api/clients/:id)
    static getClientById = async (req, res) => {
        const clientId = req.params.id;
        try {
            const client = await Client.findByPk(clientId);
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }
            return sendSuccessResponse(res, 200, 'Client récupéré avec succès', formatClientResponse(client));
        } catch (error) {
            console.error('Erreur lors de la récupération du client :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération du client');
        }
    }

    // Fonction pour créer un nouveau client (POST /api/clients)
    static createClient = async (req, res) => {
        const { name, email, tel, adresse } = req.body;
        try {

            //Vérification des champs obligatoire
            if (!name || !email || !tel || !adresse) {  
                return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
            }
            
            const client = await Client.create({ 
                name: name,
                email: email, 
                tel: tel, 
                address: adresse, 
                created_by: req.user.id })
            return sendSuccessResponse(res, 201, 'Client créé avec succès', formatClientResponse(client));
            
        } catch (error) {
            console.error('Erreur lors de la création du client :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la création du client');
        }
    }

    // Fonction pour mettre à jour un client (PUT /api/clients/:id)
    static updateClient = async (req, res) => {
        const clientId = req.params.id;
        const { name, email, tel, adresse } = req.body;
        try {
            const client = await Client.findByPk(clientId);
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }
            await client.update({ name, email, tel, adresse });
            return sendSuccessResponse(res, 200, 'Client mis à jour avec succès', formatClientResponse(client));
        } catch (error) {
            console.error('Erreur lors de la mise à jour du client :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la mise à jour du client');
        }
    }

    // Fonction pour supprimer un client (DELETE /api/clients/:id)
    static deleteClient = async (req, res) => {
        const clientId = req.params.id;
        try {
            const client = await Client.findByPk(clientId);
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }
            await client.destroy();
            return sendSuccessResponse(res, 200, 'Client supprimé avec succès', { id: clientId });
        } catch (error) {
            console.error('Erreur lors de la suppression du client :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la suppression du client');
        }
    }
    
}


module.exports = ClientController;
