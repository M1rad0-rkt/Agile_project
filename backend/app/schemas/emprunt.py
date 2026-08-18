from pydantic import BaseModel
from datetime import date


class EmpruntCreate(BaseModel):
    id_membre: int
    id_livre: int
    date_emprunt: date
    date_retour: date | None = None
    statut: str = "EN_COURS"


class EmpruntUpdate(BaseModel):
    date_retour: date | None = None
    statut: str | None = None


class EmpruntResponse(BaseModel):
    id_emprunt: int
    id_membre: int
    id_livre: int
    date_emprunt: date
    date_retour: date | None
    statut: str

    class Config:
        from_attributes = True