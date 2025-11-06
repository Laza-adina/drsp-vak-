"""
📄 Fichier: app/api/v1/endpoints/districts.py
📝 Description: Endpoints pour la gestion des districts
🎯 Usage: CRUD des districts administratifs
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_admin
from app.crud import district as crud_district
from app.schemas.district import DistrictResponse, DistrictCreate, DistrictUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[DistrictResponse])
def read_districts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🗺️ Récupérer la liste des districts
    
    Retourne tous les districts administratifs de la région
    Vakinankaratra avec leurs informations (population, superficie, etc.).
    """
    # ✅ DÉJÀ CORRIGÉ (pas de .district ici)
    districts = crud_district.get_multi(db, skip=skip, limit=limit)
    return districts


@router.get("/{district_id}", response_model=DistrictResponse)
def read_district(
    district_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    👁️ Récupérer un district par ID
    
    Retourne les informations détaillées d'un district spécifique.
    """
    # ✅ CORRIGÉ : Suppression de .district
    district = crud_district.get(db, id=district_id)
    if not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="District non trouvé"
        )
    return district


@router.post("/", response_model=DistrictResponse, status_code=status.HTTP_201_CREATED)
def create_district(
    district_in: DistrictCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ➕ Créer un nouveau district (Admin uniquement)
    
    Enregistre un nouveau district avec son nom, population,
    superficie et coordonnées GPS.
    """
    # ✅ CORRIGÉ : Suppression de .district
    district = crud_district.create(db, obj_in=district_in)
    return district


@router.put("/{district_id}", response_model=DistrictResponse)
def update_district(
    district_id: int,
    district_in: DistrictUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ✏️ Mettre à jour un district (Admin uniquement)
    
    Permet de modifier les informations d'un district existant
    (population, limites administratives, etc.).
    """
    # ✅ CORRIGÉ : Suppression de .district
    district = crud_district.get(db, id=district_id)
    if not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="District non trouvé"
        )
    # ✅ CORRIGÉ : Suppression de .district
    district = crud_district.update(db, db_obj=district, obj_in=district_in)
    return district


@router.delete("/{district_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_district(
    district_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    🗑️ Supprimer un district (Admin uniquement)
    
    Supprime définitivement un district.
    Attention : tous les cas et centres liés devront être réassignés.
    """
    # ✅ CORRIGÉ : Suppression de .district
    district = crud_district.get(db, id=district_id)
    if not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="District non trouvé"
        )
    # ✅ CORRIGÉ : Suppression de .district
    crud_district.remove(db, id=district_id)
    return None
