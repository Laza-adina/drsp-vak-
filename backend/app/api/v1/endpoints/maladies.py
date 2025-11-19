"""
📄 Fichier: app/api/v1/endpoints/maladies.py
📝 Description: Endpoints pour la gestion des maladies
🎯 Usage: CRUD des maladies sous surveillance avec seuils d'alerte
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_admin
from app.models.user import User
from app.models.cas import Cas
from app.models.maladie import Maladie

router = APIRouter()


# ========================================
# 📋 GET - LISTE DES MALADIES
# ========================================

@router.get("", response_model=List[dict])
def read_maladies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    active_only: bool = Query(True, description="Afficher uniquement les maladies actives"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🦠 Récupérer la liste des maladies sous surveillance
    
    Retourne les maladies à déclaration obligatoire (MDO) avec leurs seuils d'alerte.
    
    - **active_only**: Si True, retourne uniquement les maladies actives
    """
    query = db.query(Maladie)
    
    if active_only:
        query = query.filter(Maladie.is_active == True)
    
    maladies = query.order_by(Maladie.priorite_surveillance.desc(), Maladie.nom).offset(skip).limit(limit).all()
    
    return [
        {
            "id": m.id,
            "nom": m.nom,
            "code": m.code,
            "code_icd10": m.code_icd10,
            "seuil_alerte": m.seuil_alerte,
            "seuil_epidemie": m.seuil_epidemie,
            "priorite_surveillance": m.priorite_surveillance,
            "description": m.description,
            "is_active": m.is_active
        }
        for m in maladies
    ]


# ========================================
# 👁️ GET BY ID
# ========================================

@router.get("/{maladie_id}", response_model=dict)
def read_maladie(
    maladie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    👁️ Récupérer une maladie par ID
    
    Retourne les détails complets incluant les seuils d'alerte et d'épidémie.
    """
    maladie = db.query(Maladie).filter(Maladie.id == maladie_id).first()
    
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    
    # Compter les cas associés
    cas_count = db.query(Cas).filter(Cas.maladie_id == maladie_id).count()
    
    return {
        "id": maladie.id,
        "nom": maladie.nom,
        "code": maladie.code,
        "code_icd10": maladie.code_icd10,
        "seuil_alerte": maladie.seuil_alerte,
        "seuil_epidemie": maladie.seuil_epidemie,
        "priorite_surveillance": maladie.priorite_surveillance,
        "description": maladie.description,
        "is_active": maladie.is_active,
        "cas_count": cas_count
    }


# ========================================
# ➕ POST - CRÉER UNE MALADIE
# ========================================

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_maladie(
    nom: str,
    code: str = None,
    code_icd10: str = None,
    seuil_alerte: int = 5,
    seuil_epidemie: int = 10,
    priorite_surveillance: int = 3,
    description: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ➕ Créer une nouvelle maladie (Admin uniquement)
    
    **Validation :**
    - Le nom doit être unique
    - seuil_epidemie doit être supérieur à seuil_alerte
    - priorite_surveillance entre 1 (faible) et 5 (haute)
    """
    
    # Validation : nom unique
    existing = db.query(Maladie).filter(Maladie.nom == nom).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Une maladie avec le nom '{nom}' existe déjà"
        )
    
    # Validation : seuils cohérents
    if seuil_epidemie <= seuil_alerte:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Le seuil d'épidémie ({seuil_epidemie}) doit être supérieur au seuil d'alerte ({seuil_alerte})"
        )
    
    # Validation : priorité
    if priorite_surveillance < 1 or priorite_surveillance > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La priorité de surveillance doit être entre 1 et 5"
        )
    
    # Créer la maladie
    maladie = Maladie(
        nom=nom,
        code=code,
        code_icd10=code_icd10,
        seuil_alerte=seuil_alerte,
        seuil_epidemie=seuil_epidemie,
        priorite_surveillance=priorite_surveillance,
        description=description,
        is_active=True
    )
    
    db.add(maladie)
    db.commit()
    db.refresh(maladie)
    
    return {
        "id": maladie.id,
        "nom": maladie.nom,
        "code": maladie.code,
        "code_icd10": maladie.code_icd10,
        "seuil_alerte": maladie.seuil_alerte,
        "seuil_epidemie": maladie.seuil_epidemie,
        "priorite_surveillance": maladie.priorite_surveillance,
        "description": maladie.description,
        "is_active": maladie.is_active
    }


# ========================================
# ✏️ PUT - MODIFIER UNE MALADIE
# ========================================

@router.put("/{maladie_id}", response_model=dict)
def update_maladie(
    maladie_id: int,
    nom: str = None,
    code: str = None,
    code_icd10: str = None,
    seuil_alerte: int = None,
    seuil_epidemie: int = None,
    priorite_surveillance: int = None,
    description: str = None,
    is_active: bool = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ✏️ Mettre à jour une maladie (Admin uniquement)
    
    **Validation :**
    - seuil_epidemie doit rester supérieur à seuil_alerte
    """
    maladie = db.query(Maladie).filter(Maladie.id == maladie_id).first()
    
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    
    # Validation : nom unique
    if nom and nom != maladie.nom:
        existing = db.query(Maladie).filter(Maladie.nom == nom).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Une maladie avec le nom '{nom}' existe déjà"
            )
        maladie.nom = nom
    
    # Validation : seuils cohérents
    new_seuil_alerte = seuil_alerte if seuil_alerte is not None else maladie.seuil_alerte
    new_seuil_epidemie = seuil_epidemie if seuil_epidemie is not None else maladie.seuil_epidemie
    
    if new_seuil_epidemie <= new_seuil_alerte:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Le seuil d'épidémie ({new_seuil_epidemie}) doit être supérieur au seuil d'alerte ({new_seuil_alerte})"
        )
    
    # Appliquer les modifications
    if code is not None:
        maladie.code = code
    if code_icd10 is not None:
        maladie.code_icd10 = code_icd10
    if seuil_alerte is not None:
        maladie.seuil_alerte = seuil_alerte
    if seuil_epidemie is not None:
        maladie.seuil_epidemie = seuil_epidemie
    if priorite_surveillance is not None:
        if priorite_surveillance < 1 or priorite_surveillance > 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La priorité de surveillance doit être entre 1 et 5"
            )
        maladie.priorite_surveillance = priorite_surveillance
    if description is not None:
        maladie.description = description
    if is_active is not None:
        maladie.is_active = is_active
    
    db.commit()
    db.refresh(maladie)
    
    return {
        "id": maladie.id,
        "nom": maladie.nom,
        "code": maladie.code,
        "code_icd10": maladie.code_icd10,
        "seuil_alerte": maladie.seuil_alerte,
        "seuil_epidemie": maladie.seuil_epidemie,
        "priorite_surveillance": maladie.priorite_surveillance,
        "description": maladie.description,
        "is_active": maladie.is_active
    }


# ========================================
# 🗑️ DELETE - SUPPRESSION INTELLIGENTE
# ========================================

@router.delete("/{maladie_id}")
def delete_maladie(
    maladie_id: int,
    force: bool = Query(False, description="Forcer la suppression définitive"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    🗑️ Suppression intelligente d'une maladie (Admin uniquement)
    
    **Comportement :**
    
    1. **Si des cas sont associés** :
       - Par défaut : DÉSACTIVE la maladie (soft delete)
       - Avec force=True : Suppression définitive (déconseillé)
    
    2. **Si aucun cas associé** : Suppression définitive
    """
    maladie = db.query(Maladie).filter(Maladie.id == maladie_id).first()
    
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    
    # Compter les cas associés
    cas_count = db.query(Cas).filter(Cas.maladie_id == maladie_id).count()
    
    # CAS 1 : Des cas sont associés
    if cas_count > 0 and not force:
        # Soft delete
        maladie.is_active = False
        db.commit()
        db.refresh(maladie)
        
        return {
            "status": "success",
            "action": "SOFT_DELETE",
            "message": f"Maladie '{maladie.nom}' désactivée avec succès",
            "detail": f"{cas_count} cas sont associés à cette maladie. Elle a été désactivée pour préserver l'historique.",
            "cas_count": cas_count,
            "maladie_id": maladie_id,
            "is_active": False
        }
    
    # CAS 2 : Aucun cas - Suppression OK
    elif cas_count == 0:
        db.delete(maladie)
        db.commit()
        
        return {
            "status": "success",
            "action": "HARD_DELETE",
            "message": f"Maladie '{maladie.nom}' supprimée définitivement",
            "detail": "Aucun cas n'était associé à cette maladie.",
            "maladie_id": maladie_id
        }
    
    # CAS 3 : Suppression forcée (DANGER)
    else:
        db.query(Cas).filter(Cas.maladie_id == maladie_id).update(
            {"maladie_id": None},
            synchronize_session=False
        )
        
        db.delete(maladie)
        db.commit()
        
        return {
            "status": "warning",
            "action": "FORCED_DELETE",
            "message": f"Maladie '{maladie.nom}' supprimée (mode forcé)",
            "detail": f"{cas_count} cas ont été déliés de cette maladie.",
            "cas_count": cas_count,
            "warning": "⚠️ Cette action peut affecter l'intégrité des données."
        }


# ========================================
# ✅ POST - RÉACTIVER UNE MALADIE
# ========================================

@router.post("/{maladie_id}/reactivate")
def reactivate_maladie(
    maladie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    ✅ Réactiver une maladie désactivée (Admin uniquement)
    """
    maladie = db.query(Maladie).filter(Maladie.id == maladie_id).first()
    
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    
    maladie.is_active = True
    db.commit()
    db.refresh(maladie)
    
    return {
        "status": "success",
        "action": "REACTIVATE",
        "message": f"Maladie '{maladie.nom}' réactivée avec succès",
        "maladie_id": maladie_id,
        "is_active": True
    }


# ========================================
# 📊 GET - STATISTIQUES PAR MALADIE
# ========================================

@router.get("/{maladie_id}/stats")
def get_maladie_stats(
    maladie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    📊 Obtenir les statistiques d'une maladie
    
    Retourne le nombre de cas, le statut d'alerte, etc.
    """
    maladie = db.query(Maladie).filter(Maladie.id == maladie_id).first()
    
    if not maladie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maladie non trouvée"
        )
    
    from datetime import date, timedelta
    from sqlalchemy import func
    
    # Cas total
    cas_total = db.query(Cas).filter(Cas.maladie_id == maladie_id).count()
    
    # Cas des 7 derniers jours
    date_limite = date.today() - timedelta(days=7)
    cas_7j = db.query(Cas).filter(
        Cas.maladie_id == maladie_id,
        Cas.date_symptomes >= date_limite
    ).count()
    
    # Déterminer le statut d'alerte
    if cas_7j >= maladie.seuil_epidemie:
        statut_alerte = "ÉPIDÉMIE"
        niveau = "critique"
    elif cas_7j >= maladie.seuil_alerte:
        statut_alerte = "ALERTE"
        niveau = "alerte"
    else:
        statut_alerte = "NORMAL"
        niveau = "normal"
    
    return {
        "maladie_id": maladie_id,
        "maladie_nom": maladie.nom,
        "cas_total": cas_total,
        "cas_7_derniers_jours": cas_7j,
        "seuil_alerte": maladie.seuil_alerte,
        "seuil_epidemie": maladie.seuil_epidemie,
        "statut_alerte": statut_alerte,
        "niveau": niveau,
        "can_delete": cas_total == 0
    }
