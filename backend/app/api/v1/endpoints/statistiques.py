# app/api/v1/endpoints/statistiques.py
from typing import Dict, List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.services.statistics_service import stats_service
from app.models.user import User

router = APIRouter()


@router.get("/taux-incidence")
def get_taux_incidence(
    district_id: int = Query(..., description="ID du district (requis)"),
    maladie_id: Optional[int] = Query(None, description="ID de la maladie"),
    date_debut: Optional[date] = Query(None, description="Date de début"),
    date_fin: Optional[date] = Query(None, description="Date de fin"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict:
    """
    Calcul du taux d'incidence pour 100,000 habitants
    """
    taux = stats_service.calculate_incidence_rate(
        db=db,
        district_id=district_id,
        maladie_id=maladie_id,
        date_debut=date_debut,
        date_fin=date_fin
    )
    
    return {
        "district_id": district_id,
        "maladie_id": maladie_id,
        "taux_incidence": taux,
        "pour": "100,000 habitants",
        "date_debut": date_debut.isoformat() if date_debut else None,
        "date_fin": date_fin.isoformat() if date_fin else None
    }


@router.get("/taux-letalite")
def get_taux_letalite(
    maladie_id: Optional[int] = Query(None, description="ID de la maladie"),
    district_id: Optional[int] = Query(None, description="ID du district"),
    date_debut: Optional[date] = Query(None, description="Date de début"),
    date_fin: Optional[date] = Query(None, description="Date de fin"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict:
    """
    Calcul du taux de létalité (Case Fatality Rate)
    """
    taux = stats_service.calculate_case_fatality_rate(
        db=db,
        maladie_id=maladie_id,
        district_id=district_id,
        date_debut=date_debut,
        date_fin=date_fin
    )
    
    return {
        "maladie_id": maladie_id,
        "district_id": district_id,
        "taux_letalite": taux,
        "unite": "pourcentage",
        "date_debut": date_debut.isoformat() if date_debut else None,
        "date_fin": date_fin.isoformat() if date_fin else None
    }


@router.get("/taux-attaque")
def get_taux_attaque(
    district_id: int = Query(..., description="ID du district (requis)"),
    maladie_id: int = Query(..., description="ID de la maladie (requis)"),
    date_debut: date = Query(..., description="Date de début de l'épidémie"),
    date_fin: date = Query(..., description="Date de fin de l'épidémie"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict:
    """
    Calcul du taux d'attaque lors d'une épidémie
    """
    taux = stats_service.calculate_attack_rate(
        db=db,
        district_id=district_id,
        maladie_id=maladie_id,
        date_debut=date_debut,
        date_fin=date_fin
    )
    
    return {
        "district_id": district_id,
        "maladie_id": maladie_id,
        "taux_attaque": taux,
        "unite": "pourcentage",
        "date_debut": date_debut.isoformat(),
        "date_fin": date_fin.isoformat()
    }


@router.get("/tendance")
def get_tendance(
    maladie_id: Optional[int] = Query(None, description="ID de la maladie"),
    district_id: Optional[int] = Query(None, description="ID du district"),
    jours: int = Query(14, ge=7, le=90, description="Période de comparaison en jours"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict:
    """
    Analyse de la tendance d'évolution (croissance/décroissance)
    """
    tendance = stats_service.calculate_trend(
        db=db,
        maladie_id=maladie_id,
        district_id=district_id,
        jours=jours
    )
    
    return tendance


@router.get("/distribution-age", response_model=List[Dict])
def get_distribution_age(
    maladie_id: Optional[int] = Query(None, description="ID de la maladie"),
    district_id: Optional[int] = Query(None, description="ID du district"),
    date_debut: Optional[date] = Query(None, description="Date de début"),
    date_fin: Optional[date] = Query(None, description="Date de fin"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Répartition des cas par tranche d'âge
    """
    distribution = stats_service.get_age_distribution(
        db=db,
        maladie_id=maladie_id,
        district_id=district_id,
        date_debut=date_debut,
        date_fin=date_fin
    )
    
    return distribution


@router.get("/resume-hebdomadaire", response_model=List[Dict])
def get_resume_hebdomadaire(
    maladie_id: Optional[int] = Query(None, description="ID de la maladie"),
    semaines: int = Query(12, ge=4, le=52, description="Nombre de semaines"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Résumé hebdomadaire des cas
    """
    resume = stats_service.get_weekly_summary(
        db=db,
        maladie_id=maladie_id,
        semaines=semaines
    )
    
    return resume