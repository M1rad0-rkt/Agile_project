from sqlalchemy.orm import Session

from app.models.admin import Admin
from app.security import hash_password


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