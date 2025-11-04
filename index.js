const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/config');
const createInitialAdmin = require('./seeders/seed');
// Importer les modèles afin qu'ils soient enregistrés avant la synchronisation
const User = require('./models/user.model');
const Commande = require('./models/commande.model');
const Reception = require('./models/reception.model');
const Mouvement_Stock = require('./models/mouvement_stock.model');
const Produit = require('./models/produit.model');
const Categorie = require('./models/categorie.model');
const Fournisseur = require('./models/Fournisseur.model');
const Detail_Reception = require('./models/detail_reception.model');
const Details_Commande = require('./models/details_commande.model');
const Produit_fournisseurs = require('./models/produit_fournisseurs.model');
const Client = require('./models/client.model');
const { definirAssociations } = require('./models/relation.model');
const authRoutes = require('./routes/auth.route');

dotenv.config();

//Initialisation de l'application Express
const app = express();

const PORT = process.env.PORT || 5000;


//Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//Middleware pour parser les données URL-encodées

//Routes d'API
app.use('/api/auth', authRoutes);


//Middleware CORS
app.use(cors());


//Lancer le serveur
app.listen(PORT, async () => {
    
    //Vérification de la connexion à la base de données
    try {
        await db.authenticate();    
        console.log('Connexion à la base de données réussies.');

        const shouldAlter = process.env.DB_SYNC_ALTER  === 'true';
        // Définir les associations avant la synchronisation
        definirAssociations({
            User,
            Commande,
            Reception,
            Mouvement_Stock,
            Produit,
            Categorie,
            Fournisseur,
            Detail_Reception,
            Details_Commande,
            Produit_fournisseurs,
            Client,
        });
        await db.sync({ alter: shouldAlter });//Synchronisation des tables
        console.log('Toutes les tables sont synchronisées.');

        // Créer l'admin initial après la synchronisation (sans fermer la connexion)
        await createInitialAdmin();

    } catch (error) {
        console.error('Impossible de se connecter à la base de données :', error);
    }  
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
