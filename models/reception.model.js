const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données

// Définition du modèlereceptions

const Reception= db.define('Reception',{
       id:{
        type:DataTypes.INTEGER,
        alowNul:false,
       },
       fournisseur_id:{
        type:DataTypes.INTEGER,
        alowNul:false,
        references:{
            model:'fournisseurs',
            key:'id'
            },
       },
       user_id:{
        type:DataTypes.INTEGER,
        alowNul:false,
        references:{
            model:'users',
            key:'id'
        },
       },
       date_reception:{
        type:DataTypes.DATE,
        alowNul:false,
       },
       statut:{
        type:DataTypes.ENUM('en_attente', 'en_cours', 'livrée', 'annulée'),
        alowNul:false,
        defaultValue:'en_attente',
       },
       reference_facture:{
        type:DataTypes.STRING,
        alowNul:false,
       }
},
{
    tableName: 'receptions',
    timestamps: true,
});
module.exports = Reception;