const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données

// Définition du modèle Détails_Commande
const Details_Commande = db.define('Details_Commande', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    commande_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'commandes',
            key: 'id',
        },
    },
    produit_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
            model: 'produits',
            key: 'id',
        },
    },
    quantite:{
        type:DataTypes.INTEGER,
        allowNull:false, 
    },
    prix_unitaire_capture:{
        type:DataTypes.DECIMAL,
        allowNull:false,
    },
    total:{
        type:DataTypes.DECIMAL,
        allowNull:false,
    }
},
{
    tableName: 'details_commandes',
    timestamps: true,
});
module.exports = Details_Commande;

