const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données

// Définition du modèlereceptions

const Reception= db.define('Reception',{
       id:{
        type:DataTypes.UUID,
        allowNull:false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
       },
       fournisseur_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'fournisseurs',
            key:'id'
            },
       },
       user_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'users',
            key:'id'
        },
       },
       date_reception:{
        type:DataTypes.DATE,
        allowNull:false,
       },
       statut:{
        type:DataTypes.ENUM('en_attente', 'en_cours', 'livrée', 'annulée'),
        allowNull:false,
        defaultValue:'en_attente',
       },
       reference_facture:{
        type:DataTypes.STRING,
        allowNull:false,
       }
},
{
    tableName: 'receptions',
    timestamps: true,
});
module.exports = Reception;