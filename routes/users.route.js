const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller');
const checkRole  = require('../middleware/role.middleware');
const { checkAuth } = require('../middleware/auth.middleware');
const { validateCreateUser, validateUpdateUser } = require('../validations/user.validations');

//Routes pour les utilisateurs
router.get('/',checkAuth, checkRole('admin'),User.getAllUsers);
router.get('/:id',checkAuth, checkRole('admin'), User.getUserById);
router.post('/',validateCreateUser, checkAuth, checkRole('admin'),User.createUser);
router.put('/:id',validateUpdateUser, checkAuth, checkRole('admin'),User.updateUser);
router.delete('/:id', checkAuth, checkRole('admin'),User.deleteUser);

module.exports = router;


