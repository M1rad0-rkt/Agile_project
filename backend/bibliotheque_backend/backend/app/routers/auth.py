from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.auth import TokenResponse
from fastapi.security import OAuth2PasswordRequestForm
from app.crud.auth import (
    authenticate_membre,
    authenticate_admin
)
from app.security import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentification"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    membre = authenticate_membre(
        db,
        form_data.username,
        form_data.password
    )

    if membre:

        token = create_access_token({
            "sub": str(membre.id_membre),
            "email": membre.email,
            "role": "membre"
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }


    admin = authenticate_admin(
        db,
        form_data.username,
        form_data.password
    )

    if admin:

        token = create_access_token({
            "sub": str(admin.id_admin),
            "email": admin.email,
            "role": "admin"
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }


    raise HTTPException(
        status_code=401,
        detail="Email ou mot de passe incorrect"
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }