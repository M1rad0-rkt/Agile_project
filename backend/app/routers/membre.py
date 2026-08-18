from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.membre import (
    MembreCreate,
    MembreUpdate,
    MembreResponse
)

from app.crud.membre import (
    create_membre,
    get_membres,
    get_membre,
    update_membre,
    delete_membre
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


@router.post("/", response_model=MembreResponse)
def ajouter_membre(
    membre: MembreCreate,
    db: Session = Depends(get_db)
):
    return create_membre(db, membre)


@router.get("/", response_model=list[MembreResponse])
def liste_membres(
    db: Session = Depends(get_db)
):
    return get_membres(db)


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


@router.put("/{id_membre}", response_model=MembreResponse)
def modifier_membre(
    id_membre: int,
    membre_data: MembreUpdate,
    db: Session = Depends(get_db)
):
    membre = update_membre(
        db,
        id_membre,
        membre_data
    )

    if not membre:
        raise HTTPException(
            status_code=404,
            detail="Membre introuvable"
        )

    return membre


@router.delete("/{id_membre}")
def supprimer_membre(
    id_membre: int,
    db: Session = Depends(get_db)
):
    membre = delete_membre(db, id_membre)

    if not membre:
        raise HTTPException(
            status_code=404,
            detail="Membre introuvable"
        )

    return {"message": "Membre supprimé"}