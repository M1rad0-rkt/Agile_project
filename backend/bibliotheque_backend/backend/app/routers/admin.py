from fastapi import APIRouter, Depends

from app.schemas.admin import AdminUpdate, AdminResponse , AdminPasswordUpdate
from app.crud.admin import modifier_profil_admin,get_dashboard_admin,modifier_mot_de_passe_admin
from sqlalchemy.orm import Session
from app.security import (
    get_db,
    require_admin
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/test")
def test_admin(
    admin=Depends(require_admin)
):
    return {
        "message": "Accès administrateur autorisé",
        "admin": admin
    }


@router.get("/dashboard")
def dashboard_admin(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return get_dashboard_admin(db)


@router.patch(
    "/me",
    response_model=AdminResponse
)
def modifier_mon_profil_admin(
    donnees: AdminUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return modifier_profil_admin(
        db,
        admin,
        donnees
    )


@router.patch("/me/password")
def modifier_mot_de_passe(
    data: AdminPasswordUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return modifier_mot_de_passe_admin(
        db,
        admin,
        data
    )