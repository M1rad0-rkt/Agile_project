from sqlalchemy import Column, Integer, String, Date

from app.database import Base


class Membre(Base):
    __tablename__ = "membre"

    id_membre = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    date_inscription = Column(Date, nullable=False)
    statut = Column(String,nullable=False,default="actif")