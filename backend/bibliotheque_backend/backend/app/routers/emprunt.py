from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.emprunt import (
    create_emprunt,
    get_mes_emprunts,
    retourner_emprunt,
    get_tous_les_emprunts
)

from app.schemas.emprunt import (
    EmpruntCreate,
    EmpruntResponse
)
from app.security import (
    get_current_membre,
    get_db,
    require_admin
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


@router.get("/mes-emprunts",response_model=list[EmpruntResponse])

def mes_emprunts(
    db: Session = Depends(get_db),
    membre=Depends(get_current_membre)
):
    
    return get_mes_emprunts(
        db,
        membre.id_membre
    )

@router.post("/{id_emprunt}/retour",response_model=EmpruntResponse)
def retour_livre(
    id_emprunt: int,
    db: Session = Depends(get_db),
    membre=Depends(get_current_membre)
):
    return retourner_emprunt(
        db,
        id_emprunt,
        membre.id_membre
    )


@router.get("/",response_model=list[EmpruntResponse])
def tous_les_emprunts(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return get_tous_les_emprunts(db)

