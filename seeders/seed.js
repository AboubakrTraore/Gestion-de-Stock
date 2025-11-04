// seeders/seed.js

// 1. Imports et chargement DOTENV
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/config');
const User = require('../models/user.model');


// 2. Utilisation de l'instance partagée de Sequelize (db)
// 4. Fonction d'insertion (Admin initial)
async function createInitialAdmin() {
    const adminEmail = "admin@monentreprise.com"; 

    const [user, created] = await User.findOrCreate({ 
        where: { email: adminEmail },
        defaults: {
            username: "admin",
            email: adminEmail,
            password: await bcrypt.hash('MotDePasseSuperSecure123', 10),
            tel: "+0000000000",
            role: "admin",
        }
    });

    if (created) {
        console.log(`✅ Administrateur initial [${user.email}] créé avec succès !`);
    } else {
        console.log(`ℹ️ L'administrateur initial [${user.email}] existe déjà. Skipping.`);
    }
}

module.exports = createInitialAdmin;