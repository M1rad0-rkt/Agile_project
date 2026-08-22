# API — Gestion de bibliothèque

## 1. Informations générales

Base URL :
http://localhost:8000

Documentation Swagger :
http://localhost:8000/docs

Le backend utilise FastAPI, PostgreSQL, SQLAlchemy et JWT.

---

# 2. Authentification

## POST /auth/login

Permet à un membre ou un administrateur de se connecter.

Authentification requise : Non

Content-Type :
application/x-www-form-urlencoded

Paramètres :

    username = email
    password = mot_de_passe

Exemple :

    username=admin@admin.com
    password=admin

Réponse 200 :

    {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "token_type": "bearer"
    }

Erreur 401 :

    {
      "detail": "Email ou mot de passe incorrect"
    }

Compte administrateur par défaut :

    Email    : admin@admin.com
    Password : admin

---

# 3. Utilisation du JWT

Après le login, récupérer :

    access_token

Pour les routes protégées, envoyer :

    Authorization: Bearer <TOKEN>

Dans Swagger :

1. Cliquer sur Authorize.
2. Entrer l'email dans username.
3. Entrer le mot de passe.
4. Cliquer sur Authorize.

---

# 4. Membres

## GET /membres/me

Retourne le profil du membre connecté.

Authentification : Oui

Exemple :

    Authorization: Bearer <TOKEN>

Réponse 200 :

    {
      "id_membre": 1,
      "nom": "User",
      "prenom": "Test",
      "email": "myemail@gmail.com",
      "date_inscription": "2026-08-18"
    }

Erreur 401 :

    {
      "detail": "Token invalide ou expiré"
    }

Le mot de passe n'est jamais retourné.

---

## GET /membres/

Retourne la liste des membres.

Authentification : Admin uniquement

Réponse 200 :

    [
      {
        "id_membre": 1,
        "nom": "User",
        "prenom": "Test",
        "email": "myemail@gmail.com",
        "date_inscription": "2026-08-18"
      }
    ]

Erreur 403 :

    {
      "detail": "Accès réservé aux administrateurs"
    }

---

## POST /membres/

Crée un membre.

Authentification : Admin uniquement

Body :

    {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean@gmail.com",
      "password": "password123"
    }

Réponse : membre créé, sans le mot de passe.

---

## PUT /membres/{id_membre}

Modifie un membre.

Authentification : Admin uniquement

Exemple :

    PUT /membres/2

Body :

    {
      "nom": "Dupont",
      "prenom": "Pierre",
      "email": "pierre@gmail.com"
    }

Réponse : membre modifié.

Erreur 404 :

    {
      "detail": "Membre non trouvé"
    }

---

## DELETE /membres/{id_membre}

Supprime un membre.

Authentification : Admin uniquement

Exemple :

    DELETE /membres/2

Réponse possible :

    {
      "message": "Membre supprimé"
    }

---

# 5. Livres

## GET /livres/

Retourne la liste des livres.

Authentification : Actuellement publique

Réponse 200 :

    [
      {
        "id_livre": 1,
        "titre": "Le Petit Prince",
        "auteur": "Antoine de Saint-Exupéry",
        "isbn": "9782070612758",
        "exemplaire": 5
      }
    ]

---

## POST /livres/

Ajoute un livre.

Authentification : Admin uniquement

Body :

    {
      "titre": "Le Petit Prince",
      "auteur": "Antoine de Saint-Exupéry",
      "isbn": "9782070612758",
      "exemplaire": 5
    }

Réponse : livre créé.

---

## PUT /livres/{id_livre}

Modifie un livre.

Authentification : Admin uniquement

Exemple :

    PUT /livres/1

Body :

    {
      "titre": "Le Petit Prince",
      "auteur": "Antoine de Saint-Exupéry",
      "isbn": "9782070612758",
      "exemplaire": 10
    }

Réponse : livre modifié.

---

## DELETE /livres/{id_livre}

Supprime un livre.

Authentification : Admin uniquement

Exemple :

    DELETE /livres/1

Réponse possible :

    {
      "message": "Livre supprimé"
    }

---

# 6. Administration

## GET /admin/test

Endpoint de test des permissions administrateur.

Authentification : Admin uniquement

Réponse 200 :

    {
      "message": "Accès administrateur autorisé",
      "admin": {
        "sub": "1",
        "email": "admin@admin.com",
        "role": "admin",
        "exp": 1787121745
      }
    }

Avec un membre :

    403 Forbidden

Réponse :

    {
      "detail": "Accès réservé aux administrateurs"
    }

Cet endpoint est uniquement destiné au test et pourra être supprimé plus tard.

---

# 7. Emprunts

## POST /emprunts/

Permet au membre connecté d'emprunter un livre.

Authentification : Membre connecté

Body :

    {
      "id_livre": 1
    }

Exemple :

    curl -X POST "http://localhost:8000/emprunts/"       -H "Content-Type: application/json"       -H "Authorization: Bearer <TOKEN>"       -d '{"id_livre": 1}'

Réponse actuelle :

    {
      "id_emprunt": 1,
      "id_membre": 1,
      "id_livre": 1,
      "date_emprunt": "2026-08-19",
      "date_retour": null
    }

L'id du membre est récupéré automatiquement depuis le JWT.

Les règles métier complètes des emprunts restent à implémenter.

---

# 8. Résumé des permissions

Endpoint                         Membre    Admin    Auth
----------------------------------------------------------------
POST /auth/login                 Oui       Oui      Non
GET /membres/me                  Oui       Oui*     Oui
GET /membres/                    Non       Oui      Oui
POST /membres/                   Non       Oui      Oui
PUT /membres/{id}                Non       Oui      Oui
DELETE /membres/{id}             Non       Oui      Oui
GET /livres/                     Oui       Oui      Non
POST /livres/                    Non       Oui      Oui
PUT /livres/{id}                 Non       Oui      Oui
DELETE /livres/{id}              Non       Oui      Oui
GET /admin/test                  Non       Oui      Oui
POST /emprunts/                  Oui       Oui*     Oui

* Selon l'implémentation actuelle.

---

# 9. Codes HTTP

200 - Requête réussie
201 - Ressource créée
401 - Non authentifié / token invalide
403 - Authentifié mais accès interdit
404 - Ressource introuvable
422 - Données envoyées invalides
500 - Erreur serveur

---

# 10. Workflow frontend

    LOGIN
      |
      v
    POST /auth/login
      |
      v
    JWT Token
      |
      +-----------------------+
      |                       |
      v                       v
    role=membre            role=admin
      |                       |
      v                       v
    /membres/me          gestion membres
    /emprunts             gestion livres
                          administration

Toutes les routes protégées utilisent :

    Authorization: Bearer <TOKEN>

---

# 11. Démarrage du projet

Depuis le dossier backend :

    docker compose up -d --build

Vérifier les conteneurs :

    docker compose ps

Voir les logs :

    docker compose logs backend

Arrêter :

    docker compose down

Documentation :

    http://localhost:8000/docs

---

# 12. État actuel du projet

User dispo :
    membre : 
    - email:myemail@gmail.com
    - mdp:string
    admin :
    - admin@admin.com
    - mdp:admin

# 13. État actuel du projet

Fonctionnel :

- FastAPI
- PostgreSQL avec Docker
- SQLAlchemy
- CRUD Membres
- CRUD Livres
- Authentification JWT
- Login Membre
- Login Admin
- Admin par défaut
- Protection des routes Admin
- Endpoint /membres/me
- Début du système d'emprunt
