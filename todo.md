Plan Trello : API de Gestion de Stock (Express/Sequelize)
Liste 1 : ⚙️ Fondations & Authentification (Priorité HAUTE)
Carte Trello	Description Détaillée	Rôle Requis
[BLOCKER] Environnement & DB	Installer toutes les dépendances, configurer .env et initialiser la connexion Sequelize.	N/A
[BLOCKER] Modèles & Relations	Créer tous les modèles (Users, Produits, Commandes, etc.) et définir toutes les associations (le fichier relation.js).	N/A
[BLOCKER] Seeder Admin	Créer et exécuter le script de seeder pour ajouter l'Admin initial à la DB.	N/A
POST /api/auth/login	Contrôleur login: Chercher l'utilisateur, vérifier le mot de passe (bcrypt), générer le JWT avec id et role.	Public
Middleware checkAuth	Décode le JWT, vérifie sa validité, attache req.user à la requête.	N/A
Middleware checkRole	Vérifie que le req.user.role est suffisant pour accéder à la route.	N/A
POST /api/auth/logout	Route factice (dummy endpoint), renvoie 200 OK.	Auth
Exporter vers Sheets
________________________________________
Liste 2 : 🧍‍♂️ Gestion des Utilisateurs & CRUD Simple
Carte Trello	Description Détaillée	Rôle Requis
GET /api/users	Lister tous les utilisateurs (employés et admin).	Admin
POST /api/users	Créer un nouvel utilisateur (par défaut 'employe').	Admin
PUT /api/users/:id	Modifier les informations d'un utilisateur (sauf le rôle, ou avec une vérification stricte).	Admin
DELETE /api/users/:id	Supprimer un utilisateur.	Admin
CRUD Categories	Gérer les catégories (POST, GET, PUT, DELETE).	POST/PUT/DELETE: Admin, GET: Auth
CRUD Fournisseurs	Gérer les fournisseurs (POST, GET, PUT, DELETE).	POST/PUT/DELETE: Admin, GET: Auth
CRUD Clients	Gérer les clients (POST, GET, PUT).	Employe
DELETE /api/clients/:id	Suppression d'un client.	Admin
Exporter vers Sheets
________________________________________
Liste 3 : 📦 Gestion des Produits (Cœur du Stock)
Carte Trello	Description Détaillée	Rôle Requis
POST /api/produits	Ajouter un nouveau produit. Liaison avec categorie_id et fournisseur_id (FK dans la table Produit ).	Admin
GET /api/produits	Lister tous les produits. Inclure les options de recherche par nom et filtrage par catégorie.	Auth
GET /api/produits/:id	Afficher les détails d'un produit.	Auth
PUT /api/produits/:id	Modifier les informations du produit.	Admin
DELETE /api/produits/:id	Supprimer un produit.	Admin
Exporter vers Sheets
________________________________________
Liste 4 : 🛒 Flux de Vente (Commandes - Sortie de Stock)
Carte Trello	Description Détaillée	Rôle Requis
POST /api/commandes	Créer une commande (commandes + details_commandes). Le statut initial est 'en_attente'.	Employe
GET /api/commandes	Lister toutes les commandes.	Auth
GET /api/commandes/:id	Afficher une commande détaillée (incluant les détails et les produits).	Auth
[TRANSACTION] PUT /api/commandes/:id/valider	Valider la commande : Mettre à jour le statut à 'validee'. CRUCIAL : Décrémenter Produits.quantite et créer un Mouvement_stock de type 'sortie'.	Employe
PUT /api/commandes/:id/annuler	Mettre à jour le statut à 'annulee' (ne modifie pas le stock si la commande n'était pas validée).	Employe
Exporter vers Sheets
________________________________________
Liste 5 : 🚚 Mouvements de Stock & Audit
Carte Trello	Description Détaillée	Rôle Requis
POST /api/stock/entree	Enregistrer une entrée de stock (ex: réception/livraison). CRUCIAL : Incrémenter Produits.quantite et créer un Mouvement_stock de type 'entree'.	Employe
POST /api/stock/ajustement	Enregistrer un ajustement (perte, retour, casse, etc.). Créer un Mouvement_stock de type 'sortie' ou 'entree' et mettre à jour Produits.quantite.	Admin
GET /api/mouvements	Historique complet des mouvements de stock.	Admin
GET /api/mouvements/produit/:id	Lister l'historique de stock pour un produit spécifique.	Auth
Exporter vers Sheets
________________________________________
Liste 6 : 📊 Statistiques & Finalisation
Carte Trello	Description Détaillée	Rôle Requis
GET /api/stats	Endpoint de tableau de bord.	Auth
GET /api/stats/valeur_totale	Calculer la valeur totale du stock (somme de quantite * prix_achat). 	Auth
GET /api/stats/rupture	Lister les produits dont la quantité est critique ou à zéro.	Auth
GET /api/stats/top_ventes	Top 5 des produits les plus vendus (agrégation sur details_commandes). 	Auth
Validation Globale	Implémenter la validation des données (Joi ou express-validator) sur toutes les routes POST/PUT. 	N/A
Gestion des Erreurs	Mettre en place un middleware global de gestion des erreurs.	N/A
Exporter vers Sheets
J'ai retiré les modèles et endpoints complexes (Role, Permission, Organisation, etc.) pour me concentrer uniquement sur les besoins du cahier des charges de la gestion de stock.
Voulez-vous que je détaille le contenu d'une carte spécifique (par exemple, la gestion de la Transaction de validation de commande) ?

