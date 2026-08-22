from datetime import date

from app.models.admin import Admin
from app.models.membre import Membre
from app.security import hash_password


def obtenir_token_admin(client, email="admin.test@example.com", password="admin123"):
    response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": password
        }
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def creer_admin(db):
    admin = Admin(
        nom="Admin Test",
        email="admin.test@example.com",
        password=hash_password("admin123")
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return admin


def creer_membre(db):
    membre = Membre(
        nom="Membre",
        prenom="Test",
        email="membre.test@example.com",
        password=hash_password("test123"),
        date_inscription=date.today(),
        statut="actif"
    )

    db.add(membre)
    db.commit()
    db.refresh(membre)

    return membre


def obtenir_token_membre(client, email="membre.test@example.com"):
    response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": "test123"
        }
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def test_admin_acces_autorise(client, db):
    creer_admin(db)

    token = obtenir_token_admin(client)

    response = client.get(
        "/admin/test",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Accès administrateur autorisé"


def test_admin_acces_sans_token(client):
    response = client.get("/admin/test")

    assert response.status_code == 401


def test_admin_acces_par_membre_interdit(client, db):
    creer_membre(db)

    token = obtenir_token_membre(client)

    response = client.get(
        "/admin/test",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 403


def test_modifier_profil_admin(client, db):
    creer_admin(db)

    token = obtenir_token_admin(client)

    response = client.patch(
        "/admin/me",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "nom": "Admin Modifie",
            "email": "admin.modifie@example.com"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["nom"] == "Admin Modifie"
    assert data["email"] == "admin.modifie@example.com"


def test_modifier_mot_de_passe_admin(client, db):
    creer_admin(db)

    token = obtenir_token_admin(client)

    response = client.patch(
        "/admin/me/password",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "ancien_password": "admin123",
            "nouveau_password": "nouveau123"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Mot de passe modifié avec succès"

    # Vérifier que l'ancien mot de passe ne fonctionne plus
    ancien_login = client.post(
        "/auth/login",
        data={
            "username": "admin.test@example.com",
            "password": "admin123"
        }
    )

    assert ancien_login.status_code == 401

    # Vérifier que le nouveau mot de passe fonctionne
    nouveau_login = client.post(
        "/auth/login",
        data={
            "username": "admin.test@example.com",
            "password": "nouveau123"
        }
    )

    assert nouveau_login.status_code == 200


def test_modifier_mot_de_passe_admin_ancien_incorrect(client, db):
    creer_admin(db)

    token = obtenir_token_admin(client)

    response = client.patch(
        "/admin/me/password",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "ancien_password": "mauvais",
            "nouveau_password": "nouveau123"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Ancien mot de passe incorrect"


def test_dashboard_admin(client, db):
    creer_admin(db)

    token = obtenir_token_admin(client)

    response = client.get(
        "/admin/dashboard",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "total_membres" in data
    assert "total_livres" in data
    assert "livres_disponibles" in data
    assert "total_emprunts" in data
    assert "emprunts_en_cours" in data
    assert "emprunts_en_retard" in data
    assert "dernier_emprunt" in data