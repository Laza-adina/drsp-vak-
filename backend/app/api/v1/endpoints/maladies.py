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
from app.models.cas import Cas
from app.models.maladie import Maladie

router = APIRouter()


@router.get("", response_model=List[MaladieResponse])  # ✅ Pas de slash "/"
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
    
    - **active_only**: Si True, retourne uniquement les maladies actives (par défaut)
    """
    # ✅ CORRECTION : Utiliser une requête avec filtre
    query = db.query(Maladie)
    
    # ✅ FILTRER PAR STATUT ACTIF SI DEMANDÉ
    if active_only:
        if hasattr(Maladie, 'is_active'):
            query = query.filter(Maladie.is_active == True)
    
    # Appliquer la pagination
    maladies = query.offset(skip).limit(limit).all()
    
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
    maladie = crud_maladie.get(db, id=maladie_id)
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    return maladie


@router.post("", response_model=MaladieResponse, status_code=status.HTTP_201_CREATED)  # ✅ Pas de slash
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
    maladie = crud_maladie.get(db, id=maladie_id)
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    maladie = crud_maladie.update(db, db_obj=maladie, obj_in=maladie_in)
    return maladie


@router.delete("/{maladie_id}")
def delete_maladie(
    maladie_id: int,
    force: bool = Query(False, description="Forcer la suppression définitive (désactive les protections)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    🗑️ Suppression intelligente d'une maladie (Admin uniquement)
    
    **Comportement :**
    
    1. **Si des cas sont associés** :
       - Par défaut : DÉSACTIVE la maladie (soft delete) pour préserver l'historique
       - Avec force=True : Suppression définitive (déconseillé)
    
    2. **Si aucun cas associé** :
       - Suppression définitive possible
    
    **Pourquoi soft delete ?**
    - Préserve l'intégrité des données épidémiologiques
    - Maintient la traçabilité des cas historiques
    - Conforme aux normes de conservation des données de santé
    
    **Paramètres :**
    - **force**: Si True, force la suppression même avec des cas associés (DANGER)
    """
    # Vérifier que la maladie existe
    maladie = crud_maladie.get(db, id=maladie_id)
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    
    # ========================================
    # 🔍 VÉRIFIER LES CAS ASSOCIÉS
    # ========================================
    cas_count = db.query(Cas).filter(Cas.maladie_id == maladie_id).count()
    
    # ========================================
    # 🔒 CAS 1 : DES CAS SONT ASSOCIÉS
    # ========================================
    if cas_count > 0 and not force:
        # SOFT DELETE : Désactiver au lieu de supprimer
        if hasattr(maladie, 'is_active'):
            maladie.is_active = False
            db.commit()
            db.refresh(maladie)
            
            return {
                "status": "success",
                "action": "SOFT_DELETE",
                "message": f"Maladie '{maladie.nom}' désactivée avec succès",
                "detail": f"{cas_count} cas sont associés à cette maladie. Elle a été désactivée pour préserver l'historique épidémiologique.",
                "cas_count": cas_count,
                "maladie_id": maladie_id,
                "maladie_nom": maladie.nom,
                "is_active": False,
                "recommendation": "Utilisez l'endpoint /maladies/{id}/reactivate pour réactiver cette maladie si nécessaire."
            }
        else:
            # Si le modèle n'a pas de champ is_active, empêcher la suppression
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "CANNOT_DELETE_WITH_RELATED_RECORDS",
                    "message": f"Impossible de supprimer cette maladie car {cas_count} cas y sont associés",
                    "cas_count": cas_count,
                    "maladie_nom": maladie.nom,
                    "solution": "Supprimez ou réaffectez d'abord tous les cas associés, ou ajoutez le champ 'is_active' au modèle pour activer le soft delete."
                }
            )
    
    # ========================================
    # ✅ CAS 2 : AUCUN CAS - SUPPRESSION OK
    # ========================================
    elif cas_count == 0:
        crud_maladie.remove(db, id=maladie_id)
        
        return {
            "status": "success",
            "action": "HARD_DELETE",
            "message": f"Maladie '{maladie.nom}' supprimée définitivement",
            "detail": "Aucun cas n'était associé à cette maladie.",
            "maladie_id": maladie_id
        }
    
    # ========================================
    # ⚠️ CAS 3 : SUPPRESSION FORCÉE (DANGER)
    # ========================================
    else:  # cas_count > 0 and force=True
        # Mettre à NULL la référence dans les cas
        db.query(Cas).filter(Cas.maladie_id == maladie_id).update(
            {"maladie_id": None},
            synchronize_session=False
        )
        
        # Supprimer la maladie
        crud_maladie.remove(db, id=maladie_id)
        
        return {
            "status": "warning",
            "action": "FORCED_DELETE",
            "message": f"Maladie '{maladie.nom}' supprimée (mode forcé)",
            "detail": f"{cas_count} cas ont été déliés de cette maladie. Leur champ 'maladie_id' a été mis à NULL.",
            "cas_count": cas_count,
            "maladie_id": maladie_id,
            "warning": "⚠️ Cette action peut affecter l'intégrité des données épidémiologiques."
        }


@router.post("/{maladie_id}/reactivate")
def reactivate_maladie(
    maladie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ✅ Réactiver une maladie désactivée (Admin uniquement)
    
    Permet de réactiver une maladie qui a été désactivée (soft delete).
    Utile si la maladie a été désactivée par erreur ou si elle
    redevient pertinente pour la surveillance.
    """
    maladie = crud_maladie.get(db, id=maladie_id)
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    
    # Vérifier que le modèle a le champ is_active
    if not hasattr(maladie, 'is_active'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le modèle Maladie ne supporte pas le soft delete (champ 'is_active' manquant)"
        )
    
    # Réactiver la maladie
    maladie.is_active = True
    db.commit()
    db.refresh(maladie)
    
    return {
        "status": "success",
        "action": "REACTIVATE",
        "message": f"Maladie '{maladie.nom}' réactivée avec succès",
        "maladie_id": maladie_id,
        "maladie_nom": maladie.nom,
        "is_active": True
    }


@router.get("/{maladie_id}/cas-count")
def get_maladie_cas_count(
    maladie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    📊 Obtenir le nombre de cas associés à une maladie
    
    Utile pour vérifier l'impact avant une suppression.
    """
    maladie = crud_maladie.get(db, id=maladie_id)
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    
    cas_count = db.query(Cas).filter(Cas.maladie_id == maladie_id).count()
    
    return {
        "maladie_id": maladie_id,
        "maladie_nom": maladie.nom,
        "cas_count": cas_count,
        "can_delete": cas_count == 0,
        "message": f"{cas_count} cas associé(s)" if cas_count > 0 else "Aucun cas associé - Suppression possible"
    }
