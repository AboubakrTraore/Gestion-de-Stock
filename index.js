const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/config');
const createInitialAdmin = require('./seeders/seed');

dotenv.config();

//Initialisation de l'application Express
const app = express();

const PORT = process.env.PORT || 5000;


//Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//Middleware pour parser les données URL-encodées

//Middleware CORS
app.use(cors());

//Lancer le serveur
app.listen(PORT, async () => {
    
    //Vérification de la connexion à la base de données
    try {
        await db.authenticate();    
        console.log('Connexion à la base de données réussies.');

        const shouldAlter = process.env.DB_SYNC_ALTER  === 'true';
        await db.sync({ alter: shouldAlter });
        console.log('Toutes les tables sont synchronisées.');

    } catch (error) {
        console.error('Impossible de se connecter à la base de données :', error);
    }  
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
