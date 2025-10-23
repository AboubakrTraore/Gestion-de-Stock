const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données 

// Définition du modèle Fournisseur
const Fournisseur = db.define('Fournisseur', {
    id: {
        type: DataTypes.INTEGER,    
        primaryKey: true,   
        autoIncrement: true,    
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
    adress: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    tableName: 'clients',
    timestamps: true,
});
module.exports= Client;