"""
📄 Fichier: app/main.py
📝 Description: Point d'entrée principal de l'application FastAPI
🎯 Usage: Configuration CORS, routes, gestionnaires d'erreurs
"""

import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router


# ========================================
# 📋 CONFIGURATION DU LOGGING
# ========================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ========================================
# 🗄️ CRÉATION DES TABLES
# ========================================
Base.metadata.create_all(bind=engine)


# ========================================
# 🚀 CRÉATION DE L'APPLICATION FASTAPI
# ========================================
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="API de Surveillance Épidémiologique - Vakinankaratra",
    version="1.0.0"
)


# ========================================
# 🌐 CONFIGURATION CORS
# ========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================================
# ⚠️ GESTIONNAIRES D'ERREURS PERSONNALISÉS
# ========================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    🔍 Gestionnaire d'erreurs de validation Pydantic (422)
    Affiche les détails complets pour faciliter le débogage
    """
    # Logger l'erreur complète
    logger.error(f"❌ Erreur de validation sur {request.method} {request.url}")
    logger.error(f"📋 Détails de validation: {exc.errors()}")
    logger.error(f"📦 Body reçu: {exc.body}")
    
    # Formater les erreurs de manière lisible
    errors_list = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"])
        message = error["msg"]
        error_type = error["type"]
        errors_list.append({
            "field": field,
            "message": message,
            "type": error_type
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Erreur de validation des données",
            "errors": errors_list,
            "body_received": exc.body if settings.DEBUG else None  # Masquer en prod
        }
    )


@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    """
    🔐 Gestionnaire d'erreurs d'intégrité de base de données
    Gère les violations de contraintes (clés étrangères, unicité, etc.)
    """
    logger.error(f"❌ Erreur d'intégrité BD sur {request.method} {request.url}")
    logger.error(f"📋 Détails: {str(exc.orig)}")
    
    # Analyser le type d'erreur
    error_msg = str(exc.orig).lower()
    
    if "foreign key" in error_msg or "clé étrangère" in error_msg:
        detail = "Référence invalide: l'élément associé n'existe pas"
    elif "unique" in error_msg or "duplicate" in error_msg:
        detail = "Cette valeur existe déjà dans la base de données"
    elif "not null" in error_msg:
        detail = "Un champ obligatoire est manquant"
    else:
        detail = "Erreur d'intégrité de la base de données"
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": detail,
            "error_type": "IntegrityError"
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    💥 Gestionnaire d'erreurs global pour toutes les exceptions non gérées
    """
    logger.exception(f"❌ Erreur inattendue sur {request.method} {request.url}: {str(exc)}")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Une erreur interne est survenue",
            "error": str(exc) if settings.DEBUG else None  # Masquer les détails en prod
        }
    )


# ========================================
# 📡 INCLUSION DES ROUTES API
# ========================================
app.include_router(api_router, prefix=settings.API_V1_STR)


# ========================================
# 🏠 ROUTES DE BASE
# ========================================

@app.get("/")
def root():
    """
    🏠 Page d'accueil de l'API
    """
    return {
        "message": "DRSP Vakinankaratra - API de Surveillance Épidémiologique",
        "version": "1.0.0",
        "docs": f"{settings.API_V1_STR}/docs",
        "status": "operational"
    }


@app.get("/health")
def health_check():
    """
    💚 Vérification de l'état de santé de l'API
    """
    return {
        "status": "healthy",
        "service": "DRSP API",
        "version": "1.0.0"
    }
