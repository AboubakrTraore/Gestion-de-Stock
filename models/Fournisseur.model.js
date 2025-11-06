const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données 

// Définition du modèle Fournisseur
const Fournisseur = db.define('Fournisseur', {
    id: {
        type: DataTypes.UUID,    
        primaryKey: true,   
        defaultValue: DataTypes.UUIDV4,
    },  
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },  
    tel:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { 
            is: /^[0-9+\-() ]+$/i, // Validation pour les numéros de téléphone
        }, 
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },  
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    }  
},
{
    tableName: 'fournisseurs',
    timestamps: true,
});
module.exports = Fournisseur;