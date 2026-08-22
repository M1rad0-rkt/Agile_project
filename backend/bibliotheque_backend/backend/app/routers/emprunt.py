from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.emprunt import create_emprunt, get_emprunts_membre
from app.schemas.emprunt import (
    EmpruntCreate,
    EmpruntResponse
)
from app.security import (
    get_current_membre,
    get_db
)


router = APIRouter(
    prefix="/emprunts",
    tags=["Emprunts"]
)


@router.post(
    "/",
    response_model=EmpruntResponse
)
def emprunter_livre(
    emprunt: EmpruntCreate,
    db: Session = Depends(get_db),
    membre=Depends(get_current_membre)
):

    return create_emprunt(
        db,
        membre.id_membre,
        emprunt.id_livre
    )

@router.get("/mes-emprunts", response_model=list[EmpruntResponse])
def mes_emprunts(
    db: Session = Depends(get_db),
    membre=Depends(get_current_membre)
):
    return get_emprunts_membre(db, membre.id_membre)