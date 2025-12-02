const Commande = require('../models/commande.model');
const Details_Commande = require('../models/details_commande.model');
const Produit = require('../models/produit.model');
const db = require('../config/config');
const { sendErrorResponse } = require('../utils/error.utils');
const { sendSuccessResponse } = require('../utils/response.utils');

class CommandeController {
    // Méthode pour créer une nouvelle commande
    static createCommande = async (req, res) => {
        let t;
        try {
            const { client_id, date_commande, statut, details } = req.body;
            const currentUserId = req.user.id;

            t = await db.transaction();

            //Création de la Commande Principale ---
            const newCommande = await Commande.create({
                client_id,
                date_commande,
                statut: statut || 'en_attente', 
                created_by: currentUserId,
        
            }, { transaction: t });

            const commandeId = newCommande.id;

            //Traitement des Détails, Vérification et Mise à Jour du Stock ---
            if (details && Array.isArray(details)) {
                for (const item of details) {
                    const { produit_id, quantite } = item;

                    if (quantite <= 0) {
                        throw new Error(`La quantité pour le produit ID ${produit_id} doit être positive.`);
                    }

                    //Récupérer le produit et vérifier le stock (dans la transaction)
                    const produit = await Produit.findByPk(produit_id, { transaction: t });

                    if (!produit) {
                        throw new Error(`Le produit ID ${produit_id} est introuvable.`);
                    }

                    if (produit.stock < quantite) {
                        // Stock insuffisant, annuler toute l'opération
                        throw new Error(`Stock insuffisant pour le produit ID ${produit_id}. Stock disponible: ${produit.stock}`);
                    }

                    //Mise à jour du stock (Décrémentation)
                    produit.stock -= quantite;
                    await produit.save({ transaction: t });

                    //Création du Détail de Commande
                    await Details_Commande.create({
                        commande_id: commandeId,
                        produit_id: produit_id,
                        quantite: quantite,
                        //Utiliser le prix du produit récupéré, non pas le prix envoyé par le client
                        prix_unitaire: produit.prix_vente, 
                        created_by: currentUserId
                    }, { transaction: t });
                }
            }

            //Validation et Fin de la Transaction ---
            await t.commit(); 
            
            return sendSuccessResponse(res, 201, 'Commande créée avec succès et stock mis à jour.', newCommande);

        } catch (error) {
            //Annulation de la transaction en cas d'erreur
            if (t) await t.rollback(); 
            
            console.error('Erreur lors de la création de la commande :', error.message);
            
            //Renvoyer un 400 pour les erreurs métier (stock/produit) et 500 pour le reste
            const isClientError = error.message.includes('Stock insuffisant') || error.message.includes('introuvable');
            const statusCode = isClientError ? 400 : 500;

            if (isClientError) {
                return res.status(statusCode).json({ 
                    message: 'Échec de la création de la commande.',
                    error: error.message,
                });
            }

            return sendErrorResponse(res, error, 'Erreur lors de la création de la commande');
        }
    }
    // Méthode pour récupérer une commande par ID   
    static getCommandeById = async (req, res) => {
        const commandeId = req.params.id;
        try {
            const commandeData = await Commande.findByPk(commandeId, {  
                include: [
                    {
                        model: Details_Commande,
                        as: 'details_commandes',
                        include: [
                            {
                                model: Produit,
                                as: 'produit'
                            }
                        ]
                    }
                ]
            });
            if (!commandeData) {
                return res.status(404).json({ message: 'Commande non trouvée' });
            }
            return sendSuccessResponse(res, 200, 'Commande récupérée avec succès', commandeData);
        } catch (error) {
            console.error('Erreur lors de la récupération de la commande :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération de la commande');
        }   
    }

    // Méthode pour lister toutes les commandes
    static getAllCommandes = async (req, res) => {
        try {
            const commandes = await Commande.findAll({
                include: [
                    {
                        model: Details_Commande,
                        as: 'details_commandes',
                        include: [
                            {
                                model: Produit,
                                as: 'produit'
                            }
                        ]
                    }
                ]
            });
            return sendSuccessResponse(res, 200, 'Commandes récupérées avec succès', commandes);
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération des commandes');
        }   
    }

    
   // Méthode pour mettre à jour une commande existante
    static updateCommande = async (req, res) => {
        let t;
        try {
            const commandeId = req.params.id;
            const { client_id, date_commande, statut, details } = req.body; // 'details' est le nouveau tableau de lignes
            const currentUserId = req.user.id;

            t = await db.transaction(); // Démarrer la transaction

            //Récupération de la Commande existante ---
            const commandeToUpdate = await Commande.findByPk(commandeId, {
                include: [{
                    model: Details_Commande,
                    as: 'details_commandes',
                }],
                transaction: t // Récupération dans le cadre de la transaction
            });

            if (!commandeToUpdate) {
                await t.rollback();
                return res.status(404).json({ message: 'Commande non trouvée.' });
            }

            // Empêcher la modification si la commande est déjà finalisée (si statut est 'Livrée')
            if (commandeToUpdate.statut === 'Livrée') {
                await t.rollback();
                return res.status(403).json({ message: 'Impossible de modifier une commande déjà livrée ou archivée.' });
            }

            // Mise à Jour des Lignes de Détail et du Stock
            
            //Gérer les lignes existantes et les lignes supprimées
            const existingDetailsMap = new Map();
            commandeToUpdate.details_commandes.forEach(d => {
                existingDetailsMap.set(d.produit_id, d);
            });
            
            const detailsToKeep = new Set();
            let newOrderTotal = 0;

            //Parcourir les nouvelles lignes de détails envoyées par le client
            if (details && Array.isArray(details)) {
                for (const item of details) {
                    const { produit_id, quantite } = item;
                    
                    if (quantite <= 0) {
                         throw new Error(`La quantité pour le produit ID ${produit_id} doit être positive.`);
                    }

                    const existingDetail = existingDetailsMap.get(produit_id);
                    const isNewItem = !existingDetail;
                    const oldQuantite = isNewItem ? 0 : existingDetail.quantite;
                    const quantityChange = quantite - oldQuantite; // Différence à ajuster (+ ou -)
                    
                    detailsToKeep.add(produit_id); // Marquer ce produit comme conservé/mis à jour

                    // Récupérer le produit (dans la transaction)
                    const produit = await Produit.findByPk(produit_id, { transaction: t });
                    if (!produit) {
                        throw new Error(`Le produit ID ${produit_id} est introuvable.`);
                    }

                    // Vérification de stock pour les AJOUTS/AUGMENTATIONS
                    if (quantityChange > 0 && produit.stock < quantityChange) {
                        throw new Error(`Stock insuffisant pour augmenter la quantité du produit ID ${produit_id}. Il manque ${quantityChange} unités.`);
                    }

                    // A. Mise à Jour du Stock : Ajuster par la différence
                    produit.stock -= quantityChange; 
                    await produit.save({ transaction: t });

                    // B. Création ou Mise à Jour de la Ligne de Détail
                    const lineTotal = quantite * produit.prix_vente;
                    newOrderTotal += lineTotal;

                    if (isNewItem) {
                        // Créer une nouvelle ligne
                        await Details_Commande.create({
                            commande_id: commandeId,
                            produit_id: produit_id,
                            quantite: quantite,
                            prix_unitaire: produit.prix_vente,
                            created_by: currentUserId
                        }, { transaction: t });
                    } else {
                        // Mettre à jour la ligne existante
                        await existingDetail.update({
                            quantite: quantite,
                            prix_unitaire: produit.prix_vente,
                            updated_by: currentUserId
                        }, { transaction: t });
                    }
                }
            }

            // Gérer les lignes supprimées (celles qui étaient là et ne sont plus dans le 'details' du req.body)
            for (const [produit_id, detailToDelete] of existingDetailsMap.entries()) {
                if (!detailsToKeep.has(produit_id)) {
                    // Remettre en stock la quantité supprimée
                    const produit = await Produit.findByPk(produit_id, { transaction: t });
                    if (produit) {
                        produit.stock += detailToDelete.quantite; // Remettre l'ancienne quantité totale
                        await produit.save({ transaction: t });
                    }
                    
                    // Supprimer la ligne de détail de la DB
                    await detailToDelete.destroy({ transaction: t });
                }
            }

            // Mise à Jour de la Commande Principale ---
            await commandeToUpdate.update({
                client_id: client_id || commandeToUpdate.client_id,
                date_commande: date_commande || commandeToUpdate.date_commande,
                statut: statut || commandeToUpdate.statut,
                montant_total: newOrderTotal, // Mettre à jour le total calculé
                updated_by: currentUserId
            }, { transaction: t });

            // Validation ---
            await t.commit(); 

            return sendSuccessResponse(res, 200, 'Commande mise à jour avec succès et stock ajusté.', commandeToUpdate);

        } catch (error) {
            if (t) await t.rollback(); 
            
            console.error('Erreur lors de la mise à jour de la commande :', error.message);
            
            const isClientError = error.message.includes('Stock insuffisant') || error.message.includes('introuvable');
            const statusCode = isClientError ? 400 : 500;

            if (isClientError) {
                return res.status(statusCode).json({ 
                    message: 'Échec de la mise à jour de la commande.', 
                    error: error.message 
                });
            }

            return sendErrorResponse(res, error, 'Erreur lors de la mise à jour de la commande');
        }
    }


    // Méthode pour supprimer une commande 
    static deleteCommande = async (req, res) => {
        const commandeId = req.params.id;
        try {
            const commandeData = await Commande.findByPk(commandeId);
            if (!commandeData) {
                return res.status(404).json({ message: 'Commande non trouvée' });
            }
            await commandeData.destroy();
            return sendSuccessResponse(res, 200, 'Commande supprimée avec succès', { id: commandeId });
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la commande :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la suppression de la commande');
        }
}   
}

module.exports = CommandeController;