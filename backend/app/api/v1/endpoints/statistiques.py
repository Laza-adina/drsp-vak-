# app/api/v1/endpoints/statistiques.py
from typing import Dict, List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db, get_current_active_user
from app.services.statistics_service import stats_service
from app.models.user import User
from app.models.cas import Cas
from datetime import date, datetime, timedelta
from app.models.district import District

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

# ========================================
# 📊 DASHBOARD
# ========================================

@router.get("/dashboard")
def get_dashboard_stats(
    maladie_id: Optional[int] = Query(None, description="ID de la maladie"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict:
    """
    Statistiques complètes pour le dashboard
    Peut être filtré par maladie_id
    """
    
    # Query de base
    query = db.query(Cas)
    if maladie_id:
        query = query.filter(Cas.maladie_id == maladie_id)
    
    # Total cas
    total_cas = query.count()
    
    # ✅ CORRECTION: Utiliser les valeurs MAJUSCULES ou minuscules selon votre BD
    # Si votre enum PostgreSQL est en MAJUSCULES, gardez comme ça
    # Si c'est en minuscules, changez en ['suspect', 'probable', 'confirme']
    
    # Vérifier d'abord quelle valeur vous avez dans la BD
    # Pour l'instant, j'utilise les MAJUSCULES
    cas_actifs = query.filter(Cas.statut.in_(['SUSPECT', 'PROBABLE', 'CONFIRME'])).count()
    cas_gueris = query.filter(Cas.statut == 'GUERI').count()
    cas_decedes = query.filter(Cas.statut == 'DECEDE').count()
    
    # Taux de guérison et mortalité
    taux_guerison = (cas_gueris / total_cas * 100) if total_cas > 0 else 0
    taux_mortalite = (cas_decedes / total_cas * 100) if total_cas > 0 else 0
    
    # ✅ CORRECTION: datetime maintenant importé
    date_7j = datetime.now() - timedelta(days=7)
    nouveaux_cas_7j = query.filter(Cas.date_declaration >= date_7j).count()
    
    # Évolution
    date_14j = datetime.now() - timedelta(days=14)
    cas_7j_precedents = query.filter(
        Cas.date_declaration >= date_14j,
        Cas.date_declaration < date_7j
    ).count()
    
    evolution_7j = 0
    if cas_7j_precedents > 0:
        evolution_7j = ((nouveaux_cas_7j - cas_7j_precedents) / cas_7j_precedents) * 100
    
    # Répartition par district
    cas_par_district_raw = db.query(
        Cas.district_id,
        func.count(Cas.id).label('count')
    )
    if maladie_id:
        cas_par_district_raw = cas_par_district_raw.filter(Cas.maladie_id == maladie_id)
    
    cas_par_district_raw = cas_par_district_raw.group_by(Cas.district_id).all()
    
    # Récupérer les noms des districts
    cas_par_district = []
    for item in cas_par_district_raw:
        district = db.query(District).filter(District.id == item.district_id).first()
        cas_par_district.append({
            "district": district.nom if district else f"District {item.district_id}",
            "count": item.count
        })
    
    # Répartition par statut
    cas_par_statut_raw = db.query(
        Cas.statut,
        func.count(Cas.id).label('count')
    )
    if maladie_id:
        cas_par_statut_raw = cas_par_statut_raw.filter(Cas.maladie_id == maladie_id)
    
    cas_par_statut = [
        {"statut": s.statut.lower(), "count": s.count}  # ✅ Convertir en minuscules pour le frontend
        for s in cas_par_statut_raw.group_by(Cas.statut).all()
    ]
    
    # Évolution temporelle (30 derniers jours)
    date_30j = datetime.now() - timedelta(days=30)
    evolution_temporelle_raw = db.query(
        func.date(Cas.date_declaration).label('date'),
        func.count(Cas.id).label('count')
    ).filter(
        Cas.date_declaration >= date_30j
    )
    
    if maladie_id:
        evolution_temporelle_raw = evolution_temporelle_raw.filter(Cas.maladie_id == maladie_id)
    
    evolution_temporelle = [
        {"date": str(e.date), "count": e.count} 
        for e in evolution_temporelle_raw.group_by(func.date(Cas.date_declaration)).order_by('date').all()
    ]
    
    return {
        "total_cas": total_cas,
        "cas_actifs": cas_actifs,
        "cas_gueris": cas_gueris,
        "cas_decedes": cas_decedes,
        "taux_guerison": round(taux_guerison, 2),
        "taux_mortalite": round(taux_mortalite, 2),
        "nouveaux_cas_7j": nouveaux_cas_7j,
        "evolution_7j": round(evolution_7j, 2),
        "cas_par_district": cas_par_district,
        "cas_par_statut": cas_par_statut,
        "evolution_temporelle": evolution_temporelle
    }
