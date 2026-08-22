from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.emprunt import Emprunt
from app.models.livre import Livre


def create_emprunt(db: Session, id_membre: int, id_livre: int):
    livre = db.query(Livre).filter(Livre.id_livre == id_livre).first()

    if not livre:
        raise HTTPException(status_code=404, detail="Livre introuvable")

    if livre.exemplaire <= 0:
        raise HTTPException(status_code=400, detail="Aucun exemplaire disponible pour ce livre")

    livre.exemplaire -= 1  

    emprunt = Emprunt(
        id_membre=id_membre,
        id_livre=id_livre,
        date_emprunt=date.today(),
        statut="en cours"
    )

    db.add(emprunt)
    db.commit()
    db.refresh(emprunt)

    return emprunt

def get_emprunts_membre(db: Session, id_membre: int):
    return db.query(Emprunt).filter(
        Emprunt.id_membre == id_membre,
        Emprunt.statut == "en cours"
    ).all()