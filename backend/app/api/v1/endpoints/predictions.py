# app/api/v1/endpoints/predictions.py
"""
📄 Fichier: app/api/v1/endpoints/predictions.py
📝 Description: Endpoints pour les prédictions IA
"""

from typing import Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.deps import get_db, get_current_active_user
from app.services.prediction_service import prediction_service
from app.models.user import User

router = APIRouter()


class PredictionRequest(BaseModel):
    maladie_id: int
    district_id: Optional[int] = None
    horizon_jours: int = 14  # 7, 14, ou 30
    jours_historique: int = 90


# app/api/v1/endpoints/predictions.py
# VÉRIFIE que cette partie existe dans l'endpoint generer_predictions

@router.post("/generer", response_model=Dict)
async def generer_predictions(
    request: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """🤖 Génère des prédictions avec Prophet"""
    
    if request.horizon_jours not in [7, 14, 30]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="horizon_jours doit être 7, 14 ou 30"
        )
    
    result = prediction_service.predire_cas_futurs(
        db=db,
        maladie_id=request.maladie_id,
        district_id=request.district_id,
        horizon_jours=request.horizon_jours,
        jours_historique=request.jours_historique
    )
    
    # GÉNÈRE L'ANALYSE IA
    if result.get("success"):
        from app.models.maladie import Maladie
        from app.models.district import District
        
        maladie = db.query(Maladie).filter(Maladie.id == request.maladie_id).first()
        district = db.query(District).filter(District.id == request.district_id).first() if request.district_id else None
        
        analyse = prediction_service.analyser_predictions_avec_ia(
            predictions=result["predictions"],
            metriques=result["metriques"],
            maladie_nom=maladie.nom if maladie else "Inconnue",
            district_nom=district.nom if district else "Tous districts"
        )
        
        result["analyse_ia"] = analyse
        
        # ✅ SAUVEGARDE TOUJOURS (correction ici)
        # Utilise district_id=1 par défaut si non spécifié (ou un district "global")
        district_pour_sauvegarde = request.district_id if request.district_id else 1
        
        try:
            prediction_service.sauvegarder_prediction(
                db=db,
                maladie_id=request.maladie_id,
                district_id=district_pour_sauvegarde,  # ✅ Toujours un district
                predictions=result["predictions"],
                metriques=result["metriques"],
                created_by=current_user.id
            )
            print(f"✅ {len(result['predictions'])} prédictions sauvegardées")
        except Exception as e:
            print(f"⚠️ Erreur sauvegarde prédiction: {e}")
            import traceback
            traceback.print_exc()
            # N'interrompt pas le processus même en cas d'erreur
    
    return result



@router.get("/historique")
def get_predictions_historique(
    maladie_id: int = Query(...),
    district_id: Optional[int] = Query(None),
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Récupère l'historique des prédictions"""
    
    from app.models.prediction import Prediction
    
    query = db.query(Prediction).filter(
        Prediction.maladie_id == maladie_id
    )
    
    if district_id:
        query = query.filter(Prediction.district_id == district_id)
    
    predictions = query.order_by(Prediction.created_at.desc()).limit(limit).all()
    
    return [{
        "id": p.id,
        "date_prediction": p.date_prediction.isoformat(),
        "cas_predits": p.cas_predits,
        "intervalle_min": p.intervalle_min,
        "intervalle_max": p.intervalle_max,
        "confiance_score": p.confiance_score,
        "created_at": p.created_at.isoformat()
    } for p in predictions]
