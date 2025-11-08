const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller');
const checkRole  = require('../middleware/role.middleware');

//Routes pour les utilisateurs
router.get('/users', checkRole('admin'), User.getAllUsers);
router.get('/users/:id', checkRole('admin'), User.getUserById);

module.exports = router;


