from pydantic import BaseModel, Field
from typing import Optional

# Schéma de base
class MaladieBase(BaseModel):
    nom: str
    code: Optional[str] = None
    code_icd10: Optional[str] = None
    seuil_alerte: int = Field(default=5, ge=0, description="Seuil pour déclencher une alerte")
    seuil_epidemie: int = Field(default=10, ge=0, description="Seuil pour déclarer une épidémie")
    priorite_surveillance: Optional[int] = Field(default=3, ge=1, le=5)
    description: Optional[str] = None
    is_active: bool = True

# Création
class MaladieCreate(MaladieBase):
    pass

# Mise à jour
class MaladieUpdate(BaseModel):
    nom: Optional[str] = None
    code: Optional[str] = None
    code_icd10: Optional[str] = None
    seuil_alerte: Optional[int] = None
    seuil_epidemie: Optional[int] = None
    priorite_surveillance: Optional[int] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

# Réponse
class MaladieResponse(BaseModel):
    id: int
    nom: str
    code: Optional[str] = None
    code_icd10: Optional[str] = None
    seuil_alerte: int
    seuil_epidemie: int
    priorite_surveillance: int
    description: Optional[str] = None
    is_active: bool
    
    class Config:
        from_attributes = True
