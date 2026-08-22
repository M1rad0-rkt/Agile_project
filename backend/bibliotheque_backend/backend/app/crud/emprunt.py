# app/crud/emprunt.py

from datetime import date
from datetime import timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.emprunt import Emprunt
from app.models.livre import Livre


def create_emprunt(
    db: Session,
    id_membre: int,
    id_livre: int
):
    # Vérifier que le livre existe
    livre = db.query(Livre).filter(
        Livre.id_livre == id_livre
    ).first()

    if livre is None:
        raise HTTPException(
            status_code=404,
            detail="Livre non trouvé"
        )

    # Vérifier qu'il reste un exemplaire
    if livre.exemplaire <= 0:
        raise HTTPException(
            status_code=400,
            detail="Aucun exemplaire disponible"
        )

    # Créer l'emprunt
    emprunt = Emprunt(
        id_membre=id_membre,
        id_livre=id_livre,
        date_emprunt=date.today(),
        date_limite=date.today() + timedelta(days=14),
        statut="en_cours"
    )

    emprunt_existant = db.query(Emprunt).filter(
        Emprunt.id_membre == id_membre,
        Emprunt.id_livre == id_livre,
        Emprunt.statut == "en_cours"
    ).first()

    if emprunt_existant:
        raise HTTPException(
            status_code=400,
            detail="Vous avez déjà ce livre en cours d'emprunt"
        )

    # Décrémenter le nombre d'exemplaires
    livre.exemplaire -= 1

    db.add(emprunt)
    db.commit()
    db.refresh(emprunt)

    return emprunt



def get_mes_emprunts(
    db: Session,
    id_membre: int
):
    emprunts = db.query(Emprunt).filter(
        Emprunt.id_membre == id_membre
    ).all()

    for emprunt in emprunts:
        mettre_a_jour_statut(emprunt)

    db.commit()

    return emprunts


def retourner_emprunt(
    db: Session,
    id_emprunt: int,
    id_membre: int
):
    emprunt = db.query(Emprunt).filter(
        Emprunt.id_emprunt == id_emprunt,
        Emprunt.id_membre == id_membre
    ).first()

    if emprunt is None:
        raise HTTPException(
            status_code=404,
            detail="Emprunt non trouvé"
        )

    if emprunt.statut == "retourne":
        raise HTTPException(
            status_code=400,
            detail="Ce livre a déjà été retourné"
        )

    livre = db.query(Livre).filter(
        Livre.id_livre == emprunt.id_livre
    ).first()

    if livre is None:
        raise HTTPException(
            status_code=404,
            detail="Livre associé introuvable"
        )

    emprunt.date_retour = date.today()
    emprunt.statut = "retourne"

    livre.exemplaire += 1

    db.commit()
    db.refresh(emprunt)

    return emprunt


def get_tous_les_emprunts(db: Session):
    emprunts = db.query(Emprunt).all()

    for emprunt in emprunts:
        mettre_a_jour_statut(emprunt)

    db.commit()

    return emprunts


def mettre_a_jour_statut(emprunt):
    if (
        emprunt.statut == "en_cours"
        and emprunt.date_limite < date.today()
    ):
        emprunt.statut = "en_retard"

    return emprunt

