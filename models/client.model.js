const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données 

// Définition du modèle Client
const Client = db.define('Client', {
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
            is: /^[0-9+\-() ]+$/i,
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
        allowNull: true,
    }
},
{
    tableName: 'clients',
    timestamps: true,
});
module.exports = Client;