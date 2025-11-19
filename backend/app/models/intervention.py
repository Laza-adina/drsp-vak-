# app/models/intervention.py (MISE À JOUR)
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Float, Enum as SQLEnum, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.enums import TypeIntervention, InterventionStatut

class Intervention(Base):
    __tablename__ = "interventions"
    
    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    type = Column(SQLEnum(TypeIntervention), nullable=False)
    statut = Column(SQLEnum(InterventionStatut), default=InterventionStatut.PLANIFIEE)
    
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    centre_sante_id = Column(Integer, ForeignKey("centres_sante.id"), nullable=True)
    maladie_id = Column(Integer, ForeignKey("maladies.id"), nullable=True)
    
    date_planifiee = Column(Date, nullable=False)
    date_debut = Column(Date, nullable=True)
    date_fin = Column(Date, nullable=True)
    
    chef_equipe = Column(String, nullable=True)
    membres_equipe = Column(Text, nullable=True)
    
    population_cible = Column(Integer, nullable=True)
    population_atteinte = Column(Integer, nullable=True)
    
    budget_alloue = Column(Float, nullable=True)
    ressources_utilisees = Column(Text, nullable=True)
    
    resultats = Column(Text, nullable=True)
    efficacite_score = Column(Integer, nullable=True)

    recommandation_ia = Column(Text, nullable=True)
    generee_par_ia = Column(Boolean, default=False, nullable=False)
    alerte_id = Column(Integer, ForeignKey("alertes.id"), nullable=True)
    
    # 🆕 NOUVEAUX CHAMPS IA
    recommandation_ia = Column(Text, nullable=True)  # JSON de la recommandation Groq
    generee_par_ia = Column(Boolean, default=False, nullable=False)
    alerte_id = Column(Integer, ForeignKey("alertes.id"), nullable=True)
    
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 🆕 RELATIONS
    district = relationship("District", back_populates="interventions")
    centre_sante = relationship("CentreSante", back_populates="interventions")
    maladie = relationship("Maladie", back_populates="interventions")
    alerte = relationship("Alerte", back_populates="interventions")
    createur = relationship("User", foreign_keys=[created_by])
