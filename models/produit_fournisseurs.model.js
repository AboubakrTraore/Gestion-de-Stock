const { DataTypes } = require('sequelize');
const db = require('../config/config');

//Définition du model produit_fournisseurs
const Produit_fournisseurs = db.define('Produit_fournisseurs',{
    produit_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'produits',
            key: 'id',
        },
    },
    fournisseur_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'fournisseurs',
            key: 'id',

        } 
    },
    prix_achat_actuel:{
        type: DataTypes.DECIMAL,
        allowNull:false,
    }
},
{
    tableName: 'produit_fournisseurs',
    timestamps: true,

});
module.exports= Produit_fournisseurs;