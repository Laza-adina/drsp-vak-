# app/schemas/alerte.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.utils.enums import AlerteNiveau, AlerteStatut


class AlerteBase(BaseModel):
    titre: str
    message: str
    niveau: AlerteNiveau
    maladie_id: Optional[int] = None
    district_id: Optional[int] = None


class AlerteCreate(AlerteBase):
    source: Optional[str] = "Utilisateur"


class AlerteUpdate(BaseModel):
    statut: Optional[AlerteStatut] = None
    responsable_id: Optional[int] = None
    actions_entreprises: Optional[str] = None


class AlerteResponse(AlerteBase):
    id: int
    statut: AlerteStatut
    source: Optional[str] = None
    is_automatic: bool
    created_by: int
    created_at: datetime
    resolved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True