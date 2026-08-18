from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.emprunt import (
    EmpruntCreate,
    EmpruntUpdate,
    EmpruntResponse
)

from app.crud.emprunt import (
    create_emprunt,
    get_emprunts,
    get_emprunt,
    update_emprunt,
    delete_emprunt
)


router = APIRouter(
    prefix="/emprunts",
    tags=["Emprunts"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=EmpruntResponse)
def ajouter_emprunt(
    emprunt: EmpruntCreate,
    db: Session = Depends(get_db)
):
    return create_emprunt(db, emprunt)


@router.get("/", response_model=list[EmpruntResponse])
def liste_emprunts(
    db: Session = Depends(get_db)
):
    return get_emprunts(db)


@router.get("/{id_emprunt}", response_model=EmpruntResponse)
def detail_emprunt(
    id_emprunt: int,
    db: Session = Depends(get_db)
):
    emprunt = get_emprunt(db, id_emprunt)

    if not emprunt:
        raise HTTPException(
            status_code=404,
            detail="Emprunt introuvable"
        )

    return emprunt


@router.put("/{id_emprunt}", response_model=EmpruntResponse)
def modifier_emprunt(
    id_emprunt: int,
    emprunt_data: EmpruntUpdate,
    db: Session = Depends(get_db)
):
    emprunt = update_emprunt(
        db,
        id_emprunt,
        emprunt_data
    )

    if not emprunt:
        raise HTTPException(
            status_code=404,
            detail="Emprunt introuvable"
        )

    return emprunt


@router.delete("/{id_emprunt}")
def supprimer_emprunt(
    id_emprunt: int,
    db: Session = Depends(get_db)
):
    emprunt = delete_emprunt(db, id_emprunt)

    if not emprunt:
        raise HTTPException(
            status_code=404,
            detail="Emprunt introuvable"
        )

    return {"message": "Emprunt supprimé"}