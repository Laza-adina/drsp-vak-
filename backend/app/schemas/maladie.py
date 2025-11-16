# app/schemas/maladie.py
from typing import Optional
from pydantic import BaseModel
from app.utils.enums import ModeTransmission


class MaladieBase(BaseModel):
    nom: str
    code_icd10: Optional[str] = None
    mode_transmission: Optional[ModeTransmission] = None
    periode_incubation_min: Optional[int] = None
    periode_incubation_max: Optional[int] = None
    priorite_surveillance: int = 3
    description: Optional[str] = None
    symptomes: Optional[str] = None
    is_active: bool = True


class MaladieCreate(MaladieBase):
    pass


class MaladieUpdate(BaseModel):
    nom: Optional[str] = None
    code_icd10: Optional[str] = None
    mode_transmission: Optional[ModeTransmission] = None
    periode_incubation_min: Optional[int] = None
    periode_incubation_max: Optional[int] = None
    priorite_surveillance: Optional[int] = None
    description: Optional[str] = None
    symptomes: Optional[str] = None
    is_active: Optional[bool] = None


class MaladieResponse(MaladieBase):
    id: int
    is_active: bool = True
    
    class Config:
        from_attributes = True