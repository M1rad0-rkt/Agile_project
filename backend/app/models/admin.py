from sqlalchemy import Column, Integer, String

from app.database import Base


class Admin(Base):
    __tablename__ = "admin"

    id_admin = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)