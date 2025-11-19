const User = require('../models/user.model');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');

const auditInclude = [
    { model: User, as: 'createdByUser', attributes: ['id', 'username'], required: false },
    { model: User, as: 'updatedByUser', attributes: ['id', 'username'], required: false },
];


//
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

const sendSuccessResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({ message, data });
};

const sendErrorResponse = (res, error, defaultMessage) => {
    const needsDetails = ['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(error?.name);
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

const formatUserResponse = (userInstance) => {
    if (!userInstance) return null;
    const data = userInstance.toJSON();

    data.created_by = data.createdByUser
        ? { id: data.createdByUser.id, username: data.createdByUser.username }
        : data.created_by;

    data.updated_by = data.updatedByUser
        ? { id: data.updatedByUser.id, username: data.updatedByUser.username }
        : data.updated_by;

    delete data.createdByUser;
    delete data.updatedByUser;
    delete data.password;

    return data;
};


class UserController {
    
    // Fonction pour lister tous les utilisateurs (GET /api/users)
    static getAllUsers = async (req, res) => {
    
        try {
            const users = await User.findAll({ 
                attributes: { exclude: ['password'] },
                include: auditInclude,
            });
            
            if (users.length === 0) {
                return sendSuccessResponse(res, 200, 'Aucun utilisateur trouvé', []);
            }
            return sendSuccessResponse(res, 200, 'Utilisateurs récupérés avec succès', users.map(formatUserResponse));
           
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération des utilisateurs');
        }
    }

    // Fonction pour récupérer un utilisateur par son id (GET /api/users/:id)
    static getUserById = async (req, res) => {
        const userId = req.params.id;
        try {
        
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] },
                include: auditInclude,
            });

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé', data: null });
            }

            return sendSuccessResponse(res, 200, 'Utilisateur trouvé avec succès', formatUserResponse(user));
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération de l\'utilisateur');
        }
    }

    // Fonction pour ajouter un utilisateur (POST /api/users)
    static createUser = async (req, res) => {
        const { username, email, password, tel, role } = req.body;
        

        let userrole = role;
        
        if (role && role.toLowerCase() === 'admin') {
            userrole = 'admin';
        } else {
            userrole = 'employé';
        }
        //hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                tel,
                role: userrole,
                created_by: req.user.id, 
                updated_by: req.user.id// Utiliser l'ID de l'utilisateur authentifié
            });

            //Supprimer le mot de passe de la réponse
            const UserResponse = user.toJSON();
            delete UserResponse.password;
            return sendSuccessResponse(res, 201, 'Utilisateur créé avec succès', UserResponse);

        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la création de l\'utilisateur');
        }
    }

    //Fonction pour mettre à jour un utilisateur (PUT /api/users/:id)
     static updateUser = async (req, res) => {
        const userId = req.params.id;
        const { username, email, password, tel, role } = req.body;
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            // Mettre à jour les champs si fournis
            if (username) user.username = username;
            if (email) user.email = email;
            if (tel) user.tel = tel;
            if (role) user.role = role;
            if (password) {
                // Hasher le nouveau mot de passe avant de le stocker
                user.password = await bcrypt.hash(password, 10);
            }   
            user.updated_by = req.user.id; // Utiliser l'ID de l'utilisateur authentifié

            await user.save();  
            //Supprimer le mot de passe de la réponse
            const UserResponse = user.toJSON();
            delete UserResponse.password;
            return sendSuccessResponse(res, 200, 'Utilisateur mis à jour avec succès', UserResponse);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la mise à jour de l\'utilisateur');
        }

    }
    //Fonction pour supprimer un utilisateur (DELETE /api/users/:id)
     static deleteUser = async (req, res) => {
        const userId = parseInt(req.params.id, 10);
        const currentUserId = req.user.id;

        //Blocage de l'auto-suppression
        if (userId === currentUserId) {
            return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
        }
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            await user.destroy();
            return sendSuccessResponse(res, 200, 'Utilisateur supprimé avec succès', { id: userId });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la suppression de l\'utilisateur');
        }   
    }
}


module.exports = UserController;


 
