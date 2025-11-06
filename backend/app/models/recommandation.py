# app/models/recommandation.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.core.database import Base
from app.utils.enums import TypeIntervention


class Recommandation(Base):
    __tablename__ = "recommandations"
    
    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    type_action = Column(SQLEnum(TypeIntervention), nullable=False)
    priorite = Column(Integer, nullable=False)  # 1-5
    
    maladie_id = Column(Integer, ForeignKey("maladies.id"), nullable=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    
    population_cible = Column(Integer, nullable=True)
    duree_estimee_jours = Column(Integer, nullable=True)
    ressources_necessaires = Column(Text, nullable=True)
    justification = Column(Text, nullable=True)
    
    est_approuvee = Column(Boolean, default=False)
    est_rejetee = Column(Boolean, default=False)
    notes_decision = Column(Text, nullable=True)
    
    anomalie_id = Column(Integer, ForeignKey("anomalies.id"), nullable=True)
    
    approuvee_par = Column(Integer, ForeignKey("users.id"), nullable=True)
    intervention_id = Column(Integer, ForeignKey("interventions.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())