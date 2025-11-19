const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');

//Routes pour les utilisateurs
router.get('/',checkAuth, checkRole('admin'),User.getAllUsers);
router.get('/:id',checkAuth, checkRole('admin'), User.getUserById);
router.post('/', checkAuth, checkRole('admin'),User.createUser);
router.put('/:id', checkAuth, checkRole('admin'),User.updateUser);
router.delete('/:id', checkAuth, checkRole('admin'),User.deleteUser);

module.exports = router;


