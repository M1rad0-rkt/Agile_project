from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_login_membre_success():
    response = client.post(
        "/auth/login",
        data={
            "username": "myemail@gmail.com",
            "password": "string"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_membre_mauvais_mot_de_passe():
    response = client.post(
        "/auth/login",
        data={
            "username": "myemail@gmail.com",
            "password": "Strings"
        }
    )

    assert response.status_code == 401


def test_login_membre_inexistant():
    response = client.post(
        "/auth/login",
        data={
            "username": "myemail@test.com",
            "password": "faux_mdp_test"
        }
    )

    assert response.status_code == 401