from sqlalchemy.orm import Session

from app.models.emprunt import Emprunt
from app.schemas.emprunt import EmpruntCreate, EmpruntUpdate


def create_emprunt(db: Session, emprunt_data: EmpruntCreate):
    nouvel_emprunt = Emprunt(
        id_membre=emprunt_data.id_membre,
        id_livre=emprunt_data.id_livre,
        date_emprunt=emprunt_data.date_emprunt,
        date_retour=emprunt_data.date_retour,
        statut=emprunt_data.statut
    )

    db.add(nouvel_emprunt)
    db.commit()
    db.refresh(nouvel_emprunt)

    return nouvel_emprunt


def get_emprunts(db: Session):
    return db.query(Emprunt).all()


def get_emprunt(db: Session, id_emprunt: int):
    return db.query(Emprunt).filter(
        Emprunt.id_emprunt == id_emprunt
    ).first()


def update_emprunt(
    db: Session,
    id_emprunt: int,
    emprunt_data: EmpruntUpdate
):
    emprunt = get_emprunt(db, id_emprunt)

    if not emprunt:
        return None

    if emprunt_data.date_retour is not None:
        emprunt.date_retour = emprunt_data.date_retour

    if emprunt_data.statut is not None:
        emprunt.statut = emprunt_data.statut

    db.commit()
    db.refresh(emprunt)

    return emprunt


def delete_emprunt(db: Session, id_emprunt: int):
    emprunt = get_emprunt(db, id_emprunt)

    if emprunt:
        db.delete(emprunt)
        db.commit()

    return emprunt