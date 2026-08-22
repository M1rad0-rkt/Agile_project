from datetime import date
from pydantic import BaseModel


class EmpruntCreate(BaseModel):
    id_livre: int


class LivreInfo(BaseModel):
    id_livre: int
    titre: str
    auteur: str

    class Config:
        from_attributes = True


class EmpruntResponse(BaseModel):
    id_emprunt: int
    id_membre: int
    id_livre: int
    date_emprunt: date
    date_retour: date | None = None
    date_limite: date          # ← ligne ajoutée
    statut: str
    livre: LivreInfo           # ← ligne ajoutée

    class Config:
        from_attributes = True