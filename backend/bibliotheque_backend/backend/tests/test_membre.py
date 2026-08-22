from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def obtenir_token():
    response = client.post(
        "/auth/login",
        data={
            "username": "myemail@gmail.com",
            "password": "string"
        }
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def test_get_mon_profil():
    token = obtenir_token()

    response = client.get(
        "/membres/me",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "id_membre" in data
    assert "nom" in data
    assert "prenom" in data
    assert "email" in data
    assert "statut" in data
    assert "date_inscription" in data


def test_get_mon_profil_sans_token():
    response = client.get("/membres/me")

    assert response.status_code == 401


def test_modifier_mon_profil():
    token = obtenir_token()

    response = client.patch(
        "/membres/me",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "nom": "NobbyTest",
            "prenom": "AZ"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["nom"] == "NobbyTest"
    assert data["prenom"] == "AZ"


def test_modifier_mon_profil_sans_token():
    response = client.patch(
        "/membres/me",
        json={
            "nom": "Test"
        }
    )

    assert response.status_code == 401