from sqlalchemy import Column, Integer, Date, ForeignKey
from app.database import Base


class Emprunt(Base):
    __tablename__ = "emprunt"

    id_emprunt = Column(Integer, primary_key=True)

    id_membre = Column(
        Integer,
        ForeignKey("membre.id_membre"),
        nullable=False
    )

    id_livre = Column(
        Integer,
        ForeignKey("livre.id_livre"),
        nullable=False
    )

    date_emprunt = Column(
        Date,
        nullable=False
    )

    date_retour = Column(
        Date,
        nullable=True
    )