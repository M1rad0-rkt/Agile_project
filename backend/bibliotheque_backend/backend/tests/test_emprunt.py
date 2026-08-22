from datetime import date

from fastapi.testclient import TestClient
from app.security import hash_password

from app.main import app
from app.models.membre import Membre
from app.models.livre import Livre


def obtenir_token(client: TestClient, membre: Membre):
    response = client.post(
        "/auth/login",
        data={
            "username": membre.email,
            "password": "test123"
        }
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def test_emprunter_livre(client, db):
    membre = Membre(
        nom="Test",
        prenom="Membre",
        email="test.emprunt@example.com",
        password=hash_password("test123"),
        date_inscription=date.today(),
        statut="actif"
    )

    livre = Livre(
        titre="Livre Test Emprunt",
        auteur="Auteur Test",
        categorie="Test",
        exemplaire=2
    )

    db.add(membre)
    db.add(livre)
    db.commit()

    db.refresh(membre)
    db.refresh(livre)

    token = obtenir_token(client, membre)

    response = client.post(
        "/emprunts/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "id_livre": livre.id_livre
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id_livre"] == livre.id_livre
    assert data["id_membre"] == membre.id_membre
    assert data["statut"] == "en_cours"
    assert data["date_emprunt"] == str(date.today())

    db.refresh(livre)

    assert livre.exemplaire == 1


def test_emprunter_livre_deja_emprunte(client, db):
    membre = Membre(
        nom="Test",
        prenom="Membre",
        email="test.double@example.com",
        password=hash_password("test123"),
        date_inscription=date.today(),
        statut="actif"
    )

    livre = Livre(
        titre="Livre Double Emprunt",
        auteur="Auteur Test",
        categorie="Test",
        exemplaire=2
    )

    db.add(membre)
    db.add(livre)
    db.commit()

    db.refresh(membre)
    db.refresh(livre)

    token = obtenir_token(client, membre)

    response1 = client.post(
        "/emprunts/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "id_livre": livre.id_livre
        }
    )

    assert response1.status_code == 200

    response2 = client.post(
        "/emprunts/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "id_livre": livre.id_livre
        }
    )

    assert response2.status_code == 400
    assert response2.json()["detail"] == (
        "Vous avez déjà ce livre en cours d'emprunt"
    )


def test_emprunter_livre_sans_exemplaire(client, db):
    membre = Membre(
        nom="Test",
        prenom="Membre",
        email="test.indisponible@example.com",
        password=hash_password("test123"),
        date_inscription=date.today(),
        statut="actif"
    )

    livre = Livre(
        titre="Livre Indisponible",
        auteur="Auteur Test",
        categorie="Test",
        exemplaire=0
    )

    db.add(membre)
    db.add(livre)
    db.commit()

    db.refresh(membre)
    db.refresh(livre)

    token = obtenir_token(client, membre)

    response = client.post(
        "/emprunts/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "id_livre": livre.id_livre
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "Aucun exemplaire disponible"
    )


def test_retourner_livre(client, db):
    membre = Membre(
        nom="Test",
        prenom="Membre",
        email="test.retour@example.com",
        password=hash_password("test123"),
        date_inscription=date.today(),
        statut="actif"
    )

    livre = Livre(
        titre="Livre Retour",
        auteur="Auteur Test",
        categorie="Test",
        exemplaire=2
    )

    db.add(membre)
    db.add(livre)
    db.commit()

    db.refresh(membre)
    db.refresh(livre)

    token = obtenir_token(client, membre)

    emprunt_response = client.post(
        "/emprunts/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "id_livre": livre.id_livre
        }
    )

    assert emprunt_response.status_code == 200

    emprunt = emprunt_response.json()

    response = client.post(
        f"/emprunts/{emprunt['id_emprunt']}/retour",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id_emprunt"] == emprunt["id_emprunt"]
    assert data["statut"] == "retourne"
    assert data["date_retour"] == str(date.today())

    db.refresh(livre)

    assert livre.exemplaire == 2


def test_retourner_livre_deja_retourne(client, db):
    membre = Membre(
        nom="Test",
        prenom="Membre",
        email="test.double.retour@example.com",
        password=hash_password("test123"),
        date_inscription=date.today(),
        statut="actif"
    )

    livre = Livre(
        titre="Livre Double Retour",
        auteur="Auteur Test",
        categorie="Test",
        exemplaire=1
    )

    db.add(membre)
    db.add(livre)
    db.commit()

    db.refresh(membre)
    db.refresh(livre)

    token = obtenir_token(client, membre)

    emprunt_response = client.post(
        "/emprunts/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "id_livre": livre.id_livre
        }
    )

    assert emprunt_response.status_code == 200

    id_emprunt = emprunt_response.json()["id_emprunt"]

    premier_retour = client.post(
        f"/emprunts/{id_emprunt}/retour",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert premier_retour.status_code == 200

    deuxieme_retour = client.post(
        f"/emprunts/{id_emprunt}/retour",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert deuxieme_retour.status_code == 400