const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données

// Définition du modèle Detail_Reception
const Detail_Reception = db.define('Detail_Reception', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reception_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'receptions',
            key:'id'
        },
    },
    produit_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'produits',
            key:'id'
        },
    },
    quantite_reçue:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    prix_achat_capture:{
        type: DataTypes.DECIMAL,
        allowNull: false,
    }
},
{
    tableName: 'detail_receptions',
    timestamps: true,
});
module.exports = Detail_Reception;
