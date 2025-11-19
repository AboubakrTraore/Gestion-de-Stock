const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant. Accès non autorisé.' });
    }

    try {
        // Décoder le token JWT
        const user = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = user; 
        
        next(); 
    } catch (error) {
        // Gère les tokens invalides ou expirés
        return res.status(403).json({ message: 'Token invalide. Accès refusé.' });
    }
};

module.exports = { checkAuth }; 