from fastapi import APIRouter, Depends

from app.security import require_admin


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