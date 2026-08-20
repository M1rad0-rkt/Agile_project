from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.security import (
    get_current_membre,
    require_admin
)

from app.schemas.membre import (
    MembreCreate,
    MembreUpdate,
    MembreResponse,
    MembreStatut
)

from app.crud.membre import (
    create_membre,
    get_membres,
    get_membre,
    update_membre,
    delete_membre,
    changer_statut_membre
)


router = APIRouter(
    prefix="/membres",
    tags=["Membres"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def ajouter_membre(
    membre: MembreCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return create_membre(db, membre)


@router.get("/")
def liste_membres(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return get_membres(db)


@router.get("/me", response_model=MembreResponse)
def mon_profil(
    membre=Depends(get_current_membre)
):
    return membre


@router.put("/{id_membre}")
def modifier_membre(
    id_membre: int,
    membre: MembreUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return update_membre(
        db,
        id_membre,
        membre
    )


@router.delete("/{id_membre}")
def supprimer_membre(
    id_membre: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return delete_membre(
        db,
        id_membre
    )

@router.get("/{id_membre}", response_model=MembreResponse)
def detail_membre(
    id_membre: int,
    db: Session = Depends(get_db)
):
    membre = get_membre(db, id_membre)

    if not membre:
        raise HTTPException(
            status_code=404,
            detail="Membre introuvable"
        )

    return membre


@router.patch("/{id_membre}/statut")
def modifier_statut(
    id_membre: int,
    data: MembreStatut,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return changer_statut_membre(
        db,
        id_membre,
        data.statut
    )