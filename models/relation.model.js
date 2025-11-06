const { DataTypes } = require('sequelize');
const user = require('./user.model');
const commande = require('./commande.model');
const reception = require('./reception.model');
const mouvement_stock = require('./mouvement_stock.model');
const produit = require('./produit.model');
const categorie = require('./categorie.model');
const fournisseur = require('./Fournisseur.model');
const detail_reception = require('./detail_reception.model');
const Details_Commande = require('./details_commande.model');
const produit_fournisseurs = require('./produit_fournisseurs.model');
const client = require('./client.model');

const db = {
    User: user,
    Commande: commande,
    Reception: reception,
    Mouvement_Stock: mouvement_stock,
    Produit: produit,
    Categorie: categorie,
    Fournisseur: fournisseur,
    Detail_Reception: detail_reception,
    Details_Commande: Details_Commande,
    Produit_fournisseurs: produit_fournisseurs,
    Client: client,
};

function definirAssociations(models) {
    const m = models || db;

    // User (1) -> (N) Commandes
    m.User.hasMany(m.Commande, { foreignKey: 'user_id' });
    m.Commande.belongsTo(m.User, { foreignKey: 'user_id' });

    // User (1) -> (N) Receptions
    m.User.hasMany(m.Reception, { foreignKey: 'user_id' });
    m.Reception.belongsTo(m.User, { foreignKey: 'user_id' });

    // User (1) -> (N) MouvementsStock
    m.User.hasMany(m.Mouvement_Stock, { foreignKey: 'user_id' });
    m.Mouvement_Stock.belongsTo(m.User, { foreignKey: 'user_id' });

    // Traçabilité Produit
    m.User.hasMany(m.Produit, { foreignKey: 'created_by', as: 'ProduitsCrees' });
    m.User.hasMany(m.Produit, { foreignKey: 'updated_by', as: 'ProduitsModifies' });
    m.Produit.belongsTo(m.User, { foreignKey: 'created_by', as: 'Createur' });
    m.Produit.belongsTo(m.User, { foreignKey: 'updated_by', as: 'Modificateur' });

    // Client (1) -> (N) Commandes
    m.Client.hasMany(m.Commande, { foreignKey: 'client_id', onDelete: 'SET NULL' });
    m.Commande.belongsTo(m.Client, { foreignKey: 'client_id' });

    // Categorie (1) -> (N) Produits
    m.Categorie.hasMany(m.Produit, { foreignKey: 'categorie_id' });
    m.Produit.belongsTo(m.Categorie, { foreignKey: 'categorie_id' });

    // Produit (N) <-> (M) Fournisseur via table de liaison
    m.Produit.belongsToMany(m.Fournisseur, {
        through: m.Produit_fournisseurs,
        foreignKey: 'produit_id',
        as: 'Fournisseurs'
    });
    m.Fournisseur.belongsToMany(m.Produit, {
        through: m.Produit_fournisseurs,
        foreignKey: 'fournisseur_id',
        as: 'Produits'
    });

    // Commande (1) -> (N) Details_Commande
    m.Commande.hasMany(m.Details_Commande, { foreignKey: 'commande_id', onDelete: 'CASCADE' });
    m.Details_Commande.belongsTo(m.Commande, { foreignKey: 'commande_id' });

    // Produit (1) -> (N) Details_Commande
    m.Produit.hasMany(m.Details_Commande, { foreignKey: 'produit_id' });
    m.Details_Commande.belongsTo(m.Produit, { foreignKey: 'produit_id', onDelete: 'RESTRICT' });

    // Fournisseur (1) -> (N) Receptions
    m.Fournisseur.hasMany(m.Reception, { foreignKey: 'fournisseur_id' });
    m.Reception.belongsTo(m.Fournisseur, { foreignKey: 'fournisseur_id' });

    // Reception (1) -> (N) Detail_Reception
    m.Reception.hasMany(m.Detail_Reception, { foreignKey: 'reception_id', onDelete: 'CASCADE' });
    m.Detail_Reception.belongsTo(m.Reception, { foreignKey: 'reception_id' });

    // Produit (1) -> (N) Detail_Reception
    m.Produit.hasMany(m.Detail_Reception, { foreignKey: 'produit_id' });
    m.Detail_Reception.belongsTo(m.Produit, { foreignKey: 'produit_id', onDelete: 'RESTRICT' });

    // Produit (1) -> (N) MouvementsStock
    m.Produit.hasMany(m.Mouvement_Stock, { foreignKey: 'produit_id' });
    m.Mouvement_Stock.belongsTo(m.Produit, { foreignKey: 'produit_id' });

    // Details_Commande (1) -> (1) MouvementsStock
    m.Details_Commande.hasOne(m.Mouvement_Stock, { foreignKey: 'detail_commande_id', onDelete: 'SET NULL' });
    m.Mouvement_Stock.belongsTo(m.Details_Commande, { foreignKey: 'detail_commande_id' });

    // Detail_Reception (1) -> (1) MouvementsStock
    m.Detail_Reception.hasOne(m.Mouvement_Stock, { foreignKey: 'detail_reception_id', onDelete: 'SET NULL' });
    m.Mouvement_Stock.belongsTo(m.Detail_Reception, { foreignKey: 'detail_reception_id' });
}

module.exports = { definirAssociations };


