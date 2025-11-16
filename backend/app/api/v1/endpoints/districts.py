"""
📄 Fichier: app/api/v1/endpoints/districts.py
📝 Description: Endpoints pour la gestion des districts
🎯 Usage: CRUD des districts avec soft delete
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_admin
from app.crud import district as crud_district
from app.schemas.district import DistrictResponse, DistrictCreate, DistrictUpdate
from app.models.user import User
from app.models.centre_sante import CentreSante
from app.models.cas import Cas
from app.models.district import District  # ✅ IMPORT du modèle

router = APIRouter()


@router.get("/", response_model=List[DistrictResponse])
def read_districts(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = Query(True, description="Afficher uniquement les districts actifs"),  # ✅ AJOUT
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🗺️ Récupérer la liste des districts
    
    Paramètres:
    - active_only: Afficher uniquement les districts actifs (défaut: True)
    """
    # ✅ REQUÊTE AVEC FILTRE
    query = db.query(District)
    
    # Filtrer par statut actif si demandé
    if active_only:
        if hasattr(District, 'is_active'):
            query = query.filter(District.is_active == True)
    
    # Pagination
    districts = query.offset(skip).limit(limit).all()
    return districts


@router.get("/{district_id}", response_model=DistrictResponse)
def read_district(
    district_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """👁️ Récupérer un district par ID"""
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
    """➕ Créer un nouveau district (Admin uniquement)"""
    district = crud_district.create(db, obj_in=district_in)
    return district


@router.put("/{district_id}", response_model=DistrictResponse)
def update_district(
    district_id: int,
    district_in: DistrictUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """✏️ Mettre à jour un district (Admin uniquement)"""
    district = crud_district.get(db, id=district_id)
    if not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="District non trouvé"
        )
    district = crud_district.update(db, db_obj=district, obj_in=district_in)
    return district


@router.delete("/{district_id}")
def delete_district(
    district_id: int,
    force: bool = Query(False, description="Forcer la suppression définitive"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    🗑️ Suppression intelligente d'un district (Admin uniquement)
    
    Comportement :
    1. Si des centres de santé ou cas associés : DÉSACTIVE (soft delete)
    2. Si aucune dépendance : Suppression définitive
    """
    district = crud_district.get(db, id=district_id)
    if not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="District non trouvé"
        )
    
    # Vérifier les centres de santé
    centres_count = db.query(CentreSante).filter(CentreSante.district_id == district_id).count()
    
    # Vérifier les cas
    cas_count = db.query(Cas).filter(Cas.district_id == district_id).count()
    
    total_dependencies = centres_count + cas_count
    
    # ========================================
    # 🔒 CAS 1 : DES DÉPENDANCES EXISTENT
    # ========================================
    if total_dependencies > 0 and not force:
        if hasattr(district, 'is_active'):
            district.is_active = False
            db.commit()
            db.refresh(district)
            
            return {
                "status": "success",
                "action": "SOFT_DELETE",
                "message": f"District '{district.nom}' désactivé avec succès",
                "detail": f"{centres_count} centre(s) de santé et {cas_count} cas sont associés. Le district a été désactivé.",
                "centres_count": centres_count,
                "cas_count": cas_count,
                "district_id": district_id,
                "district_nom": district.nom,
                "is_active": False
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "CANNOT_DELETE_WITH_RELATED_RECORDS",
                    "message": f"Impossible de supprimer ce district : {centres_count} centre(s) et {cas_count} cas associés",
                    "centres_count": centres_count,
                    "cas_count": cas_count,
                    "district_nom": district.nom
                }
            )
    
    # ========================================
    # ✅ CAS 2 : AUCUNE DÉPENDANCE
    # ========================================
    elif total_dependencies == 0:
        crud_district.remove(db, id=district_id)
        return {
            "status": "success",
            "action": "HARD_DELETE",
            "message": f"District '{district.nom}' supprimé définitivement",
            "detail": "Aucune dépendance trouvée.",
            "district_id": district_id
        }
    
    # ========================================
    # ⚠️ CAS 3 : SUPPRESSION FORCÉE
    # ========================================
    else:
        crud_district.remove(db, id=district_id)
        return {
            "status": "warning",
            "action": "FORCED_DELETE",
            "message": f"District '{district.nom}' supprimé (mode forcé)",
            "centres_count": centres_count,
            "cas_count": cas_count,
            "district_id": district_id
        }


@router.post("/{district_id}/reactivate")
def reactivate_district(
    district_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """✅ Réactiver un district désactivé"""
    district = crud_district.get(db, id=district_id)
    if not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="District non trouvé"
        )
    
    if not hasattr(district, 'is_active'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le modèle District ne supporte pas le soft delete (champ 'is_active' manquant)"
        )
    
    district.is_active = True
    db.commit()
    db.refresh(district)
    
    return {
        "status": "success",
        "action": "REACTIVATE",
        "message": f"District '{district.nom}' réactivé avec succès",
        "district_id": district_id,
        "district_nom": district.nom,
        "is_active": True
    }
