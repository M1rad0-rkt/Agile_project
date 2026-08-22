from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_liste_livres_disponibles():
    response = client.get("/livres/disponibles")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_detail_livre_existant():
    response = client.get("/livres/2")

    assert response.status_code == 200

    data = response.json()

    assert "id_livre" in data
    assert "titre" in data
    assert "auteur" in data
    assert "categorie" in data
    assert "exemplaire" in data


def test_detail_livre_inexistant():
    response = client.get("/livres/999999")

    assert response.status_code == 404


def test_recherche_livre():
    response = client.get(
        "/livres/recherche",
        params={"q": "my"}
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)