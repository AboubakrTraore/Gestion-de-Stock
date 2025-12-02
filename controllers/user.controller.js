const User = require('../models/user.model');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const { sendErrorResponse, sendClientErrorResponse } = require('../utils/error.utils');
const { sendSuccessResponse, auditInclude, formatUserResponse, formatMultipleResponses } = require('../utils/response.utils');


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
        try {
            const userId = req.params.id;
        
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] },
                include: auditInclude,
            });

            if (!user) {
                return sendClientErrorResponse(res, 404, 'Utilisateur non trouvé');
            }

            return sendSuccessResponse(res, 200, 'Utilisateur trouvé avec succès', formatUserResponse(user));
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la récupération de l\'utilisateur');
        }
    }

    // Fonction pour ajouter un utilisateur (POST /api/users)
    static createUser = async (req, res) => {
         try {
        const { username, email, password, tel, role } = req.body;
        

        //Vérification du rôle
        let userRole = role;
        
        if (role && role.toLowerCase() === 'admin') {
            userRole = 'admin';
        } else {
            userRole = 'employé';
        }

        //Vérification des champs obligatoires
        if (!username || !email || !password || !tel) {
            return sendClientErrorResponse(res, 400, 'Champs obligatoires manquants : username, email, password, tel');
        }
        //  Vérification de l'email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return sendClientErrorResponse(res, 400, 'L\'email est déjà utilisé');
        }

        //Vérification du téléphone
        const existingTel = await User.findOne({ where: { tel } });
        if (existingTel) {
            return sendClientErrorResponse(res, 400, 'Le numéro de téléphone est déjà utilisé');
        }   

        
        //hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

  
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                tel,
                role: userRole,
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

         try {
        const userId = req.params.id;
        const { username, email, password, tel, role } = req.body;
            const user = await User.findByPk(userId);
            if (!user) {
                return sendClientErrorResponse(res, 404, 'Utilisateur non trouvé');
            }

            //Vérification du rôle
            let userrole = user.role; // Rôle actuel par défaut
            if (role) {
                if (role.toLowerCase() === 'admin') {
                    userrole = 'admin';
                } else {
                    userrole = 'employé';
                }
            }   

            //Vérification de l'email s'il est modifié
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: userId } } });
                if (existingUser) {
                    return sendClientErrorResponse(res, 400, 'L\'email est déjà utilisé');
                }
            }
            //Vérification du téléphone s'il est modifié
            if (tel && tel !== user.tel) {
                const existingTel = await User.findOne({ where: { tel, id: { [Op.ne]: userId } } });
                if (existingTel) {
                    return sendClientErrorResponse(res, 400, 'Le numéro de téléphone est déjà utilisé');
                }
            }

            //Blocage de la modification du propre rôle
            if (parseInt(userId, 10) === req.user.id && role && role.toLowerCase() !== user.role) {
                return sendClientErrorResponse(res, 400, 'Vous ne pouvez pas modifier votre propre rôle');
            }

            // 2. Restriction : Blocage de la rétrogradation du dernier Admin
           // On vérifie seulement si un changement de rôle est demandé ET que l'utilisateur cible est un admin
            if (role && user.role === 'admin' && role.toLowerCase() !== 'admin') {
                const adminCount = await User.count({ where: { role: 'admin' } });
                if (adminCount <= 1) {
                    return sendClientErrorResponse(res, 400, 'Impossible de rétrograder le dernier administrateur.');
                }
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
            // Utilisateur mis à jour avec succès
            return sendSuccessResponse(res, 200, 'Utilisateur mis à jour avec succès', UserResponse);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            return sendErrorResponse(res, error, 'Erreur lors de la mise à jour de l\'utilisateur');
        }

    }
    //Fonction pour supprimer un utilisateur (DELETE /api/users/:id)
     static deleteUser = async (req, res) => {
         try {
        const userId = req.params.id;
        const currentUserId = req.user.id;

        //Blocage de l'auto-suppression
        if (userId === currentUserId) {
            return sendClientErrorResponse(res, 400, 'Vous ne pouvez pas supprimer votre propre compte');
        }
            const user = await User.findByPk(userId);
            if (!user) {
                return sendClientErrorResponse(res, 404, 'Utilisateur non trouvé');
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


 
