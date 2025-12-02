
//Utilitaires pour la gestion des erreurs
 
// Formate les erreurs Sequelize pour une réponse plus lisible
const formatSequelizeErrors = (error) => {
    if (error?.errors?.length) {
        return error.errors.map(({ path, message, validatorKey }) => ({
            field: path,
            message,
            code: validatorKey,
        }));
    }
    return [{ message: error?.message || 'Erreur inconnue' }];
};

// Envoie une réponse d'erreur serveur / Sequelize standardisée
const sendErrorResponse = (res, error, defaultMessage) => {
    const needsDetails = [
        'SequelizeValidationError',
        'SequelizeUniqueConstraintError',
        'SequelizeDatabaseError',
        'SequelizeForeignKeyConstraintError'
    ].includes(error?.name);

    const statusCode = needsDetails ? 400 : 500;
    const payload = {
        message: defaultMessage,
    };

    if (needsDetails) {
        payload.details = formatSequelizeErrors(error);
    } else {
        payload.error = error?.message;
    }

    return res.status(statusCode).json(payload);
};

// Envoie une réponse d'erreur côté client (4xx) avec un format homogène
const sendClientErrorResponse = (res, statusCode, message, details = null) => {
    const payload = { message };

    if (details) {
        payload.details = details;
    }

    return res.status(statusCode).json(payload);
};

module.exports = {
    formatSequelizeErrors,
    sendErrorResponse,
    sendClientErrorResponse,
};