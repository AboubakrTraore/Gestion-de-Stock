const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données

// Définition du modèle Mouvement_Stock
const Mouvement_Stock = db.define('Mouvement_Stock', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    produit_id:{
        type: DataTypes.UUID,
        allowNull: false,   
        references:{
            model:'produits',
            key:'id'
        },
    },
    type_mouvement:{
        type: DataTypes.ENUM('entrée', 'sortie', 'ajustement'),
        allowNull: false,
    },
    quantite:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model:'users',
            key:'id'
        },
    },
   detail_commande_id:{
    type: DataTypes.UUID,
    allowNull: true,
    references:{
        model:'details_commandes',
        key:'id'
    },
   },
   detail_reception_id:{
    type: DataTypes.UUID,
    allowNull: true,
    references:{
        model:'detail_receptions',
        key:'id'
    },
   },
},
{
    tableName: 'mouvements_stocks',
    timestamps: true,
});
module.exports = Mouvement_Stock;