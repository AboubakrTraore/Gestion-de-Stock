const {DataTypes} = require('sequelize');// Importation de DataTypes depuis Sequelize
const db = require('../config/config');// Importation de la configuration de la base de données     

//Définition du model produit
const Produit = db.define ('Produit',{
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    Prix_vente:{
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    quantite_stock:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categorie_id:{
        type: DataTypes.UUID,
        allowNull:false, 
        references:{
            model: 'categories',
            key: 'id',
        },  
    },
    Image:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_by:{
        type:DataTypes.UUID,
        allowNull: false,
        references:{
            model: 'users',
            key: 'id',
        },
    },
    updated_by:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model: 'users',
            key: 'id',
        },
    },
    archived:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
    }
},
{
    tableName: 'produits',
    timestamps: true,

});

module.exports= Produit;