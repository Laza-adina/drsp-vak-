"""
📄 Fichier: app/api/v1/endpoints/interventions.py
📝 Description: Endpoints pour la gestion des interventions
🎯 Usage: CRUD des interventions sanitaires (campagnes, formations, etc.)
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_epidemiologist
from app.crud import intervention as crud_intervention
from app.schemas.intervention import InterventionResponse, InterventionCreate, InterventionUpdate
from app.models.user import User
from datetime import timedelta
from app.services.ai_service import AIService
from app.models.maladie import Maladie
from app.models.district import District
from app.models.cas import Cas
from app.models.alerte import Alerte
from pydantic import BaseModel
import json

router = APIRouter()


@router.get("/", response_model=List[InterventionResponse])
def read_interventions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    💼 Récupérer la liste des interventions
    
    Retourne toutes les interventions sanitaires planifiées ou en cours :
    campagnes de vaccination, sensibilisation, distribution de matériel, etc.
    """
    # ✅ CORRIGÉ : Suppression de .intervention
    interventions = crud_intervention.get_multi(db, skip=skip, limit=limit)
    return interventions


@router.get("/{intervention_id}", response_model=InterventionResponse)
def read_intervention(
    intervention_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    👁️ Récupérer une intervention par ID
    
    Retourne les détails complets d'une intervention : type, zone ciblée,
    période, objectifs, ressources mobilisées, indicateurs de performance.
    """
    # ✅ CORRIGÉ : Suppression de .intervention
    intervention = crud_intervention.get(db, id=intervention_id)
    if not intervention:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intervention non trouvée"
        )
    return intervention


@router.post("/", response_model=InterventionResponse, status_code=status.HTTP_201_CREATED)
def create_intervention(
    intervention_in: InterventionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """
    ➕ Créer une nouvelle intervention (Épidémiologiste, Admin)
    
    Planifie une nouvelle intervention sanitaire avec :
    - Type (vaccination, IEC, distribution, investigation)
    - Zone géographique ciblée
    - Période et durée
    - Objectifs et indicateurs
    - Budget et ressources
    """
    # ✅ CORRIGÉ : Suppression de .intervention
    intervention = crud_intervention.create(
        db, 
        obj_in=intervention_in, 
        created_by=current_user.id
    )
    return intervention


@router.put("/{intervention_id}", response_model=InterventionResponse)
def update_intervention(
    intervention_id: int,
    intervention_in: InterventionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """
    ✏️ Mettre à jour une intervention (Épidémiologiste, Admin)
    
    Permet de modifier une intervention en cours :
    ajuster les dates, mettre à jour les résultats intermédiaires,
    changer le statut (planifié → en cours → terminé).
    """
    # ✅ CORRIGÉ : Suppression de .intervention
    intervention = crud_intervention.get(db, id=intervention_id)
    if not intervention:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intervention non trouvée"
        )
    # ✅ CORRIGÉ : Suppression de .intervention
    intervention = crud_intervention.update(
        db, 
        db_obj=intervention, 
        obj_in=intervention_in
    )
    return intervention


@router.delete("/{intervention_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_intervention(
    intervention_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """
    🗑️ Supprimer une intervention (Épidémiologiste, Admin)
    
    Supprime définitivement une intervention.
    À utiliser avec prudence, préférer un changement de statut
    vers "Annulée" pour garder l'historique.
    """
    # ✅ CORRIGÉ : Suppression de .intervention
    intervention = crud_intervention.get(db, id=intervention_id)
    if not intervention:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intervention non trouvée"
        )
    # ✅ CORRIGÉ : Suppression de .intervention
    crud_intervention.remove(db, id=intervention_id)
    return None

    # ========================================
# 🤖 ENDPOINTS IA
# ========================================

class AIRecommendationRequest(BaseModel):
    maladie_id: int
    district_id: int
    alerte_id: int | None = None

class CreateFromAIRequest(BaseModel):
    recommandation: dict
    maladie_id: int
    district_id: int
    alerte_id: int | None = None


@router.post("/generer-recommandations-ia", response_model=dict)
async def generer_recommandations_ia(
    request: AIRecommendationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🤖 Génère des recommandations d'interventions via IA Groq
    """
    
    # Récupère maladie et district
    maladie = db.query(Maladie).filter(Maladie.id == request.maladie_id).first()
    district = db.query(District).filter(District.id == request.district_id).first()
    
    if not maladie or not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie ou district introuvable"
        )
    
    # Compte les cas récents (30 derniers jours)
    from datetime import datetime, timedelta
    date_limite = datetime.now().date() - timedelta(days=30)
    
    cas = db.query(Cas).filter(
        Cas.maladie_id == request.maladie_id,
        Cas.district_id == request.district_id,
        Cas.date_symptomes >= date_limite
    ).order_by(Cas.date_symptomes.desc()).all()
    
    nb_cas = len(cas)
    
    if nb_cas == 0:
        result = await AIService.generer_recommandations_intervention(
        maladie_nom=maladie.nom,
        district_nom=district.nom,
        nb_cas=0,  # Aucun cas actuel
        tendance="stable",
        cas_recents=[],
        interventions_passees=[],
        alerte_info={
            "niveau_gravite": "info",
            "description": f"Aucun cas récent de {maladie.nom}. Recommandations préventives."
        }
    )
    
    # Calcule tendance
    date_7j = datetime.now().date() - timedelta(days=7)
    date_14j = datetime.now().date() - timedelta(days=14)
    
    cas_7j = len([c for c in cas if c.date_symptomes >= date_7j])
    cas_7_14j = len([c for c in cas if date_14j <= c.date_symptomes < date_7j])
    
    if cas_7j > cas_7_14j * 1.5:
        tendance = "hausse"
    elif cas_7j < cas_7_14j * 0.7:
        tendance = "baisse"
    else:
        tendance = "stable"
    
    # ✅ PRÉPARE DONNÉES CAS (CORRIGÉ)
    cas_data = []
    for c in cas[:20]:
        cas_dict = {
            "date": c.date_symptomes.isoformat() if c.date_symptomes else None,
        }
        
        # Ajoute les champs qui existent
        if hasattr(c, 'age'):
            cas_dict["age"] = c.age
        if hasattr(c, 'district') and c.district:
            cas_dict["district"] = c.district.nom
        if hasattr(c, 'centre_sante') and c.centre_sante:
            cas_dict["centre_sante"] = c.centre_sante.nom
        if hasattr(c, 'statut'):
            cas_dict["statut"] = c.statut
            
        cas_data.append(cas_dict)
    
    # Info alerte si existe
    alerte_info = None
    if request.alerte_id:
        alerte = db.query(Alerte).filter(Alerte.id == request.alerte_id).first()
        if alerte:
            alerte_info = {
                "niveau_gravite": alerte.niveau_gravite,
                "description": alerte.description
            }
    
    # Historique interventions
    from app.models.intervention import Intervention
    interventions_passees = db.query(Intervention).filter(
        Intervention.maladie_id == request.maladie_id,
        Intervention.district_id == request.district_id
    ).order_by(Intervention.created_at.desc()).limit(5).all()
    
    historique = [
        {
            "type": i.type.value if hasattr(i.type, 'value') else str(i.type),
            "titre": i.titre,
            "efficacite_score": i.efficacite_score
        }
        for i in interventions_passees
    ]
    
    # 🤖 Appel Groq AI
    result = await AIService.generer_recommandations_intervention(
        maladie_nom=maladie.nom,
        district_nom=district.nom,
        nb_cas=nb_cas,
        tendance=tendance,
        cas_recents=cas_data,
        interventions_passees=historique,
        alerte_info=alerte_info
    )
    
    return result


@router.post("/creer-depuis-ia", response_model=InterventionResponse, status_code=status.HTTP_201_CREATED)
async def creer_intervention_depuis_ia(
    request: CreateFromAIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """
    ➕ Créer une intervention depuis une recommandation IA
    
    Transforme une recommandation IA en intervention planifiée
    dans le système avec tous les champs pré-remplis.
    """
    from app.models.intervention import Intervention
    from datetime import datetime, timedelta
    
    recommandation = request.recommandation
    
    # Calcule date planifiée (demain par défaut)
    date_planifiee = datetime.now().date() + timedelta(days=1)
    
    # Crée l'intervention
    intervention = Intervention(
        titre=recommandation["titre"],
        description=recommandation["description"],
        type=recommandation["type"],
        statut="planifiee",
        district_id=request.district_id,
        maladie_id=request.maladie_id,
        alerte_id=request.alerte_id,
        date_planifiee=date_planifiee,
        population_cible=recommandation.get("population_cible"),
        budget_alloue=float(recommandation.get("budget_estime", 0)),
        ressources_utilisees=json.dumps(recommandation.get("ressources", []), ensure_ascii=False),
        recommandation_ia=json.dumps(recommandation, ensure_ascii=False),
        generee_par_ia=True,
        created_by=current_user.id
    )
    
    db.add(intervention)
    db.commit()
    db.refresh(intervention)
    
    return intervention