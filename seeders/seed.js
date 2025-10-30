// seeders/seed.js
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

async function createInitialAdmin() {
  const adminExists = await User.findOne({ where: { role: 'admin' } });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('MotDePasseSuperSecure123', 10);
    await User.create({
      username: "admin",
      email: "admin@monentreprise.com",
      password: hashedPassword,
      tel: "627000000",
      role: "admin"
    });
    console.log('Admin initial créé avec succès !');
  } else {
    console.log('L\'admin initial existe déjà.');
  }
}

createInitialAdmin();