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
