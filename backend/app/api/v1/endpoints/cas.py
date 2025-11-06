"""
📄 Fichier: app/api/v1/endpoints/cas.py
📝 Description: Endpoints pour la gestion des cas
🎯 Usage: CRUD des cas de maladies avec filtres avancés
"""

from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_data_entry_agent
from app.crud import cas as crud_cas
from app.schemas.cas import CasResponse, CasCreate, CasUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[CasResponse])
def read_cas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    maladie_id: Optional[int] = Query(None, description="Filtrer par maladie"),
    district_id: Optional[int] = Query(None, description="Filtrer par district"),
    date_debut: Optional[date] = Query(None, description="Date de début"),
    date_fin: Optional[date] = Query(None, description="Date de fin"),
    statut: Optional[str] = Query(None, description="Filtrer par statut"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    📋 Récupérer la liste des cas avec filtres
    
    Permet de filtrer par maladie, district, période et statut.
    Supporte la pagination avec skip/limit.
    """
    # ✅ CORRIGÉ : Suppression de .cas
    cas_list = crud_cas.get_by_filters(
        db,
        maladie_id=maladie_id,
        district_id=district_id,
        date_debut=date_debut,
        date_fin=date_fin,
        statut=statut,
        skip=skip,
        limit=limit
    )
    return cas_list


@router.get("/count", response_model=dict)
def count_cas(
    maladie_id: Optional[int] = Query(None),
    district_id: Optional[int] = Query(None),
    date_debut: Optional[date] = Query(None),
    date_fin: Optional[date] = Query(None),
    statut: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🔢 Compter le nombre de cas selon les filtres
    
    Utile pour pagination et statistiques sans charger tous les résultats.
    """
    # ✅ CORRIGÉ : Suppression de .cas
    count = crud_cas.count_by_filters(
        db,
        maladie_id=maladie_id,
        district_id=district_id,
        date_debut=date_debut,
        date_fin=date_fin,
        statut=statut
    )
    return {"count": count}


@router.get("/{cas_id}", response_model=CasResponse)
def read_cas_by_id(
    cas_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    👁️ Récupérer un cas par ID
    
    Retourne toutes les informations détaillées d'un cas spécifique.
    """
    # ✅ CORRIGÉ : Suppression de .cas
    cas = crud_cas.get(db, id=cas_id)
    if not cas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cas non trouvé"
        )
    return cas


@router.post("/", response_model=CasResponse, status_code=status.HTTP_201_CREATED)
def create_cas(
    cas_in: CasCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_data_entry_agent)
):
    """
    ➕ Créer un nouveau cas (Agent de saisie, Épidémiologiste, Admin)
    
    Enregistre un nouveau cas de maladie avec toutes les informations
    du patient, localisation, symptômes, etc.
    """
    # ✅ CORRIGÉ : Suppression de .cas
    cas = crud_cas.create(db, obj_in=cas_in, created_by=current_user.id)
    return cas


@router.put("/{cas_id}", response_model=CasResponse)
def update_cas(
    cas_id: int,
    cas_in: CasUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_data_entry_agent)
):
    """
    ✏️ Mettre à jour un cas (Agent de saisie, Épidémiologiste, Admin)
    
    Permet de modifier les informations d'un cas existant
    (évolution, statut, résultats laboratoire, etc.).
    """
    # ✅ CORRIGÉ : Suppression de .cas
    cas = crud_cas.get(db, id=cas_id)
    if not cas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cas non trouvé"
        )
    # ✅ CORRIGÉ : Suppression de .cas
    cas = crud_cas.update(db, db_obj=cas, obj_in=cas_in)
    return cas


@router.delete("/{cas_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cas(
    cas_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_data_entry_agent)
):
    """
    🗑️ Supprimer un cas (Agent de saisie, Épidémiologiste, Admin)
    
    Supprime définitivement un cas de la base de données.
    À utiliser avec prudence (préférer une désactivation si possible).
    """
    # ✅ CORRIGÉ : Suppression de .cas
    cas = crud_cas.get(db, id=cas_id)
    if not cas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cas non trouvé"
        )
    # ✅ CORRIGÉ : Suppression de .cas
    crud_cas.remove(db, id=cas_id)
    return None
