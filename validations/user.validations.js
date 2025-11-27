const {body, validationResult} = require('express-validator');
const {User} = require('../models/user.model'); 

//Middleware génirqique pour gérer les erreurs de validation
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({field: err.param, message: err.msg}));
        return res.status(400).json({
            message: "Erreur de validation des données.",
            details: formattedErrors
        });
    }
    next();
};
//Validation pour la création d'un utilisateur
const validateCreateUser = [
    //Validation du nom d'utilisateur
    body('username')
    .notEmpty().withMessage('Le nom d\'utilisateur est requis.')
    .isLength({min: 3, max: 50}).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères.'),

    //Validation de l'email et vérififcation de l'unicité
    body('email')
    .isEmail().withMessage('L\'adresse email n\'est pas valide.')
    .custom(async (value) => {
        //Simuler une vérification d'unicité dans la base de données
        const user = await User.findOne({where: {email: value}});
        if (user) {
            return Promise.reject('L\'adresse email est déjà utilisée.');
        }   
    }),

    //Validation du mot de passe
    body('password')
    .optional()
    .isLength({min: 6}).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.'),

    //Validation du telephone 
    body('tel')
    .notEmpty().withMessage('Le numéro de téléphone est requis.')
    .matches(/^[0-9+\-\\s()]*$/i).withMessage('Le numéro de téléphone n\'est pas valide.'),

    //Validation du rôle
    body('role')
    .notEmpty().withMessage('Le rôle est requis.')
    .isIn(['admin', 'employé']).withMessage('Le rôle doit être soit "admin" soit "employé".'),

    //Gestionnaire d'erreurs
    validate
];

//Validation pour la mise à jour d'un utilisateur
const validateUpdateUser = [
        //Validation de l'email n'est pas obligatoire dans ce cas
        body('email')
        .optional()
        .isEmail().withMessage('L\'adresse email n\'est pas valide.')
        .custom(async (value, {req}) => {
            //Simuler une vérification d'unicité dans la base de données
            const user = await User.findOne({where: {email: value}});

            //Si le user est trouvé avec cet email et que son id n'est pas l'ID ciblé, alors l'email est déjà est utilisé ailleurs
            if (user && user.id !== parseInt(UserId, 10)) {
                return Promise.reject('L\'adresse email est déjà utilisée.');
            }
        }),

        //Validation du mot de passe
        body('password')
        .optional()
        .isLength({min: 6}).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.'), 
        
        //Validation du role
        body('role')
        .optional()
        .isIn(['admin', 'employé']).withMessage('Le rôle doit être soit "admin" soit "employé".'),

        //Validation des autres champs (s'ils sont présents)
        body('username')
        .optional()
        .isLength({min: 3, max: 50}).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères.'),
        body('tel')
        .optional()
        .matches(/^[0-9+\-\\s()]*$/i).withMessage('Le numéro de téléphone n\'est pas valide.'),

        //Gestionnaire d'erreurs
        validate
];

//Validation de la connexion utilisateur
const validateLoginUser = [
    body('email')
    .isEmail().withMessage('L\'adresse email n\'est pas valide.'),

    body('password')
    .notEmpty().withMessage('Le mot de passe est requis.'),

    validate
];


module.exports = {
    validateCreateUser
    , validateUpdateUser
    , validateLoginUser
};
