# app/schemas/centre_sante.py
from typing import Optional
from pydantic import BaseModel
from app.utils.enums import TypeCentreSante


class CentreSanteBase(BaseModel):
    nom: str
    type: TypeCentreSante
    district_id: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    adresse: Optional[str] = None
    capacite_accueil: Optional[int] = None
    a_laboratoire: bool = False
    telephone: Optional[str] = None


class CentreSanteCreate(CentreSanteBase):
    pass


class CentreSanteUpdate(BaseModel):
    nom: Optional[str] = None
    type: Optional[TypeCentreSante] = None
    district_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    adresse: Optional[str] = None
    capacite_accueil: Optional[int] = None
    a_laboratoire: Optional[bool] = None
    telephone: Optional[str] = None


class CentreSanteResponse(CentreSanteBase):
    id: int
    is_active: bool = True
    
    class Config:
        from_attributes = True
