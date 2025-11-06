const {DataTypes} = require('sequelize');
const db = require('../config/config');

// Définition du modèle Categorie
const Categorie = db.define('Categorie', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,   
        unique: true,
    },
    description: {  
        type: DataTypes.TEXT,
        allowNull: true,
    } 

},
{
    tableName: 'categories',
    timestamps: true,
});

module.exports = Categorie;
