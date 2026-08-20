from sqlalchemy.orm import Session
from app.security import hash_password
from fastapi import HTTPException

from app.models.membre import Membre
from app.schemas.membre import MembreCreate, MembreUpdate


def create_membre(db: Session, membre: MembreCreate):

    nouveau_membre = Membre(
        nom=membre.nom,
        prenom=membre.prenom,
        email=membre.email,
        password=hash_password(membre.password),
        date_inscription=membre.date_inscription
    )

    db.add(nouveau_membre)
    db.commit()
    db.refresh(nouveau_membre)

    return nouveau_membre


def get_membres(db: Session):
    return db.query(Membre).all()


def get_membre(db: Session, id_membre: int):
    return db.query(Membre).filter(
        Membre.id_membre == id_membre
    ).first()


def update_membre(
    db: Session,
    id_membre: int,
    membre_data: MembreUpdate
):
    membre = get_membre(db, id_membre)

    if not membre:
        return None

    if membre_data.nom is not None:
        membre.nom = membre_data.nom

    if membre_data.prenom is not None:
        membre.prenom = membre_data.prenom

    if membre_data.email is not None:
        membre.email = membre_data.email

    if membre_data.password is not None:
        membre.password = membre_data.password

    if membre_data.date_inscription is not None:
        membre.date_inscription = membre_data.date_inscription

    db.commit()
    db.refresh(membre)

    return membre


def delete_membre(db: Session, id_membre: int):
    membre = get_membre(db, id_membre)

    if membre:
        db.delete(membre)
        db.commit()

    return membre


def changer_statut_membre(
    db: Session,
    id_membre: int,
    statut: str
):
    membre = db.query(Membre).filter(
        Membre.id_membre == id_membre
    ).first()

    if membre is None:
        raise HTTPException(
            status_code=404,
            detail="Membre non trouvé"
        )

    if statut not in ["actif", "bloque"]:
        raise HTTPException(
            status_code=400,
            detail="Statut invalide. Utilisez 'actif' ou 'bloque'"
        )

    membre.statut = statut

    db.commit()
    db.refresh(membre)

    return membre