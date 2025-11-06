# app/api/v1/router.py
from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    districts,
    centres_sante,
    maladies,
    cas,
    alertes,
    interventions,
    dashboard,
    cartographie,
    statistiques,
    rapports,
    export
)

api_router = APIRouter()

# Authentification
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentification"]
)

# Utilisateurs
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Utilisateurs"]
)

# Référentiels
api_router.include_router(
    districts.router,
    prefix="/districts",
    tags=["Districts"]
)

api_router.include_router(
    centres_sante.router,
    prefix="/centres-sante",
    tags=["Centres de Santé"]
)

api_router.include_router(
    maladies.router,
    prefix="/maladies",
    tags=["Maladies"]
)

# Cas
api_router.include_router(
    cas.router,
    prefix="/cas",
    tags=["Cas"]
)

# Alertes
api_router.include_router(
    alertes.router,
    prefix="/alertes",
    tags=["Alertes"]
)

# Interventions
api_router.include_router(
    interventions.router,
    prefix="/interventions",
    tags=["Interventions"]
)

# Dashboard
api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

# Cartographie
api_router.include_router(
    cartographie.router,
    prefix="/cartographie",
    tags=["Cartographie"]
)

# Statistiques avancées
api_router.include_router(
    statistiques.router,
    prefix="/statistiques",
    tags=["Statistiques"]
)

# Rapports PDF
api_router.include_router(
    rapports.router,
    prefix="/rapports",
    tags=["Rapports"]
)

# Export Excel/CSV
api_router.include_router(
    export.router,
    prefix="/export",
    tags=["Export"]
)