const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

//gestion de la cle secrete
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_par_defaut'

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
            
            //Supprimer le mot de passe de la réponse
            const UserResponse = user.toJSON();
            delete UserResponse.password;
            console.log("L'utilisateur a été trouvé avec succès:", UserResponse);
            
            // Création du Token JWT
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
                expiresIn: 3600 // 1 heure
            });

            // Envoie de la réponse
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
        
        res.status(200).json({ message: 'Déconnexion réussie' });
    }
}

module.exports = AuthController;
