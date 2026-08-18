from pydantic import BaseModel


class LivreCreate(BaseModel):
    titre: str
    auteur: str
    categorie: str | None = None
    exemplaire: int

class LivreUpdate(BaseModel):
    titre: str | None = None
    auteur: str | None = None
    categorie: str | None = None
    exemplaire: int | None = None


class LivreResponse(LivreCreate):
    id_livre: int

    class Config:
        from_attributes = True