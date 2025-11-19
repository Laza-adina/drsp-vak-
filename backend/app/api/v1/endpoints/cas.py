"""
📄 Fichier: app/api/v1/endpoints/cas.py
📝 Description: Endpoints pour la gestion des cas
🎯 Usage: CRUD des cas de maladies avec filtres avancés
"""

from typing import List, Optional
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user, get_current_data_entry_agent
from app.crud import cas as crud_cas
from app.schemas.cas import CasResponse, CasCreate, CasUpdate
from app.models.user import User
from app.models.cas import Cas

router = APIRouter()


# ========================================
# 📋 GET - LISTE DES CAS AVEC FILTRES
# ========================================

@router.get("", response_model=List[CasResponse])  # ✅ Sans slash
def read_cas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    maladie_id: Optional[int] = Query(None, description="Filtrer par maladie"),
    district_id: Optional[int] = Query(None, description="Filtrer par district"),
    statut: Optional[str] = Query(None, description="Filtrer par statut"),
    # ✅ Filtres par dates d'apparition des symptômes
    date_symptomes_debut: Optional[date] = Query(None, description="Date début symptômes"),
    date_symptomes_fin: Optional[date] = Query(None, description="Date fin symptômes"),
    # Filtres par dates de déclaration
    date_declaration_debut: Optional[date] = Query(None, description="Date début déclaration"),
    date_declaration_fin: Optional[date] = Query(None, description="Date fin déclaration"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    📋 Récupérer la liste des cas avec filtres avancés
    
    Filtres disponibles:
    - Par maladie (maladie_id)
    - Par district (district_id)
    - Par statut (suspect, probable, confirme, gueri, decede)
    - Par période d'apparition des symptômes (date_symptomes_debut/fin)
    - Par période de déclaration (date_declaration_debut/fin)
    - Pagination (skip/limit)
    """
    cas_list = crud_cas.get_by_filters(
        db,
        maladie_id=maladie_id,
        district_id=district_id,
        statut=statut,
        date_symptomes_debut=date_symptomes_debut,
        date_symptomes_fin=date_symptomes_fin,
        date_declaration_debut=date_declaration_debut,
        date_declaration_fin=date_declaration_fin,
        skip=skip,
        limit=limit
    )
    return cas_list


# ========================================
# 🔢 COUNT - NOMBRE DE CAS
# ========================================

@router.get("/count", response_model=dict)
def count_cas(
    maladie_id: Optional[int] = Query(None),
    district_id: Optional[int] = Query(None),
    statut: Optional[str] = Query(None),
    date_symptomes_debut: Optional[date] = Query(None),
    date_symptomes_fin: Optional[date] = Query(None),
    date_declaration_debut: Optional[date] = Query(None),
    date_declaration_fin: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """🔢 Compter le nombre de cas selon les filtres"""
    count = crud_cas.count_by_filters(
        db,
        maladie_id=maladie_id,
        district_id=district_id,
        statut=statut,
        date_symptomes_debut=date_symptomes_debut,
        date_symptomes_fin=date_symptomes_fin,
        date_declaration_debut=date_declaration_debut,
        date_declaration_fin=date_declaration_fin
    )
    return {"count": count}


# ========================================
# 👁️ GET BY ID
# ========================================

@router.get("/{cas_id}", response_model=CasResponse)
def read_cas_by_id(
    cas_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """👁️ Récupérer un cas par ID"""
    cas = crud_cas.get(db, id=cas_id)
    if not cas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cas non trouvé"
        )
    return cas


# ========================================
# ➕ POST - CRÉER UN CAS
# ========================================

@router.post("", response_model=CasResponse, status_code=status.HTTP_201_CREATED)
def create_cas(
    cas_in: CasCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    ➕ Créer un nouveau cas
    
    Le numéro de cas est généré automatiquement au format:
    VAKIN-2025-00001
    """
    
    # ========================================
    # ✅ GÉNÉRATION AUTOMATIQUE DU NUMÉRO (CORRIGÉE)
    # ========================================
    annee = datetime.now().year
    prefix = f"VAKIN-{annee}-"
    
    # Chercher le dernier numéro avec ce préfixe
    dernier_cas = db.query(Cas).filter(
        Cas.numero_cas.like(f"{prefix}%")
    ).order_by(Cas.id.desc()).first()
    
    if dernier_cas and dernier_cas.numero_cas:
        try:
            # Extraire le numéro de la fin (ex: "VAKIN-2025-00012" -> 12)
            dernier_num = int(dernier_cas.numero_cas.split('-')[-1])
            nouveau_num = dernier_num + 1
        except (ValueError, IndexError):
            # Si erreur de parsing, on recommence à 1
            nouveau_num = 1
    else:
        # Pas de cas existant, on commence à 1
        nouveau_num = 1
    
    # Générer le numéro au format VAKIN-2025-00001
    numero_cas = f"{prefix}{nouveau_num:05d}"
    
    # ✅ Vérifier que le numéro n'existe pas déjà (sécurité supplémentaire)
    while db.query(Cas).filter(Cas.numero_cas == numero_cas).first():
        nouveau_num += 1
        numero_cas = f"{prefix}{nouveau_num:05d}"
    
    # ========================================
    # 📝 CRÉATION DU CAS
    # ========================================
    db_cas = Cas(
        numero_cas=numero_cas,
        nom=cas_in.nom,
        maladie_id=cas_in.maladie_id,
        centre_sante_id=cas_in.centre_sante_id,
        district_id=cas_in.district_id,
        date_symptomes=cas_in.date_symptomes,
        date_declaration=cas_in.date_declaration,
        age=cas_in.age,
        sexe=cas_in.sexe,
        statut=cas_in.statut,
        latitude=cas_in.latitude,
        longitude=cas_in.longitude,
        observations=cas_in.observations,
        created_by=current_user.id
    )
    
    db.add(db_cas)
    db.commit()
    db.refresh(db_cas)
    
    return db_cas



# ========================================
# ✏️ PUT - METTRE À JOUR UN CAS
# ========================================
@router.put("/{cas_id}", response_model=CasResponse)
def update_cas(
    cas_id: int,
    cas_in: CasUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_data_entry_agent)
):
    """✏️ Mettre à jour un cas existant"""
    
    # Vérifier que le cas existe
    cas = crud_cas.get(db, id=cas_id)
    if not cas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cas non trouvé"
        )
    
    # ✅ MISE À JOUR DIRECTE DES CHAMPS
    update_data = cas_in.dict(exclude_unset=True)
    
    # Ne pas permettre de modifier le numéro de cas
    if 'numero_cas' in update_data:
        del update_data['numero_cas']
    
    # Appliquer les modifications
    for field, value in update_data.items():
        setattr(cas, field, value)
    
    # Mettre à jour la date de modification
    cas.updated_at = datetime.now()
    
    db.commit()
    db.refresh(cas)
    
    return cas


# ========================================
# 🗑️ DELETE - SUPPRIMER UN CAS
# ========================================

@router.delete("/{cas_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cas(
    cas_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_data_entry_agent)
):
    """🗑️ Supprimer un cas définitivement"""
    cas = crud_cas.get(db, id=cas_id)
    if not cas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cas non trouvé"
        )
    
    crud_cas.remove(db, id=cas_id)
    return None
