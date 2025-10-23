const {Commande,Details_Commande,Reception,Detail_Reception,Mouvement_Stock,Produit,Categorie,Fournisseur,User} = require('./commande.model');
const {Produit_fournisseurs} = require('./produit_fournisseurs.model');
const {Mouvement_Stock} = require('./mouvement_stock.model');
const {Produit} = require('./produit.model');
const {Categorie} = require('./categorie.model');
const {Fournisseur} = require('./fournisseur.model');
const {User} = require('./user.model');

// Relation entre Commande et Details_Commande
Commande.hasMany(Details_Commande, { foreignKey: 'commande_id' });
Details_Commande.belongsTo(Commande, { foreignKey: 'commande_id' });

// Relation entre Reception et Detail_Reception
Reception.hasMany(Detail_Reception, { foreignKey: 'reception_id' });
Detail_Reception.belongsTo(Reception, { foreignKey: 'reception_id' });

// Relation entre Produit et Mouvement_Stock
Produit.hasMany(Mouvement_Stock, { foreignKey: 'produit_id' });
Mouvement_Stock.belongsTo(Produit, { foreignKey: 'produit_id' });

// Relation entre Fournisseur et Produit_fournisseurs
Fournisseur.hasMany(Produit_fournisseurs, { foreignKey: 'fournisseur_id' });
Produit_fournisseurs.belongsTo(Fournisseur, { foreignKey: 'fournisseur_id' });

// Relation entre User et Commande
User.hasMany(Commande, { foreignKey: 'user_id' });
Commande.belongsTo(User, { foreignKey: 'user_id' });

// Relation entre User et Reception
User.hasMany(Reception, { foreignKey: 'user_id' });
Reception.belongsTo(User, { foreignKey: 'user_id' });

// Relation entre User et Mouvement_Stock
User.hasMany(Mouvement_Stock, { foreignKey: 'user_id' });
Mouvement_Stock.belongsTo(User, { foreignKey: 'user_id' });

// Relation entre Details_Commande et Mouvement_Stock
Details_Commande.hasMany(Mouvement_Stock, { foreignKey: 'detail_commande_id' });
Mouvement_Stock.belongsTo(Details_Commande, { foreignKey: 'detail_commande_id' });

// Relation entre Detail_Reception et Mouvement_Stock
Detail_Reception.hasMany(Mouvement_Stock, { foreignKey: 'detail_reception_id' });
Mouvement_Stock.belongsTo(Detail_Reception, { foreignKey: 'detail_reception_id' });

//