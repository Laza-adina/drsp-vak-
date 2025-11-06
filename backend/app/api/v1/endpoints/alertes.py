"""
📄 Fichier: app/api/v1/endpoints/alertes.py
📝 Description: Endpoints pour la gestion des alertes
🎯 Usage: CRUD des alertes épidémiologiques
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_epidemiologist
from app.crud import alerte as crud_alerte
from app.schemas.alerte import AlerteResponse, AlerteCreate, AlerteUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[AlerteResponse])
def read_alertes(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Récupérer la liste des alertes"""
    if active_only:
        # ✅ CORRIGÉ : Suppression de .alerte
        alertes = crud_alerte.get_active(db)
    else:
        # ✅ CORRIGÉ : Suppression de .alerte
        alertes = crud_alerte.get_multi(db, skip=skip, limit=limit)
    return alertes


@router.get("/{alerte_id}", response_model=AlerteResponse)
def read_alerte(
    alerte_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Récupérer une alerte par ID"""
    # ✅ CORRIGÉ : Suppression de .alerte
    alerte = crud_alerte.get(db, id=alerte_id)
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte non trouvée"
        )
    return alerte


@router.post("/", response_model=AlerteResponse, status_code=status.HTTP_201_CREATED)
def create_alerte(
    alerte_in: AlerteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """Créer une nouvelle alerte (Épidémiologiste, Admin)"""
    # ✅ CORRIGÉ : Suppression de .alerte
    alerte = crud_alerte.create(db, obj_in=alerte_in, created_by=current_user.id)
    return alerte


@router.put("/{alerte_id}", response_model=AlerteResponse)
def update_alerte(
    alerte_id: int,
    alerte_in: AlerteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """Mettre à jour une alerte (Épidémiologiste, Admin)"""
    # ✅ CORRIGÉ : Suppression de .alerte
    alerte = crud_alerte.get(db, id=alerte_id)
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte non trouvée"
        )
    # ✅ CORRIGÉ : Suppression de .alerte
    alerte = crud_alerte.update(db, db_obj=alerte, obj_in=alerte_in)
    return alerte


@router.delete("/{alerte_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alerte(
    alerte_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """Supprimer une alerte (Épidémiologiste, Admin)"""
    # ✅ CORRIGÉ : Suppression de .alerte
    alerte = crud_alerte.get(db, id=alerte_id)
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte non trouvée"
        )
    # ✅ CORRIGÉ : Suppression de .alerte
    crud_alerte.remove(db, id=alerte_id)
    return None
