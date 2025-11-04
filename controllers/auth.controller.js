const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');



class AuthController {
    // Fonction pour la connexion
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }
            // Vérification du mot de passe
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }
            // Génération du token JWT
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: 'JWT_SECRET manquant dans les variables d\'environnement' });
            }
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
        }
    }
    // Fonction pour la déconnexion
    static async logout(req, res) {
        res.clearCookie('token');
        res.status(200).json({ message: 'Déconnexion réussie' });
    }
}

module.exports = AuthController;
