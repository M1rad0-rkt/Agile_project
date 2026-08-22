from sqlalchemy.orm import Session
from app.security import hash_password
from fastapi import HTTPException
from app.security import verify_password, hash_password

from app.models.membre import Membre
from app.schemas.membre import MembreCreate, MembreUpdate
from app.crud.emprunt import get_mes_emprunts


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


def modifier_profil(
    db: Session,
    membre,
    donnees
):
    membre_db = db.query(Membre).filter(
        Membre.id_membre == membre.id_membre
    ).first()

    if membre_db is None:
        raise HTTPException(
            status_code=404,
            detail="Membre non trouvé"
        )

    if donnees.nom is not None:
        membre_db.nom = donnees.nom

    if donnees.prenom is not None:
        membre_db.prenom = donnees.prenom

    if donnees.email is not None:
        membre_db.email = donnees.email

    db.commit()
    db.refresh(membre_db)

    return membre_db


def changer_password(
    db: Session,
    membre,
    donnees
):
    membre_db = db.query(Membre).filter(
        Membre.id_membre == membre.id_membre
    ).first()

    if membre_db is None:
        raise HTTPException(
            status_code=404,
            detail="Membre non trouvé"
        )

    if not verify_password(
        donnees.ancien_password,
        membre_db.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Ancien mot de passe incorrect"
        )

    membre_db.password = hash_password(
        donnees.nouveau_password
    )

    db.commit()

    return {
        "message": "Mot de passe modifié avec succès"
    }


def get_dashboard_membre(
    db: Session,
    id_membre: int
):
    emprunts = get_mes_emprunts(db, id_membre)

    dernier_emprunt = None

    if emprunts:
        dernier_emprunt = max(
            emprunts,
            key=lambda e: e.date_emprunt
        )

    return {
        "total_emprunts": len(emprunts),

        "emprunts_en_cours": sum(
            1 for e in emprunts
            if e.statut == "en_cours"
        ),

        "emprunts_en_retard": sum(
            1 for e in emprunts
            if e.statut == "en_retard"
        ),

        "livres_retournes": sum(
            1 for e in emprunts
            if e.statut == "retourne"
        ),

        "dernier_emprunt": (
            {
                "id_emprunt": dernier_emprunt.id_emprunt,
                "id_livre": dernier_emprunt.id_livre,
                "date_emprunt": dernier_emprunt.date_emprunt,
                "date_limite": dernier_emprunt.date_limite,
                "date_retour": dernier_emprunt.date_retour,
                "statut": dernier_emprunt.statut
            }
            if dernier_emprunt
            else None
        )
    }