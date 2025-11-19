# app/api/v1/endpoints/export.py
"""
📄 Fichier: app/api/v1/endpoints/export.py
📝 Description: Endpoints pour exports Excel et CSV
"""

from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.services.export_service import export_service
from app.models.user import User

router = APIRouter()


@router.get("/cas/excel")
def export_cas_excel(
    date_debut: Optional[date] = Query(None),
    date_fin: Optional[date] = Query(None),
    maladie_id: Optional[int] = Query(None),
    district_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """📊 Export des cas en Excel"""
    
    excel_buffer = export_service.export_cas_excel(
        db=db,
        date_debut=date_debut,
        date_fin=date_fin,
        maladie_id=maladie_id,
        district_id=district_id
    )
    
    filename = f"export_cas_{date.today().isoformat()}.xlsx"
    
    return StreamingResponse(
        excel_buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/cas/csv")
def export_cas_csv(
    date_debut: Optional[date] = Query(None),
    date_fin: Optional[date] = Query(None),
    maladie_id: Optional[int] = Query(None),
    district_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """📊 Export des cas en CSV"""
    
    csv_buffer = export_service.export_cas_csv(
        db=db,
        date_debut=date_debut,
        date_fin=date_fin,
        maladie_id=maladie_id,
        district_id=district_id
    )
    
    filename = f"export_cas_{date.today().isoformat()}.csv"
    
    return StreamingResponse(
        csv_buffer,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/alertes/excel")
def export_alertes_excel(
    date_debut: Optional[date] = Query(None),
    date_fin: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """🚨 Export des alertes en Excel"""
    
    excel_buffer = export_service.export_alertes_excel(
        db=db,
        date_debut=date_debut,
        date_fin=date_fin
    )
    
    filename = f"export_alertes_{date.today().isoformat()}.xlsx"
    
    return StreamingResponse(
        excel_buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/interventions/excel")
def export_interventions_excel(
    date_debut: Optional[date] = Query(None),
    date_fin: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """🎯 Export des interventions en Excel"""
    
    excel_buffer = export_service.export_interventions_excel(
        db=db,
        date_debut=date_debut,
        date_fin=date_fin
    )
    
    filename = f"export_interventions_{date.today().isoformat()}.xlsx"
    
    return StreamingResponse(
        excel_buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
