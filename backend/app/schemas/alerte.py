from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum

# Enums
class NiveauAlerte(str, Enum):
    INFO = "info"
    AVERTISSEMENT = "avertissement"
    ALERTE = "alerte"
    CRITIQUE = "critique"

class StatutAlerte(str, Enum):
    ACTIVE = "active"
    EN_COURS = "en_cours"
    RESOLUE = "resolue"
    FAUSSE_ALERTE = "fausse_alerte"

# Schémas pour relations
class MaladieInAlerte(BaseModel):
    id: int
    nom: str
    
    class Config:
        from_attributes = True

class DistrictInAlerte(BaseModel):
    id: int
    nom: str
    
    class Config:
        from_attributes = True

# Schéma de base
class AlerteBase(BaseModel):
    type_alerte: str
    niveau_gravite: NiveauAlerte
    maladie_id: int
    district_id: int
    nombre_cas: int
    date_detection: date
    description: str
    actions_recommandees: Optional[str] = None
    responsable: Optional[str] = None

# Création
class AlerteCreate(AlerteBase):
    pass

# Mise à jour
class AlerteUpdate(BaseModel):
    statut: Optional[StatutAlerte] = None
    actions_recommandees: Optional[str] = None
    responsable: Optional[str] = None
    date_resolution: Optional[date] = None

# Réponse
class AlerteResponse(BaseModel):
    id: int
    type_alerte: str
    niveau_gravite: NiveauAlerte
    maladie_id: int
    district_id: int
    nombre_cas: int
    seuil_declenche: Optional[int] = None
    date_detection: date
    date_resolution: Optional[date] = None
    statut: StatutAlerte
    description: str
    actions_recommandees: Optional[str] = None
    responsable: Optional[str] = None
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Relations
    maladie: Optional[MaladieInAlerte] = None
    district: Optional[DistrictInAlerte] = None
    
    class Config:
        from_attributes = True
        use_enum_values = True
