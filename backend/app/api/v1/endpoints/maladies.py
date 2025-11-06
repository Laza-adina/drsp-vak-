"""
📄 Fichier: app/api/v1/endpoints/maladies.py
📝 Description: Endpoints pour la gestion des maladies
🎯 Usage: CRUD des maladies sous surveillance (référentiel)
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_admin
from app.crud import maladie as crud_maladie
from app.schemas.maladie import MaladieResponse, MaladieCreate, MaladieUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[MaladieResponse])
def read_maladies(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = Query(True, description="Afficher uniquement les maladies actives"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🦠 Récupérer la liste des maladies sous surveillance
    
    Retourne les maladies à déclaration obligatoire (MDO) et
    maladies prioritaires pour la surveillance épidémiologique.
    """
    # ✅ CORRIGÉ : Suppression de .maladie (ligne 27 et 29)
    if active_only:
        maladies = crud_maladie.get_multi(db)
    else:
        maladies = crud_maladie.get_multi(db, skip=skip, limit=limit)
    return maladies


@router.get("/{maladie_id}", response_model=MaladieResponse)
def read_maladie(
    maladie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    👁️ Récupérer une maladie par ID
    
    Retourne les détails d'une maladie : nom, code CIM-10,
    seuils d'alerte, période d'incubation, symptômes types.
    """
    # ✅ CORRIGÉ : Suppression de .maladie
    maladie = crud_maladie.get(db, id=maladie_id)
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    return maladie


@router.post("/", response_model=MaladieResponse, status_code=status.HTTP_201_CREATED)
def create_maladie(
    maladie_in: MaladieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ➕ Créer une nouvelle maladie (Admin uniquement)
    
    Ajoute une nouvelle maladie au référentiel de surveillance.
    Inclure : nom, code CIM-10, seuils, période d'incubation.
    """
    # ✅ CORRIGÉ : Suppression de .maladie
    maladie = crud_maladie.create(db, obj_in=maladie_in)
    return maladie


@router.put("/{maladie_id}", response_model=MaladieResponse)
def update_maladie(
    maladie_id: int,
    maladie_in: MaladieUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ✏️ Mettre à jour une maladie (Admin uniquement)
    
    Permet de modifier les paramètres d'une maladie :
    seuils d'alerte, statut (active/inactive), classification.
    """
    # ✅ CORRIGÉ : Suppression de .maladie
    maladie = crud_maladie.get(db, id=maladie_id)
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    # ✅ CORRIGÉ : Suppression de .maladie
    maladie = crud_maladie.update(db, db_obj=maladie, obj_in=maladie_in)
    return maladie


@router.delete("/{maladie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_maladie(
    maladie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    🗑️ Supprimer une maladie (Admin uniquement)
    
    Supprime définitivement une maladie du référentiel.
    Attention : les cas liés devront être réaffectés.
    """
    # ✅ CORRIGÉ : Suppression de .maladie
    maladie = crud_maladie.get(db, id=maladie_id)
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    # ✅ CORRIGÉ : Suppression de .maladie
    crud_maladie.remove(db, id=maladie_id)
    return None
