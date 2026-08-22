from pydantic import BaseModel

class AdminUpdate(BaseModel):
    nom: str | None = None
    email: str | None = None


class AdminResponse(BaseModel):
    id_admin: int
    nom: str
    email: str

    class Config:
        from_attributes = True


class AdminPasswordUpdate(BaseModel):
    ancien_password: str
    nouveau_password: str