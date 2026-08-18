from fastapi import FastAPI

from app.database import Base, engine
from app.models import Admin, Membre, Livre, Emprunt
from app.routers.livre import router as livre_router
from app.routers.membre import router as membre_router
from app.routers.emprunt import router as emprunt_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestion Bibliothèque API")

app.include_router(livre_router)
app.include_router(membre_router)
app.include_router(emprunt_router)


@app.get("/")
def accueil():
    return {"message": "API Gestion Bibliothèque"}