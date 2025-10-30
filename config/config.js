const { Sequelize } = require('sequelize');
require('dotenv').config();

//Vérification des variables d'environnement
if(!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

//Configuration de la connexion à la base de données
const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
//Vérification SSL pour les connexions sécurisées
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
});
module.exports = db;
