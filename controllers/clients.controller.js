const Client = require('../models/client.model');
const { Op } = require('sequelize');

class ClientController {
    // Fonction pour lister tous les clients (GET /api/clients)
    static getAllClients = async (req, res) => {
        try {
            const clients = await Client.findAll();
            if (clients.length === 0) {
                return res.status(404).json({ message: 'Aucun client trouvé' });
            }
            return res.status(200).json(clients);
        } catch (error) {
            console.error('Erreur lors de la récupération des clients :', error);
            res.status(500).json({ error: error.message });
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
            return res.status(200).json(client);
        } catch (error) {
            console.error('Erreur lors de la récupération du client :', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Fonction pour créer un nouveau client (POST /api/clients)
    static createClient = async (req, res) => {
        const { name, email, tel, adresse } = req.body;
        try {
            const client = await Client.create({ name,email, tel, adresse });
            return res.status(201).json(client);
        } catch (error) {
            console.error('Erreur lors de la création du client :', error);
            res.status(500).json({ error: error.message });
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
            return res.status(200).json(client);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du client :', error);
            res.status(500).json({ error: error.message });
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
            return res.status(200).json({ message: 'Client supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du client :', error);
            res.status(500).json({ error: error.message });
        }
    }
    
}

module.exports = ClientController;
