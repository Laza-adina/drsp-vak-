# app/api/v1/endpoints/rapports.py
"""
📄 Fichier: app/api/v1/endpoints/rapports.py
📝 Description: Endpoints pour génération de rapports avec IA
"""

from datetime import date, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.services.rapport_service import rapport_service
from app.services.rapport_ia_service import rapport_ia_service
from app.models.user import User

router = APIRouter()


@router.get("/hebdomadaire/pdf")
def rapport_hebdomadaire_pdf(
    date_debut: date = Query(...),
    date_fin: date = Query(...),
    district_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """📊 Rapport hebdomadaire PDF avec analyse IA"""
    
    pdf_buffer = rapport_service.generate_rapport_hebdomadaire(
        db=db,
        date_debut=date_debut,
        date_fin=date_fin,
        district_id=district_id
    )
    
    filename = f"rapport_hebdomadaire_{date_debut}_{date_fin}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/interventions/pdf")
def rapport_interventions_pdf(
    date_debut: date = Query(...),
    date_fin: date = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """🎯 Rapport des interventions avec analyse d'efficacité"""
    
    pdf_buffer = rapport_service.generate_rapport_interventions(
        db=db,
        date_debut=date_debut,
        date_fin=date_fin
    )
    
    filename = f"rapport_interventions_{date_debut}_{date_fin}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/predictions/pdf")
def rapport_predictions_pdf(
    maladie_id: int = Query(...),
    district_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """🤖 Rapport de prédictions IA avec analyses"""
    
    pdf_buffer = rapport_service.generate_rapport_predictions(
        db=db,
        maladie_id=maladie_id,
        district_id=district_id
    )
    
    filename = f"rapport_predictions_maladie_{maladie_id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/global/pdf")
def rapport_global_pdf(
    annee: int = Query(..., ge=2020, le=2030),
    trimestre: Optional[int] = Query(None, ge=1, le=4),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """📈 Rapport global du système avec statistiques complètes"""
    
    pdf_buffer = rapport_service.generate_rapport_global(
        db=db,
        annee=annee,
        trimestre=trimestre
    )
    
    filename = f"rapport_global_{annee}{'_T'+str(trimestre) if trimestre else ''}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
