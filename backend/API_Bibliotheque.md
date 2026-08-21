# API Bibliothèque — Documentation des endpoints

## Base URL

```text
http://127.0.0.1:8000
```

Swagger :
```text
http://127.0.0.1:8000/docs
```

L'API utilise un token Bearer JWT. Après `/auth/login`, utiliser **Authorize** dans Swagger.

---

# 1. Authentification

## POST `/auth/login`

Connexion d'un membre ou de l'administrateur.

### Requête
```json
{
  "username": "email@example.com",
  "password": "mot_de_passe"
}
```

### Réponse 200
```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```

---

# 2. Livres

## GET `/livres/disponibles`

Retourne les livres ayant au moins un exemplaire disponible.

## GET `/livres/{id_livre}`

Retourne les informations d'un livre.

### Exemple
```text
GET /livres/2
```

## GET `/livres/recherche?q=...`

Recherche un livre à partir des champs disponibles dans le modèle `Livre`, notamment le titre, l'auteur et la catégorie.

### Exemple
```text
GET /livres/recherche?q=my
```

### Réponse possible
```json
[
  {
    "id_livre": 2,
    "titre": "My Book",
    "auteur": "Auteur",
    "categorie": "Informatique",
    "exemplaire": 1
  }
]
```

---

# 3. Membres

## GET `/membres/me`

Retourne le profil du membre connecté.

### Exemple de réponse
```json
{
  "id_membre": 1,
  "nom": "Nobby",
  "prenom": "AZ",
  "email": "myemail@gmail.com",
  "date_inscription": "2026-08-18",
  "statut": "actif"
}
```

> Le mot de passe ne doit pas être exposé dans la réponse de l'API.

## PATCH `/membres/me`

Permet au membre connecté de modifier son profil.

### Exemple
```json
{
  "nom": "NouveauNom",
  "prenom": "NouveauPrenom",
  "email": "nouveau@email.com"
}
```

## PATCH `/membres/{id_membre}/statut`

Permet à l'administrateur de modifier le statut d'un membre.

### Statuts
```text
actif
blocked
```

### Exemple
```json
{
  "statut": "blocked"
}
```

---

# 4. Dashboard membre

## GET `/membres/dashboard`

Retourne les statistiques personnelles du membre connecté.

### Réponse
```json
{
  "total_emprunts": 5,
  "emprunts_en_cours": 2,
  "emprunts_en_retard": 1,
  "livres_retournes": 2,
  "dernier_emprunt": {
    "id_emprunt": 5,
    "id_livre": 2,
    "date_emprunt": "2026-08-21",
    "date_limite": "2026-09-04",
    "date_retour": null,
    "statut": "en_cours"
  }
}
```

Si aucun emprunt :
```json
{
  "total_emprunts": 0,
  "emprunts_en_cours": 0,
  "emprunts_en_retard": 0,
  "livres_retournes": 0,
  "dernier_emprunt": null
}
```

---

# 5. Emprunts

## POST `/emprunts/`

Permet au membre connecté d'emprunter un livre.

### Requête
```json
{
  "id_livre": 2
}
```

### Règles

- Le livre doit exister.
- Il doit rester au moins un exemplaire.
- Un membre ne peut pas avoir deux fois le même livre en cours.
- La durée est de **14 jours**.
- L'exemplaire disponible est décrémenté.

### Réponse possible
```json
{
  "id_emprunt": 10,
  "id_membre": 1,
  "id_livre": 2,
  "date_emprunt": "2026-08-21",
  "date_limite": "2026-09-04",
  "date_retour": null,
  "statut": "en_cours"
}
```

## GET `/emprunts/mes-emprunts`

Retourne les emprunts du membre connecté.

### Statuts possibles
```text
en_cours
en_retard
retourne
```

## POST `/emprunts/{id_emprunt}/retour`

Retourne un livre emprunté par le membre.

### Exemple
```text
POST /emprunts/10/retour
```

Le système enregistre la date de retour, passe le statut à `retourne` et ré-incrémente les exemplaires disponibles.

## GET `/emprunts/`

Retourne tous les emprunts.

**Accès : administrateur uniquement.**

---

# 6. Administration

## GET `/admin/test`

Teste l'accès administrateur.

**Accès : administrateur uniquement.**

## GET `/admin/dashboard`

Retourne les statistiques générales.

### Réponse
```json
{
  "total_membres": 12,
  "total_livres": 25,
  "livres_disponibles": 18,
  "total_emprunts": 30,
  "emprunts_en_cours": 7,
  "emprunts_en_retard": 2,
  "dernier_emprunt": {
    "id_emprunt": 30,
    "id_membre": 4,
    "id_livre": 8,
    "date_emprunt": "2026-08-21",
    "date_limite": "2026-09-04",
    "date_retour": null,
    "statut": "en_cours"
  }
}
```

## PATCH `/admin/me`

Permet à l'administrateur unique de modifier son profil.

### Exemple
```json
{
  "nom": "NouveauNom",
  "prenom": "NouveauPrenom",
  "email": "admin@bibliotheque.com"
}
```

## PATCH `/admin/me/password`

Permet à l'administrateur de modifier son mot de passe.

### Exemple
```json
{
  "ancien_mot_de_passe": "ancien_password",
  "nouveau_mot_de_passe": "nouveau_password"
}
```

Le nouveau mot de passe doit être hashé avant stockage et ne doit jamais être retourné.

---

# 7. Statut des membres

Le champ `statut` permet de gérer l'état d'un membre.

Valeurs actuelles :
```text
actif
blocked
```

Un membre bloqué ne doit pas pouvoir utiliser les fonctionnalités nécessitant un compte actif.

---

# 8. Règles d'emprunt

Durée d'un emprunt :
```text
14 jours
```

Si la date limite est dépassée et que le livre n'est pas retourné :
```text
en_retard
```

La **pénalité financière a été supprimée** conformément à la décision de l'équipe.

---

# 9. Résumé des endpoints

| Méthode | Endpoint | Accès | Fonction |
|---|---|---|---|
| POST | `/auth/login` | Public | Connexion |
| GET | `/livres/disponibles` | Selon configuration | Livres disponibles |
| GET | `/livres/{id_livre}` | Selon configuration | Détails livre |
| GET | `/livres/recherche` | Selon configuration | Recherche |
| GET | `/membres/me` | Membre | Profil |
| PATCH | `/membres/me` | Membre | Modifier profil |
| PATCH | `/membres/{id_membre}/statut` | Admin | Activer/bloquer |
| GET | `/membres/dashboard` | Membre | Dashboard membre |
| POST | `/emprunts/` | Membre | Emprunter |
| GET | `/emprunts/mes-emprunts` | Membre | Mes emprunts |
| POST | `/emprunts/{id_emprunt}/retour` | Membre | Retour |
| GET | `/emprunts/` | Admin | Tous les emprunts |
| GET | `/admin/test` | Admin | Test admin |
| GET | `/admin/dashboard` | Admin | Dashboard admin |
| PATCH | `/admin/me` | Admin | Modifier profil admin |
| PATCH | `/admin/me/password` | Admin | Modifier mot de passe admin |

---

# 10. Fonctionnalités couvertes

- Authentification membre/admin
- Statut membre (`actif`, `blocked`)
- Recherche de livres
- Consultation des livres
- Emprunt
- Retour
- Date limite de 14 jours
- Détection des retards
- Consultation des emprunts
- Modification du profil membre
- Modification du profil administrateur
- Modification du mot de passe administrateur
- Dashboard membre
- Dashboard administrateur
- Gestion des emprunts par l'administrateur
