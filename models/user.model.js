// models/user.model.js
const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données
const bcrypt = require('bcrypt');// Importation de bcrypt pour le hachage des mots de passe
const { isValidElement } = require('react');

// Définition du modèle User    
const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,   
        autoIncrement: true,
    },  
    username: {
        type: DataTypes.STRING,
        allowNull: false,  
    },  
    email: {    
        type: DataTypes.STRING,
        allowNull: false,  
        unique: true,   
        validate: {
            isEmail: true,  
        },              
    },  
    tel:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { 
            is: /^[0-9+\-() ]+$/i, // Validation pour les numéros de téléphone
        },  
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    role: {
        type: Enumerator(DataTypes.STRING, ['admin', 'employé']),
        allowNull: false,
        defaultValue: 'employé',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, 
{
    tableName: 'users', // Nom de la table dans la base de données
    timestamps: true,   // Ajout des champs createdAt et updatedAt
});

module.exports = User;


