"""
📄 Fichier: app/api/v1/endpoints/dashboard.py
📝 Description: Endpoints pour le tableau de bord
🎯 Usage: Statistiques, graphiques et KPIs du dashboard
"""

from datetime import datetime, timedelta
from typing import Dict, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db, get_current_active_user
from app.models.cas import Cas
from app.models.alerte import Alerte
from app.models.district import District
from app.models.maladie import Maladie
from app.utils.enums import AlerteStatut
from app.models.user import User

router = APIRouter()


@router.get("/statistics")
def get_dashboard_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict:
    """📊 Statistiques principales du dashboard"""
    now = datetime.now()
    
    # Calcul des périodes
    date_24h = now - timedelta(hours=24)
    date_7j = now - timedelta(days=7)
    date_30j = now - timedelta(days=30)
    
    # ✅ CORRECTION : Utiliser date_declaration au lieu de created_at
    cas_24h = db.query(func.count(Cas.id)).filter(
        Cas.date_declaration >= date_24h.date(),
        Cas.date_declaration.isnot(None)
    ).scalar() or 0
    
    cas_7j = db.query(func.count(Cas.id)).filter(
        Cas.date_declaration >= date_7j.date(),
        Cas.date_declaration.isnot(None)
    ).scalar() or 0
    
    cas_30j = db.query(func.count(Cas.id)).filter(
        Cas.date_declaration >= date_30j.date(),
        Cas.date_declaration.isnot(None)
    ).scalar() or 0
    
    # Total cas
    total_cas = db.query(func.count(Cas.id)).scalar() or 0
    
    # Alertes actives par niveau
    try:
        alertes_actives = db.query(
            Alerte.niveau,
            func.count(Alerte.id)
        ).filter(
            Alerte.statut.in_([AlerteStatut.ACTIVE, AlerteStatut.EN_COURS])
        ).group_by(Alerte.niveau).all()
        
        alertes_par_niveau = {str(niveau): count for niveau, count in alertes_actives}
    except:
        alertes_par_niveau = {}
    
    # Cas par statut
    cas_par_statut = db.query(
        Cas.statut,
        func.count(Cas.id)
    ).group_by(Cas.statut).all()
    
    statuts = {str(statut): count for statut, count in cas_par_statut}
    
    return {
        "total_cas": total_cas,
        "nouveaux_cas": {
            "24h": cas_24h,
            "7j": cas_7j,
            "30j": cas_30j
        },
        "alertes_actives": alertes_par_niveau,
        "cas_par_statut": statuts,
        "timestamp": now.isoformat()
    }


@router.get("/top-districts")
def get_top_districts(
    limit: int = Query(5, ge=1, le=20),
    jours: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> List[Dict]:
    """🏆 Districts avec le plus de cas"""
    date_debut = datetime.now() - timedelta(days=jours)
    
    # ✅ CORRECTION : Utiliser date_declaration
    results = db.query(
        District.id,
        District.nom,
        func.count(Cas.id).label('nombre_cas')
    ).join(
        Cas, Cas.district_id == District.id
    ).filter(
        Cas.date_declaration >= date_debut.date(),
        Cas.date_declaration.isnot(None)
    ).group_by(
        District.id, District.nom
    ).order_by(
        func.count(Cas.id).desc()
    ).limit(limit).all()
    
    return [
        {
            "district_id": r.id,
            "district_nom": r.nom,
            "nombre_cas": r.nombre_cas
        }
        for r in results
    ]


@router.get("/evolution-temporelle")
def get_evolution_temporelle(
    jours: int = Query(30, ge=7, le=365),
    maladie_id: int = Query(None),
    district_id: int = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> List[Dict]:
    """📈 Évolution du nombre de cas par jour"""
    date_debut = datetime.now() - timedelta(days=jours)
    
    query = db.query(
        func.date(Cas.date_declaration).label('date'),
        func.count(Cas.id).label('nombre_cas')
    ).filter(
        Cas.date_declaration >= date_debut.date(),
        Cas.date_declaration.isnot(None)  # ✅ Important
    )
    
    if maladie_id:
        query = query.filter(Cas.maladie_id == maladie_id)
    
    if district_id:
        query = query.filter(Cas.district_id == district_id)
    
    results = query.group_by(
        func.date(Cas.date_declaration)
    ).order_by(
        func.date(Cas.date_declaration)
    ).all()
    
    return [
        {
            "date": r.date.isoformat() if r.date else None,
            "nombre_cas": r.nombre_cas
        }
        for r in results if r.date
    ]


@router.get("/repartition-maladies")
def get_repartition_maladies(
    jours: int = Query(30, ge=1, le=365),
    district_id: int = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> List[Dict]:
    """🦠 Répartition des cas par maladie avec pourcentages"""
    date_debut = datetime.now() - timedelta(days=jours)
    
    # ✅ CORRECTION : Utiliser date_declaration
    query = db.query(
        Maladie.id,
        Maladie.nom,
        func.count(Cas.id).label('nombre_cas')
    ).join(
        Cas, Cas.maladie_id == Maladie.id
    ).filter(
        Cas.date_declaration >= date_debut.date(),
        Cas.date_declaration.isnot(None)
    )
    
    if district_id:
        query = query.filter(Cas.district_id == district_id)
    
    results = query.group_by(
        Maladie.id, Maladie.nom
    ).order_by(
        func.count(Cas.id).desc()
    ).all()
    
    # Calcul du total pour les pourcentages
    total_cas = sum(r.nombre_cas for r in results) or 1
    
    return [
        {
            "maladie_id": r.id,
            "maladie_nom": r.nom,
            "nombre_cas": r.nombre_cas,
            "pourcentage": round((r.nombre_cas / total_cas * 100), 2)
        }
        for r in results
    ]
