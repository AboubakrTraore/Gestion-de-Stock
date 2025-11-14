const express = require('express');
const User = require('../models/user.model');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');


class UserController {
    
    // Fonction pour lister tous les utilisateurs (GET /api/users)
    static getAllUsers = async (req, res) => {
    
        try {
            const users = await User.findAll({ 
                // Exclure le mot de passe dans la réponse
                attributes: { exclude: ['password'] } 
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
                role: userrole,
                created_by: req.user.id, 
                updated_by: req.user.id// Utiliser l'ID de l'utilisateur authentifié
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
            console.log('L\'Utilisateur a été mis à jour avec succès')
            return res.status(200).json(UserResponse);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            res.status(500).json({ error: error.message });
        }

    }
    //Fonction pour supprimer un utilisateur (DELETE /api/users/:id)
     static deleteUser = async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            await user.destroy();
            console.log('L\'Utilisateur a été supprimé avec succès')
            return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            res.status(500).json({ error: error.message });
        }   
    }
}


module.exports = UserController;


 
