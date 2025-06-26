### app/main.py
from fastapi import FastAPI
from app.core.config import add_cors
from app.api.routes import router
from app.core.database import engine, Base

app = FastAPI()

add_cors(app)

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/api")