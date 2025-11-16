# app/schemas/cas.py

from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field
from app.utils.enums import CasStatut, Sexe

# ========================================
# 📋 SCHÉMAS POUR LES RELATIONS
# ========================================

class MaladieInCas(BaseModel):
    id: int
    nom: str
    code: Optional[str] = None
    
    class Config:
        from_attributes = True

class DistrictInCas(BaseModel):
    id: int
    nom: str
    code: Optional[str] = None
    
    class Config:
        from_attributes = True

class CentreSanteInCas(BaseModel):
    id: int
    nom: str
    type: Optional[str] = None
    
    class Config:
        from_attributes = True

# ========================================
# 📋 SCHÉMA DE BASE
# ========================================

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

# ========================================
# 📋 SCHÉMA DE RÉPONSE
# ========================================

class CasResponse(BaseModel):
    """Schéma de réponse avec relations"""
    id: int
    numero_cas: str
    maladie_id: int
    centre_sante_id: int
    district_id: int
    date_symptomes: date
    date_declaration: date
    age: Optional[int] = None
    sexe: Optional[Sexe] = None
    statut: CasStatut
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    observations: Optional[str] = None
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # ✅ RELATIONS IMBRIQUÉES
    maladie: Optional[MaladieInCas] = None
    district: Optional[DistrictInCas] = None
    centre_sante: Optional[CentreSanteInCas] = None
    
    class Config:
        from_attributes = True
        use_enum_values = True  # Convertir les Enums en valeurs string
