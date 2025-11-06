# app/schemas/intervention.py
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel
from app.utils.enums import TypeIntervention, InterventionStatut


class InterventionBase(BaseModel):
    titre: str
    description: Optional[str] = None
    type: TypeIntervention
    district_id: int
    centre_sante_id: Optional[int] = None
    maladie_id: Optional[int] = None
    date_planifiee: date
    chef_equipe: Optional[str] = None
    membres_equipe: Optional[str] = None
    population_cible: Optional[int] = None
    budget_alloue: Optional[float] = None


class InterventionCreate(InterventionBase):
    pass


class InterventionUpdate(BaseModel):
    statut: Optional[InterventionStatut] = None
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    population_atteinte: Optional[int] = None
    ressources_utilisees: Optional[str] = None
    resultats: Optional[str] = None
    efficacite_score: Optional[int] = None


class InterventionResponse(InterventionBase):
    id: int
    statut: InterventionStatut
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    population_atteinte: Optional[int] = None
    ressources_utilisees: Optional[str] = None
    resultats: Optional[str] = None
    efficacite_score: Optional[int] = None
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True