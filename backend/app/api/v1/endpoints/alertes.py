"""
📄 Fichier: app/api/v1/endpoints/alertes.py
📝 Description: Endpoints pour la gestion des alertes
"""

from typing import List, Optional
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.deps import get_db, get_current_active_user
from app.crud import alerte as crud_alerte
from app.schemas.alerte import AlerteResponse, AlerteCreate, AlerteUpdate
from app.models.user import User
from app.models.alerte import Alerte
from app.models.cas import Cas
from app.services.ai_service import AIService
from app.models.intervention import Intervention

router = APIRouter()

class ResolveAlerteRequest(BaseModel):
    actions: str

# ========================================
# ✅ POST - RÉSOUDRE UNE ALERTE (CORRIGÉ)
# ========================================

@router.post("/{alerte_id}/resolve", response_model=AlerteResponse)
def resolve_alerte(
    alerte_id: int,
    request: ResolveAlerteRequest,  # ✅ Body au lieu de Query
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """✅ Marquer une alerte comme résolue"""
    alerte = crud_alerte.get(db, id=alerte_id)
    
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte non trouvée"
        )
    
    # Marquer comme résolue
    alerte.statut = 'resolue'
    alerte.date_resolution = date.today()
    alerte.actions_recommandees = request.actions
    alerte.updated_at = datetime.now()
    
    db.commit()
    db.refresh(alerte)
    
    return alerte

# ========================================
# 📋 GET - LISTE DES ALERTES
# ========================================

@router.get("", response_model=List[AlerteResponse])
def read_alertes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    statut: Optional[str] = Query(None),
    niveau_gravite: Optional[str] = Query(None),
    maladie_id: Optional[int] = Query(None),
    district_id: Optional[int] = Query(None),
    date_debut: Optional[date] = Query(None),
    date_fin: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    📋 Récupérer la liste des alertes avec filtres
    """
    alertes = crud_alerte.get_by_filters(
        db,
        statut=statut,
        niveau_gravite=niveau_gravite,
        maladie_id=maladie_id,
        district_id=district_id,
        date_debut=date_debut,
        date_fin=date_fin,
        skip=skip,
        limit=limit
    )
    return alertes

# ========================================
# 👁️ GET BY ID
# ========================================

@router.get("/{alerte_id}", response_model=AlerteResponse)
def read_alerte(
    alerte_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """👁️ Récupérer une alerte par ID"""
    alerte = crud_alerte.get(db, id=alerte_id)
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte non trouvée"
        )
    return alerte

# ========================================
# 🔢 COUNT ACTIVE
# ========================================

@router.get("/count/active", response_model=dict)
def count_active_alertes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """🔢 Compter les alertes actives"""
    count = crud_alerte.count_active(db)
    return {"count": count}

# ========================================
# ➕ POST - CRÉER UNE ALERTE
# ========================================

@router.post("", response_model=AlerteResponse, status_code=status.HTTP_201_CREATED)
def create_alerte(
    alerte_in: AlerteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """➕ Créer une nouvelle alerte manuelle"""
    
    # Créer l'alerte
    db_alerte = Alerte(
        type_alerte=alerte_in.type_alerte,
        niveau_gravite=alerte_in.niveau_gravite,
        maladie_id=alerte_in.maladie_id,
        district_id=alerte_in.district_id,
        nombre_cas=alerte_in.nombre_cas,
        date_detection=alerte_in.date_detection,
        description=alerte_in.description,
        actions_recommandees=alerte_in.actions_recommandees,
        responsable=alerte_in.responsable,
        statut='active',
        created_by=current_user.id
    )
    
    db.add(db_alerte)
    db.commit()
    db.refresh(db_alerte)
    
    return db_alerte

# ========================================
# ✏️ PUT - METTRE À JOUR
# ========================================

@router.put("/{alerte_id}", response_model=AlerteResponse)
def update_alerte(
    alerte_id: int,
    alerte_in: AlerteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """✏️ Mettre à jour une alerte"""
    alerte = crud_alerte.get(db, id=alerte_id)
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte non trouvée"
        )
    
    update_data = alerte_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alerte, field, value)
    
    alerte.updated_at = datetime.now()
    db.commit()
    db.refresh(alerte)
    
    return alerte

# ========================================
# ✅ POST - RÉSOUDRE UNE ALERTE
# ========================================

@router.post("/{alerte_id}/resolve", response_model=AlerteResponse)
def resolve_alerte(
    alerte_id: int,
    actions: str = Query(..., description="Actions entreprises"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """✅ Marquer une alerte comme résolue"""
    alerte = crud_alerte.resolve(
        db,
        alerte_id=alerte_id,
        actions=actions,
        resolved_date=date.today()
    )
    
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte non trouvée"
        )
    
    return alerte

# ========================================
# 🔍 POST - VÉRIFIER LES SEUILS
# ========================================

@router.post("/check-thresholds", response_model=List[dict])
def check_thresholds(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🔍 Vérifier les seuils et générer des alertes automatiques
    
    Règles :
    - critique : cas >= seuil_epidemie
    - alerte : seuil_alerte <= cas < seuil_epidemie  
    - avertissement : seuil_alerte/2 <= cas < seuil_alerte
    """
    from datetime import timedelta
    from sqlalchemy import func
    from app.models.maladie import Maladie
    from app.models.district import District
    
    nouvelles_alertes = []
    date_limite = date.today() - timedelta(days=7)
    
    # Analyser par maladie et district
    stats = db.query(
        Cas.maladie_id,
        Cas.district_id,
        func.count(Cas.id).label('nombre_cas')
    ).filter(
        Cas.date_symptomes >= date_limite,
        Cas.maladie_id.isnot(None),
        Cas.district_id.isnot(None)
    ).group_by(
        Cas.maladie_id,
        Cas.district_id
    ).all()
    
    for stat in stats:
        maladie_id, district_id, nombre_cas = stat
        
        # Récupérer la maladie avec ses seuils
        maladie = db.query(Maladie).filter(Maladie.id == maladie_id).first()
        if not maladie:
            continue
        
        # Récupérer le district
        district = db.query(District).filter(District.id == district_id).first()
        district_nom = district.nom if district else "District inconnu"
        
        # Vérifier si une alerte active existe déjà
        alerte_existante = db.query(Alerte).filter(
            Alerte.maladie_id == maladie_id,
            Alerte.district_id == district_id,
            Alerte.statut == 'active'
        ).first()
        
        # Si une alerte existe, mettre à jour le niveau si nécessaire
        if alerte_existante:
            # Vérifier si le niveau doit être augmenté
            niveau_actuel = alerte_existante.niveau_gravite
            nouveau_niveau = None
            
            if nombre_cas >= maladie.seuil_epidemie and niveau_actuel != 'critique':
                nouveau_niveau = 'critique'
                alerte_existante.type_alerte = 'Épidémie confirmée'
            elif nombre_cas >= maladie.seuil_alerte and nombre_cas < maladie.seuil_epidemie and niveau_actuel == 'avertissement':
                nouveau_niveau = 'alerte'
                alerte_existante.type_alerte = 'Cluster important'
            
            if nouveau_niveau:
                alerte_existante.niveau_gravite = nouveau_niveau
                alerte_existante.nombre_cas = nombre_cas
                alerte_existante.description = f"Alerte mise à jour : {nombre_cas} cas de {maladie.nom} à {district_nom} en 7 jours (seuil : {maladie.seuil_epidemie if nouveau_niveau == 'critique' else maladie.seuil_alerte})"
                db.commit()
            else:
                # Juste mettre à jour le nombre de cas
                alerte_existante.nombre_cas = nombre_cas
                db.commit()
            continue
        
        # Déterminer le niveau de gravité selon les seuils
        niveau = None
        type_alerte = None
        seuil = None
        
        # ✅ CRITIQUE : >= seuil épidémie
        if nombre_cas >= maladie.seuil_epidemie:
            niveau = 'critique'
            type_alerte = 'Épidémie confirmée'
            seuil = maladie.seuil_epidemie
        
        # ✅ ALERTE : >= seuil alerte mais < seuil épidémie
        elif nombre_cas >= maladie.seuil_alerte:
            niveau = 'alerte'
            type_alerte = 'Cluster important'
            seuil = maladie.seuil_alerte
        
        # ✅ AVERTISSEMENT : >= moitié du seuil alerte
        elif nombre_cas >= max(3, maladie.seuil_alerte // 2):
            niveau = 'avertissement'
            type_alerte = 'Augmentation inhabituelle'
            seuil = maladie.seuil_alerte // 2
        
        # Créer l'alerte si un seuil est dépassé
        if niveau and type_alerte:
            nouvelle_alerte = Alerte(
                type_alerte=type_alerte,
                niveau_gravite=niveau,
                maladie_id=maladie_id,
                district_id=district_id,
                nombre_cas=nombre_cas,
                seuil_declenche=seuil,
                date_detection=date.today(),
                description=f"{type_alerte} : {nombre_cas} cas de {maladie.nom} à {district_nom} en 7 jours (seuil : {seuil})",
                statut='active',
                created_by=current_user.id
            )
            
            db.add(nouvelle_alerte)
            nouvelles_alertes.append(nouvelle_alerte)
    
    # Sauvegarder toutes les nouvelles alertes
    if nouvelles_alertes:
        db.commit()
        for alerte in nouvelles_alertes:
            db.refresh(alerte)
    
    # Retourner la liste des alertes créées
    return [
        {
            "id": a.id,
            "type_alerte": a.type_alerte,
            "niveau_gravite": a.niveau_gravite,
            "maladie_id": a.maladie_id,
            "maladie": {"id": a.maladie.id, "nom": a.maladie.nom} if a.maladie else None,
            "district_id": a.district_id,
            "district": {"id": a.district.id, "nom": a.district.nom} if a.district else None,
            "nombre_cas": a.nombre_cas,
            "seuil_declenche": a.seuil_declenche,
            "date_detection": str(a.date_detection),
            "statut": a.statut,
            "description": a.description,
        }
        for a in nouvelles_alertes
    ]




# ========================================
# 🗑️ DELETE
# ========================================

@router.delete("/{alerte_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alerte(
    alerte_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """🗑️ Supprimer une alerte"""
    alerte = crud_alerte.get(db, id=alerte_id)
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte non trouvée"
        )
    
    crud_alerte.remove(db, id=alerte_id)
    return None

# ========================================
# 🤖 SUGGESTION ACTION IA POUR ALERTE
# ========================================

@router.post("/{alerte_id}/suggerer-action-ia", response_model=dict)
async def suggerer_action_ia_pour_alerte(
    alerte_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    🤖 Suggère une action IA pour une alerte active
    
    Utilise Groq pour générer une recommandation d'action
    prioritaire en fonction du contexte épidémiologique.
    """
    
    alerte = db.query(Alerte).filter(Alerte.id == alerte_id).first()
    if not alerte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerte introuvable"
        )
    
    # Compte interventions en cours pour cette alerte
    nb_interventions = db.query(Intervention).filter(
        Intervention.alerte_id == alerte_id,
        Intervention.statut.in_(["planifiee", "en_cours"])
    ).count()
    
    # 🤖 Appel IA
    action = await AIService.suggerer_action_alerte(
        alerte={
            "maladie_nom": alerte.maladie.nom if alerte.maladie else "Inconnu",
            "district_nom": alerte.district.nom if alerte.district else "Inconnu",
            "niveau_gravite": alerte.niveau_gravite,
        },
        nb_cas=alerte.nombre_cas,
        interventions_en_cours=nb_interventions
    )
    
    # Sauvegarde suggestion dans la DB
    alerte.action_ia_suggeree = action
    db.commit()
    
    return {
        "success": True,
        "action_suggeree": action,
        "alerte_id": alerte_id
    }