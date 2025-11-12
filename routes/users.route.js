const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller');
const checkRole  = require('../middleware/role.middleware');

//Routes pour les utilisateurs
router.get('/', checkRole('admin'), User.getAllUsers);
router.get('/:id', checkRole('admin'), User.getUserById);
router.post('/', User.createUser);

module.exports = router;


