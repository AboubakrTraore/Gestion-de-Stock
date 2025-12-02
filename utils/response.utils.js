// Utilitaires pour la gestion des réponses HTTP

// Envoie une réponse de succès formatée
const sendSuccessResponse = (res, statusCode, message, data = null) => {
    const response = { message };
    
    if (data !== null) {
        response.data = data;
    }
    
    return res.status(statusCode).json(response);
};

// Configuration des inclusions pour les informations de traçabilité
// On importe directement le modèle User, car il n'y a pas de fichier `models/index.js`
const UserModel = require('../models/user.model');

const auditInclude = [
    { 
        model: UserModel,
        as: 'createdByUser', 
        attributes: ['id', 'username'], 
        required: false 
    },
    { 
        model: UserModel,
        as: 'updatedByUser', 
        attributes: ['id', 'username'], 
        required: false 
    },
];

// Formate une instance Sequelize avec les infos de traçabilité
const formatUserResponse = (userInstance) => {
    if (!userInstance) return null;
    
    const data = userInstance.toJSON();

    // Formater created_by
    data.created_by = data.createdByUser
        ? { id: data.createdByUser.id, username: data.createdByUser.username }
        : data.created_by;

    // Formater updated_by
    data.updated_by = data.updatedByUser
        ? { id: data.updatedByUser.id, username: data.updatedByUser.username }
        : data.updated_by;

    // Supprimer les champs temporaires et sensibles
    delete data.createdByUser;
    delete data.updatedByUser;
    delete data.password;

    return data;
};

// Formate plusieurs instances Sequelize avec les infos de traçabilité
const formatMultipleResponses = (instances) => {
    if (!Array.isArray(instances)) return [];
    
    return instances.map(instance => {
        const data = instance.toJSON();

        // Formater created_by
        data.created_by = data.createdByUser
            ? { id: data.createdByUser.id, username: data.createdByUser.username }
            : data.created_by;

        // Formater updated_by
        data.updated_by = data.updatedByUser
            ? { id: data.updatedByUser.id, username: data.updatedByUser.username }
            : data.updated_by;

        // Supprimer les champs temporaires
        delete data.createdByUser;
        delete data.updatedByUser;
        if (data.password) delete data.password;

        return data;
    });
};

module.exports = {
    sendSuccessResponse,
    auditInclude,
    formatUserResponse,
    formatMultipleResponses
};