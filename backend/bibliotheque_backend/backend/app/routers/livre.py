from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.livre import LivreCreate, LivreUpdate, LivreResponse
from app.security import require_admin
from app.crud.livre import (
    create_livre,
    get_livres,
    get_livre,
    delete_livre,
    update_livre,
    rechercher_livres,
    get_livres_disponibles
)

router = APIRouter(
    prefix="/livres",
    tags=["Livres"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def ajouter_livre(
    livre: LivreCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return create_livre(db, livre)

@router.get("/", response_model=list[LivreResponse])
def liste_livres(
    db: Session = Depends(get_db)
):
    return get_livres(db)


@router.get("/recherche")
def rechercher(
    q: str,
    db: Session = Depends(get_db)
):
    return rechercher_livres(db, q)


@router.get("/disponibles")
def livres_disponibles(
    db: Session = Depends(get_db)
):
    return get_livres_disponibles(db)


@router.get("/{id_livre}", response_model=LivreResponse)
def detail_livre(
    id_livre: int,
    db: Session = Depends(get_db)
):
    livre = get_livre(db, id_livre)

    if not livre:
        raise HTTPException(
            status_code=404,
            detail="Livre introuvable"
        )

    return livre


@router.delete("/{id_livre}")
def supprimer_livre(
    id_livre: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return delete_livre(db, id_livre)


@router.put("/{id_livre}")
def modifier_livre(
    id_livre: int,
    livre: LivreUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return update_livre(db, id_livre, livre)