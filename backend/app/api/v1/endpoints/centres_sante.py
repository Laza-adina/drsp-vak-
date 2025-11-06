"""
📄 Fichier: app/api/v1/endpoints/centres_sante.py
📝 Description: Endpoints pour la gestion des centres de santé
🎯 Usage: CRUD des centres de santé (CSB, CHD, CHU, etc.)
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_admin
from app.crud import centre_sante as crud_centre
from app.schemas.centre_sante import CentreSanteResponse, CentreSanteCreate, CentreSanteUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[CentreSanteResponse])
def read_centres_sante(
    skip: int = 0,
    limit: int = 100,
    district_id: int = Query(None, description="Filtrer par district"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🏥 Récupérer la liste des centres de santé
    
    Permet de filtrer par district pour obtenir uniquement
    les centres d'une zone géographique spécifique.
    """
    if district_id:
        # ✅ CORRIGÉ : Suppression de .centre_sante
        centres = crud_centre.get_by_district(db, district_id=district_id)
    else:
        # ✅ CORRIGÉ : Suppression de .centre_sante
        centres = crud_centre.get_multi(db, skip=skip, limit=limit)
    return centres


@router.get("/{centre_id}", response_model=CentreSanteResponse)
def read_centre_sante(
    centre_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    👁️ Récupérer un centre de santé par ID
    
    Retourne les informations complètes du centre :
    nom, type, capacité, équipements, coordonnées GPS, etc.
    """
    # ✅ CORRIGÉ : Suppression de .centre_sante
    centre = crud_centre.get(db, id=centre_id)
    if not centre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Centre de santé non trouvé"
        )
    return centre


@router.post("/", response_model=CentreSanteResponse, status_code=status.HTTP_201_CREATED)
def create_centre_sante(
    centre_in: CentreSanteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ➕ Créer un nouveau centre de santé (Admin uniquement)
    
    Enregistre un nouveau centre avec ses caractéristiques :
    type (CSB I, CSB II, CHD, CHU), capacité, équipements, localisation.
    """
    # ✅ CORRIGÉ : Suppression de .centre_sante
    centre = crud_centre.create(db, obj_in=centre_in)
    return centre


@router.put("/{centre_id}", response_model=CentreSanteResponse)
def update_centre_sante(
    centre_id: int,
    centre_in: CentreSanteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ✏️ Mettre à jour un centre de santé (Admin uniquement)
    
    Permet de modifier les informations d'un centre existant
    (changement de capacité, ajout d'équipements, mise à jour GPS, etc.).
    """
    # ✅ CORRIGÉ : Suppression de .centre_sante
    centre = crud_centre.get(db, id=centre_id)
    if not centre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Centre de santé non trouvé"
        )
    # ✅ CORRIGÉ : Suppression de .centre_sante
    centre = crud_centre.update(db, db_obj=centre, obj_in=centre_in)
    return centre


@router.delete("/{centre_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_centre_sante(
    centre_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    🗑️ Supprimer un centre de santé (Admin uniquement)
    
    Supprime définitivement un centre de la base de données.
    Attention : les cas liés à ce centre devront être réassignés.
    """
    # ✅ CORRIGÉ : Suppression de .centre_sante
    centre = crud_centre.get(db, id=centre_id)
    if not centre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Centre de santé non trouvé"
        )
    # ✅ CORRIGÉ : Suppression de .centre_sante
    crud_centre.remove(db, id=centre_id)
    return None
