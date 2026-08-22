from pydantic import BaseModel
from datetime import date


class MembreCreate(BaseModel):
    nom: str
    prenom: str
    email: str
    password: str
    date_inscription: date


class MembreUpdate(BaseModel):
    nom: str | None = None
    prenom: str | None = None
    email: str | None = None
    password: str | None = None
    date_inscription: date | None = None


class MembreResponse(BaseModel):
    id_membre: int
    nom: str
    prenom: str
    email: str
    date_inscription: date
    statut: str

    class Config:
        from_attributes = True


class MembreStatut(BaseModel):
    statut: str

class MembreUpdate(BaseModel):
    nom: str | None = None
    prenom: str | None = None
    email: str | None = None

class MembrePasswordUpdate(BaseModel):
    ancien_password: str
    nouveau_password: str