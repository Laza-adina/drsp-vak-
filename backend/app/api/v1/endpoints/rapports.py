# app/api/v1/endpoints/rapports.py
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_epidemiologist
from app.services.rapport_service import rapport_service
from app.models.user import User

router = APIRouter()


@router.get("/hebdomadaire")
def generer_rapport_hebdomadaire(
    date_debut: date = Query(..., description="Date de début de la semaine"),
    date_fin: date = Query(..., description="Date de fin de la semaine"),
    district_id: Optional[int] = Query(None, description="ID du district (optionnel)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """
    Génère un rapport hebdomadaire au format PDF
    (Épidémiologiste, Admin uniquement)
    """
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
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


@router.get("/mensuel")
def generer_rapport_mensuel(
    annee: int = Query(..., description="Année", ge=2020, le=2030),
    mois: int = Query(..., description="Mois", ge=1, le=12),
    district_id: Optional[int] = Query(None, description="ID du district (optionnel)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_epidemiologist)
):
    """
    Génère un rapport mensuel au format PDF
    (Épidémiologiste, Admin uniquement)
    """
    pdf_buffer = rapport_service.generate_rapport_mensuel(
        db=db,
        annee=annee,
        mois=mois,
        district_id=district_id
    )
    
    filename = f"rapport_mensuel_{annee}_{mois:02d}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )