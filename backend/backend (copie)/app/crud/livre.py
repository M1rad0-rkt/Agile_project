from sqlalchemy.orm import Session

from app.models.livre import Livre
from app.schemas.livre import LivreCreate, LivreUpdate


def create_livre(db: Session, livre: LivreCreate):
    nouveau_livre = Livre(
        titre=livre.titre,
        auteur=livre.auteur,
        categorie=livre.categorie,
        exemplaire=livre.exemplaire
    )

    db.add(nouveau_livre)
    db.commit()
    db.refresh(nouveau_livre)

    return nouveau_livre


def get_livres(db: Session):
    return db.query(Livre).all()


def get_livre(db: Session, id_livre: int):
    return db.query(Livre).filter(
        Livre.id_livre == id_livre
    ).first()


def delete_livre(db: Session, id_livre: int):
    livre = get_livre(db, id_livre)

    if livre:
        db.delete(livre)
        db.commit()

    return livre

def update_livre(db: Session, id_livre: int, livre_data: LivreUpdate):
    livre = get_livre(db, id_livre)

    if not livre:
        return None

    if livre_data.titre is not None:
        livre.titre = livre_data.titre

    if livre_data.auteur is not None:
        livre.auteur = livre_data.auteur

    if livre_data.categorie is not None:
        livre.categorie = livre_data.categorie

    if livre_data.exemplaire is not None:
        livre.exemplaire = livre_data.exemplaire

    db.commit()
    db.refresh(livre)

    return livre