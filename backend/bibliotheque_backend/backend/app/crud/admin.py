from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.admin import Admin
from app.security import hash_password,verify_password


def create_default_admin(db: Session):

    admin = db.query(Admin).filter(
        Admin.email == "admin@admin.com"
    ).first()

    if admin:
        return admin

    admin = Admin(
        nom="Admin",
        email="admin@admin.com",
        password=hash_password("admin")
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return admin


def modifier_profil_admin(
    db: Session,
    admin,
    data
):
    admin_db = db.query(Admin).filter(
        Admin.id_admin == int(admin["sub"])
    ).first()

    if admin_db is None:
        raise HTTPException(
            status_code=404,
            detail="Admin non trouvé"
        )

    if data.nom is not None:
        admin_db.nom = data.nom

    if data.email is not None:
        admin_db.email = data.email

    db.commit()
    db.refresh(admin_db)

    return admin_db


def get_dashboard_admin(db: Session):
    from app.models.membre import Membre
    from app.models.livre import Livre
    from app.models.emprunt import Emprunt

    total_membres = db.query(Membre).count()
    total_livres = db.query(Livre).count()

    livres_disponibles = db.query(Livre).filter(
        Livre.exemplaire > 0
    ).count()

    total_emprunts = db.query(Emprunt).count()

    emprunts_en_cours = db.query(Emprunt).filter(
        Emprunt.statut == "en_cours"
    ).count()

    emprunts_en_retard = db.query(Emprunt).filter(
        Emprunt.statut == "en_retard"
    ).count()

    return {
        "total_membres": total_membres,
        "total_livres": total_livres,
        "livres_disponibles": livres_disponibles,
        "total_emprunts": total_emprunts,
        "emprunts_en_cours": emprunts_en_cours,
        "emprunts_en_retard": emprunts_en_retard
    }


def modifier_mot_de_passe_admin(
    db: Session,
    admin,
    data
):
    admin_db = db.query(Admin).filter(
        Admin.id_admin == int(admin["sub"])
    ).first()

    if admin_db is None:
        raise HTTPException(
            status_code=404,
            detail="Admin non trouvé"
        )

    if not verify_password(
        data.ancien_password,
        admin_db.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Ancien mot de passe incorrect"
        )

    admin_db.password = hash_password(data.nouveau_password)

    db.commit()

    return {
        "message": "Mot de passe modifié avec succès"
    }