# app/schemas/cas.py
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel
from app.utils.enums import CasStatut, Sexe


class CasBase(BaseModel):
    maladie_id: int
    centre_sante_id: int
    district_id: int
    date_symptomes: date
    date_declaration: date
    age: Optional[int] = None
    sexe: Optional[Sexe] = None
    statut: CasStatut = CasStatut.SUSPECT
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    observations: Optional[str] = None


class CasCreate(CasBase):
    pass


class CasUpdate(BaseModel):
    statut: Optional[CasStatut] = None
    observations: Optional[str] = None


class CasResponse(CasBase):
    id: int
    numero_cas: str
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
