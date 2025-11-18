const { DataTypes } = require('sequelize');
const user = require('./user.model');
const commande = require('./commande.model');
const reception = require('./reception.model');
const mouvement_stock = require('./mouvement_stock.model');
const produit = require('./produit.model');
const categorie = require('./categorie.model');
const Fournisseur = require('./fournisseur.model');
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
    Fournisseur: Fournisseur,
    Detail_Reception: detail_reception,
    Details_Commande: Details_Commande,
    Produit_fournisseurs: produit_fournisseurs,
    Client: client,
};

function definirAssociations(db) {

    // --- 1. Pôle Acteurs ---
  
    // --- Liaisons User ---

    // Traçabilité User (self-reference)
    db.User.hasMany(db.User, { foreignKey: 'created_by', as: 'CreatedUsers' });
    db.User.hasMany(db.User, { foreignKey: 'updated_by', as: 'UpdatedUsers' });
    db.User.belongsTo(db.User, { foreignKey: 'created_by', as: 'createdByUser' });
    db.User.belongsTo(db.User, { foreignKey: 'updated_by', as: 'updatedByUser' });

    // User (1) -> (N) Commandes
    db.User.hasMany(db.Commande, { foreignKey: 'user_id' });
    db.Commande.belongsTo(db.User, { foreignKey: 'user_id' });
  
    // User (1) -> (N) Receptions
    db.User.hasMany(db.Reception, { foreignKey: 'user_id' });
    db.Reception.belongsTo(db.User, { foreignKey: 'user_id' });
  
    // User (1) -> (N) MouvementsStock
    db.User.hasMany(db.Mouvement_Stock, { foreignKey: 'user_id' });
    db.Mouvement_Stock.belongsTo(db.User, { foreignKey: 'user_id' });
  
    // User (1) -> (N) Produits (Traçabilité)
    db.User.hasMany(db.Produit, { foreignKey: 'created_by', as: 'ProduitsCrees' });
    db.User.hasMany(db.Produit, { foreignKey: 'updated_by', as: 'ProduitsModifies' });
    db.Produit.belongsTo(db.User, { foreignKey: 'created_by', as: 'createdByUser' });
    db.Produit.belongsTo(db.User, { foreignKey: 'updated_by', as: 'updatedByUser' });
  
    // Client (1) -> (N) Commandes
    db.Client.hasMany(db.Commande, { 
      foreignKey: 'client_id',
      onDelete: 'SET NULL' // Garde la commande si le client est supprimé
    });
    db.Commande.belongsTo(db.Client, { foreignKey: 'client_id' });
  
  
    // --- 2. Pôle Catalogue (Produits & Fournisseurs) ---
  
    // Categorie (1) -> (N) Produits
    db.Categorie.hasMany(db.Produit, { foreignKey: 'categorie_id' });
    db.Produit.belongsTo(db.Categorie, { foreignKey: 'categorie_id' });
  
    // Relation N:M : Produit (N) <-> (M) Fournisseur
    // Sequelize gère la table 'Produit_fournisseurs' pour nous.
    db.Produit.belongsToMany(db.Fournisseur, {
      through: db.Produit_fournisseurs, // Nom du modèle de la table de liaison
      foreignKey: 'produit_id',
      as: 'Fournisseurs'
    });
    db.Fournisseur.belongsToMany(db.Produit, {
      through: db.Produit_fournisseurs,
      foreignKey: 'fournisseur_id',
      as: 'Produits'
    });
  
  
    // --- 3. Pôle Ventes (Sorties) ---
  
    // Commande (1) -> (N) Details_Commande
    db.Commande.hasMany(db.Details_Commande, { 
      foreignKey: 'commande_id',
      onDelete: 'CASCADE' // Supprime les lignes si la commande est supprimée
    });
    db.Details_Commande.belongsTo(db.Commande, { foreignKey: 'commande_id' });
  
    // Produit (1) -> (N) Details_Commande
    db.Produit.hasMany(db.Details_Commande, { foreignKey: 'produit_id' });
    db.Details_Commande.belongsTo(db.Produit, { 
      foreignKey: 'produit_id',
      onDelete: 'RESTRICT' // Bloque la suppression du produit s'il est vendu
    });
  
  
    // --- 4. Pôle Achats (Entrées) ---
  
    // Fournisseur (1) -> (N) Receptions
    db.Fournisseur.hasMany(db.Reception, { foreignKey: 'fournisseur_id' });
    db.Reception.belongsTo(db.Fournisseur, { foreignKey: 'fournisseur_id' });
  
    // Reception (1) -> (N) Detail_Reception
    db.Reception.hasMany(db.Detail_Reception, { 
      foreignKey: 'reception_id',
      onDelete: 'CASCADE' 
    });
    db.Detail_Reception.belongsTo(db.Reception, { foreignKey: 'reception_id' });
  
    // Produit (1) -> (N) Detail_Reception
    db.Produit.hasMany(db.Detail_Reception, { foreignKey: 'produit_id' });
    db.Detail_Reception.belongsTo(db.Produit, { 
      foreignKey: 'produit_id',
      onDelete: 'RESTRICT'
    });
  
  
    // --- 5. Pôle Stock (Le Cerveau) ---
  
    // Produit (1) -> (N) MouvementsStock
    db.Produit.hasMany(db.Mouvement_Stock, { foreignKey: 'produit_id' });
    db.Mouvement_Stock.belongsTo(db.Produit, { foreignKey: 'produit_id' });
  
    // [CORRECTION 1:1] Details_Commande (1) -> (1) MouvementsStock (Cause de sortie)
    db.Details_Commande.hasOne(db.Mouvement_Stock, { 
      foreignKey: 'detail_commande_id',
      onDelete: 'SET NULL' // Garde l'historique du mouvement
    });
    db.Mouvement_Stock.belongsTo(db.Details_Commande, { foreignKey: 'detail_commande_id' });
  
    // [CORRECTION 1:1] Detail_Reception (1) -> (1) MouvementsStock (Cause d'entrée)
    db.Detail_Reception.hasOne(db.Mouvement_Stock, { 
      foreignKey: 'detail_reception_id',
      onDelete: 'SET NULL' 
    });
    db.Mouvement_Stock.belongsTo(db.Detail_Reception, { foreignKey: 'detail_reception_id' });
  }
  
  module.exports = { definirAssociations };