from datetime import date

from app.database import SessionLocal
from app.crud.membre import create_membre
from app.schemas.membre import MembreCreate


db = SessionLocal()

try:
    membre = MembreCreate(
        nom="Faneva",
        prenom="Faneva",
        email="faneva@faneva.com",
        password="faneva",
        date_inscription=date.today()
    )

    nouveau_membre = create_membre(db, membre)

    print("Membre créé avec succès !")
    print("ID :", nouveau_membre.id_membre)
    print("Email :", nouveau_membre.email)

finally:
    db.close()