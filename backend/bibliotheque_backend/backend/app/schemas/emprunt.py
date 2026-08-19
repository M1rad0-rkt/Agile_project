from datetime import date

from pydantic import BaseModel


class EmpruntCreate(BaseModel):
    id_livre: int


class EmpruntResponse(BaseModel):
    id_emprunt: int
    id_membre: int
    id_livre: int
    date_emprunt: date
    date_retour: date | None = None

    class Config:
        from_attributes = True