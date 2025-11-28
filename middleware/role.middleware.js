

// const checkRole = (allowedRoles) => {

//     return (req, res, next) => {
        
//         // Vérification de l'existence de l'utilisateur après checkAuth
//         if (!req.user || !req.user.role) {
//             return res.status(500).json({ message: "Erreur interne: rôle utilisateur non défini." });
//         }

//         // Récupérer le rôle de l'utilisateur (on suppose une chaîne simple)
//         const userRole = req.user.role; 
    
//         // Vérifier si le rôle de l'utilisateur est inclus dans le tableau des rôles autorisés
//         if (allowedRoles.includes(userRole)) {
//             // Le rôle est correct, on autorise l'accès au contrôleur
//             next();
//         } else {
//             // Le rôle n'est pas autorisé
//             return res.status(403).json({ 
//                 message: "Accès refusé. Autorisation insuffisante pour effectuer cette action." 
//             });
//         }
//     };
// };

// module.exports = checkRole;
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        
        if (!userRole) {
            return res.status(403).json({ 
                message: 'Accès refusé. Autorisation insuffisante.' 
            });
        }

        // --- CORRECTION APPLIQUÉE ICI ---
        // 1. Aplatir le tableau allowedRoles pour s'assurer qu'il ne contient que des chaînes de caractères.
        //    Cela gère les cas où il est appelé comme : checkRole(['Admin', 'User'])
        const flatAllowedRoles = allowedRoles.flat();
        
        // 2. Conversion en minuscules pour comparaison insensible à la casse
        const normalizedUserRole = userRole.toLowerCase();
        
        // 3. Mapper sur le tableau aplati
        const normalizedAllowedRoles = flatAllowedRoles.map(role => role.toLowerCase());
       

        if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
            return res.status(403).json({ 
                message: 'Accès refusé. Autorisation insuffisante.' 
            });
        }

        next();
    }
}

module.exports = checkRole;

