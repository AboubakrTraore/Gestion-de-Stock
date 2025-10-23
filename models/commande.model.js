const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données 

// Définition du modèle Fournisseur
const Commande = db.define('Commande', {
    id: {
        type: DataTypes.INTEGER,    
        primaryKey: true,   
        autoIncrement: true,
    },
    client_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'clients',
            id: 'id',
        },
    },
    user_id:{    
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'users',
            key: 'id'
        },
    },
    date_commande:{
       type: DataTypes.DATE,
       allowNull:false,  
    },
    montant_total:{
        type: DataTypes.DECIMAL,
        allowNull:false,
    },
    statut:{
        type: DataTypes.ENUM('en_attente', 'en_cours', 'livrée', 'annulée'),
        allowNull:false,
        defaultValue:'en_attente',  
    }
},
{
 tableName: 'commandes',
 timestamps: true,
});
module.exports = Commande;
