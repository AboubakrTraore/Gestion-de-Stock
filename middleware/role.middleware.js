
const checkRole = (allowedRole) => {
    return (req, res, next) => {
        // req.user a été créé par checkAuth et contient { id, role }
        const userRole = req.user.role; 

        if (userRole === allowedRole) {
            // Le rôle est correct, on autorise l'accès au contrôleur
            next();
        } else {
            // Le rôle n'est pas autorisé
            return res.status(403).json({ 
                message: "Accès refusé. Autorisation insuffisante." 
            });
        }
    };
};

// C'est cette fonction qui permet de faire checkRole('admin')
module.exports = checkRole ;