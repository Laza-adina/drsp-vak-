"""
📄 Fichier: app/api/v1/endpoints/cartographie.py
📝 Description: Endpoints pour la cartographie interactive
🎯 Usage: Marqueurs, heatmap, choroplèthe, détection de clusters
"""

from typing import List, Dict, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.services.cartographie_service import carto_service
from app.models.user import User

router = APIRouter()


@router.get("/markers", response_model=List[Dict])
def get_cas_markers(
    maladie_id: Optional[int] = Query(None, description="Filtrer par maladie"),
    district_id: Optional[int] = Query(None, description="Filtrer par district"),
    date_debut: Optional[date] = Query(None, description="Date de début"),
    date_fin: Optional[date] = Query(None, description="Date de fin"),
    limit: int = Query(1000, le=5000, description="Nombre maximum de marqueurs"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    📍 Récupère les cas avec coordonnées GPS pour affichage sur carte
    
    Retourne une liste de marqueurs avec position GPS, informations du cas,
    et métadonnées pour affichage sur carte interactive (Leaflet, Google Maps, etc.)
    """
    markers = carto_service.get_cas_markers(
        db=db,
        maladie_id=maladie_id,
        district_id=district_id,
        date_debut=date_debut,
        date_fin=date_fin,
        limit=limit
    )
    return markers


@router.get("/districts", response_model=List[Dict])
def get_districts_choropleth(
    maladie_id: Optional[int] = Query(None, description="Filtrer par maladie"),
    date_debut: Optional[date] = Query(None, description="Date de début"),
    date_fin: Optional[date] = Query(None, description="Date de fin"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🗺️ Données pour carte choroplèthe (districts colorés selon nombre de cas)
    
    Retourne pour chaque district : nombre de cas, taux d'incidence,
    couleur à appliquer selon l'intensité épidémiologique.
    """
    districts = carto_service.get_districts_choropleth(
        db=db,
        maladie_id=maladie_id,
        date_debut=date_debut,
        date_fin=date_fin
    )
    return districts


@router.get("/centres-sante", response_model=List[Dict])
def get_centres_sante_markers(
    district_id: Optional[int] = Query(None, description="Filtrer par district"),
    avec_laboratoire: Optional[bool] = Query(None, description="Centres avec laboratoire uniquement"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🏥 Récupère les centres de santé pour affichage sur carte
    
    Retourne les centres de santé avec leurs coordonnées GPS,
    capacités (laboratoire, hospitalisation), et nombre de cas traités.
    """
    centres = carto_service.get_centres_sante_markers(
        db=db,
        district_id=district_id,
        avec_laboratoire=avec_laboratoire
    )
    return centres


@router.get("/heatmap", response_model=List[List[float]])
def get_heatmap_data(
    maladie_id: Optional[int] = Query(None, description="Filtrer par maladie"),
    district_id: Optional[int] = Query(None, description="Filtrer par district"),
    date_debut: Optional[date] = Query(None, description="Date de début"),
    date_fin: Optional[date] = Query(None, description="Date de fin"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🔥 Données pour heatmap (carte de chaleur)
    
    Format de retour : [[latitude, longitude, intensité], ...]
    L'intensité représente la concentration de cas dans la zone.
    Compatible avec Leaflet.heat, Google Maps Heatmap Layer, etc.
    """
    heatmap = carto_service.get_heatmap_data(
        db=db,
        maladie_id=maladie_id,
        district_id=district_id,
        date_debut=date_debut,
        date_fin=date_fin
    )
    return heatmap


@router.get("/clusters", response_model=List[Dict])
def detect_clusters(
    maladie_id: int = Query(..., description="ID de la maladie (requis)"),
    district_id: Optional[int] = Query(None, description="Filtrer par district"),
    jours: int = Query(14, ge=1, le=90, description="Période en jours"),
    rayon_km: float = Query(5.0, ge=1.0, le=50.0, description="Rayon du cluster en km"),
    min_cas: int = Query(5, ge=2, le=50, description="Nombre minimum de cas pour former un cluster"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🔍 Détecte les clusters géographiques de cas (foyers épidémiques)
    
    Utilise un algorithme de clustering spatial (DBSCAN ou similaire) pour
    identifier les zones de concentration anormale de cas.
    
    Retourne :
    - Centre du cluster (lat, lng)
    - Nombre de cas dans le cluster
    - Rayon effectif
    - Liste des cas concernés
    - Score de risque
    """
    clusters = carto_service.detect_clusters(
        db=db,
        maladie_id=maladie_id,
        district_id=district_id,
        jours=jours,
        rayon_km=rayon_km,
        min_cas=min_cas
    )
    return clusters
