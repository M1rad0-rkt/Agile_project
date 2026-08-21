from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Admin, Membre, Livre, Emprunt
from app.routers.livre import router as livre_router
from app.routers.membre import router as membre_router
from app.routers.emprunt import router as emprunt_router
from app.routers.auth import router as auth_router
from app.routers.admin import router as admin_router
from app.database import SessionLocal
from app.crud.admin import create_default_admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestion Bibliothèque API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(livre_router)
app.include_router(membre_router)
app.include_router(emprunt_router)
app.include_router(auth_router)
app.include_router(admin_router)

@app.on_event("startup")
def startup():
    db = SessionLocal()

    try:
        create_default_admin(db)
    finally:
        db.close()

@app.get("/")
def accueil():
    return {"message": "API Gestion Bibliothèque"}