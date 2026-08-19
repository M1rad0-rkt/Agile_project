from datetime import date

from sqlalchemy.orm import Session

from app.models.emprunt import Emprunt


def create_emprunt(
    db: Session,
    id_membre: int,
    id_livre: int
):

    emprunt = Emprunt(
        id_membre=id_membre,
        id_livre=id_livre,
        date_emprunt=date.today()
    )

    db.add(emprunt)
    db.commit()
    db.refresh(emprunt)

    return emprunt