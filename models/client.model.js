const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données 

// Définition du modèle Client
const Client = db.define('Client', {
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
            is: /^[0-9+\-() ]+$/i,
        },
    },  
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    tableName: 'clients',
    timestamps: true,
});
module.exports = Client;