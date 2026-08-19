from sqlalchemy import Column, Integer, String

from app.database import Base


class Livre(Base):
    __tablename__ = "livre"

    id_livre = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    auteur = Column(String, nullable=False)
    categorie = Column(String)
    exemplaire = Column(Integer, nullable=False)