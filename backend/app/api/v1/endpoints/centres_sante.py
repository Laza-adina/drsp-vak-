"""
📄 Fichier: app/api/v1/endpoints/centres_sante.py
📝 Description: Endpoints pour la gestion des centres de santé
🎯 Usage: CRUD des centres de santé
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_admin
from app.crud import centre_sante as crud_centre
from app.schemas.centre_sante import CentreSanteResponse, CentreSanteCreate, CentreSanteUpdate
from app.models.user import User
from app.models.cas import Cas

router = APIRouter()


@router.get("/", response_model=List[CentreSanteResponse])
def read_centres_sante(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = Query(True, description="Afficher uniquement les centres actifs"),  # ✅ AJOUT
    district_id: int = Query(None, description="Filtrer par district"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🏥 Récupérer la liste des centres de santé
    
    Paramètres:
    - active_only: Afficher uniquement les centres actifs (défaut: True)
    - district_id: Filtrer par district (optionnel)
    """
    query = db.query(crud_centre.model)
    
    # ✅ FILTRER PAR STATUT ACTIF
    if active_only:
        if hasattr(crud_centre.model, 'is_active'):
            query = query.filter(crud_centre.model.is_active == True)
    
    # Filtrer par district si fourni
    if district_id:
        query = query.filter(crud_centre.model.district_id == district_id)
    
    # Pagination
    centres = query.offset(skip).limit(limit).all()
    return centres


@router.get("/{centre_id}", response_model=CentreSanteResponse)
def read_centre_sante(
    centre_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """👁️ Récupérer un centre de santé par ID"""
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
    """➕ Créer un nouveau centre de santé (Admin uniquement)"""
    centre = crud_centre.create(db, obj_in=centre_in)
    return centre


@router.put("/{centre_id}", response_model=CentreSanteResponse)
def update_centre_sante(
    centre_id: int,
    centre_in: CentreSanteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """✏️ Mettre à jour un centre de santé (Admin uniquement)"""
    centre = crud_centre.get(db, id=centre_id)
    if not centre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Centre de santé non trouvé"
        )
    centre = crud_centre.update(db, db_obj=centre, obj_in=centre_in)
    return centre


@router.delete("/{centre_id}")
def delete_centre_sante(
    centre_id: int,
    force: bool = Query(False, description="Forcer la suppression définitive"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    🗑️ Suppression intelligente d'un centre de santé (Admin uniquement)
    
    Comportement :
    1. Si des cas ou utilisateurs associés : DÉSACTIVE (soft delete)
    2. Si aucune dépendance : Suppression définitive
    """
    centre = crud_centre.get(db, id=centre_id)
    if not centre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Centre de santé non trouvé"
        )
    
    # Vérifier les cas
    cas_count = db.query(Cas).filter(Cas.centre_sante_id == centre_id).count()
    
    # Vérifier les utilisateurs
    users_count = db.query(User).filter(User.centre_sante_id == centre_id).count()
    
    total_dependencies = cas_count + users_count
    
    # ========================================
    # 🔒 CAS 1 : DES DÉPENDANCES EXISTENT
    # ========================================
    if total_dependencies > 0 and not force:
        if hasattr(centre, 'is_active'):
            centre.is_active = False
            db.commit()
            db.refresh(centre)
            
            return {
                "status": "success",
                "action": "SOFT_DELETE",
                "message": f"Centre '{centre.nom}' désactivé avec succès",
                "detail": f"{cas_count} cas et {users_count} utilisateur(s) sont associés.",
                "cas_count": cas_count,
                "users_count": users_count,
                "centre_id": centre_id,
                "is_active": False
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "CANNOT_DELETE_WITH_RELATED_RECORDS",
                    "message": f"Impossible de supprimer : {cas_count} cas et {users_count} utilisateurs associés",
                    "cas_count": cas_count,
                    "users_count": users_count
                }
            )
    
    # ========================================
    # ✅ CAS 2 : AUCUNE DÉPENDANCE
    # ========================================
    elif total_dependencies == 0:
        crud_centre.remove(db, id=centre_id)
        return {
            "status": "success",
            "action": "HARD_DELETE",
            "message": f"Centre '{centre.nom}' supprimé définitivement",
            "centre_id": centre_id
        }
    
    # ========================================
    # ⚠️ CAS 3 : SUPPRESSION FORCÉE
    # ========================================
    else:
        crud_centre.remove(db, id=centre_id)
        return {
            "status": "warning",
            "action": "FORCED_DELETE",
            "message": f"Centre '{centre.nom}' supprimé (mode forcé)",
            "cas_count": cas_count,
            "users_count": users_count
        }


@router.post("/{centre_id}/reactivate")
def reactivate_centre_sante(
    centre_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """✅ Réactiver un centre de santé désactivé"""
    centre = crud_centre.get(db, id=centre_id)
    if not centre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Centre de santé non trouvé"
        )
    
    if not hasattr(centre, 'is_active'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le modèle CentreSante ne supporte pas le soft delete"
        )
    
    centre.is_active = True
    db.commit()
    db.refresh(centre)
    
    return {
        "status": "success",
        "action": "REACTIVATE",
        "message": f"Centre '{centre.nom}' réactivé avec succès",
        "centre_id": centre_id,
        "is_active": True
    }
