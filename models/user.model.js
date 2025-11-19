// models/user.model.js
const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données
const bcrypt = require('bcrypt');// Importation de bcrypt pour le hachage des mots de passe

// Définition du modèle User    
const User = db.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,   
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.ENUM('admin', 'employé'),
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
        type: DataTypes.UUID,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
    }
}, 
{
    tableName: 'users', // Nom de la table dans la base de données
    timestamps: true,   // Ajout des champs createdAt et updatedAt
    //Ajout des index pour optimiser les recherches
    indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['tel'] },
    ],
});

module.exports = User;


