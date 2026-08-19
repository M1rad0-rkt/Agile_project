from sqlalchemy.orm import Session

from app.models.membre import Membre
from app.models.admin import Admin
from app.security import verify_password


def authenticate_membre(
    db: Session,
    email: str,
    password: str
):
    membre = db.query(Membre).filter(
        Membre.email == email
    ).first()

    if not membre:
        return None

    if not verify_password(
        password,
        membre.password
    ):
        return None

    return membre


def authenticate_admin(
    db: Session,
    email: str,
    password: str
):
    admin = db.query(Admin).filter(
        Admin.email == email
    ).first()

    if not admin:
        return None

    if not verify_password(
        password,
        admin.password
    ):
        return None

    return admin