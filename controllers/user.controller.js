const express = require('express');
const User = require('../models/user.model');
const Op = require('sequelize').Op;


class UserController {
    
    // Fonction pour lister tous les utilisateurs (GET /api/users)
    static getAllUsers = async (req, res) => {
    
        try {
            const users = await User.findAll({ 
                // Exclure le mot de passe dans la réponse
                attributes: { exclude: ['passsword'] } 
            });
            
            if (users.length === 0) {
                return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
            }
            return res.status(200).json(users);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Fonction pour récupérer un utilisateur par son id (GET /api/users/:id)
    static getUserById = async (req, res) => {
        const userId = req.params.id;
        try {
        
            const user = await User.findByPk(userId, {
                // Exclure le mot de passe
                attributes: { exclude: ['password'] } 
            }); 
            
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            res.status(500).json({ error: error.message });
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
                role: userrole
            });

            //Supprimer le mot de passe de la réponse
            const UserResponse = user.toJSON();
            delete UserResponse.password;
            console.log('L\'Utilisateur a été créé avec succès')
            return res.status(201).json(UserResponse);

        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
            res.status(500).json({ error: error.message });
        }
    }
}


module.exports = UserController;


 
