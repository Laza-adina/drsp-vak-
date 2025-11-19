"""
📄 Fichier: app/models/maladie.py
📝 Description: Modèle de la table maladies avec seuils d'alerte
"""

from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Maladie(Base):
    __tablename__ = "maladies"
    
    # Colonnes de base
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, unique=True, nullable=False, index=True)
    code = Column(String(10), nullable=True)
    code_icd10 = Column(String(10), nullable=True)
    
    # Seuils d'alerte (NOUVEAUX)
    seuil_alerte = Column(Integer, default=5, nullable=False)
    seuil_epidemie = Column(Integer, default=10, nullable=False)
    
    # Autres paramètres
    priorite_surveillance = Column(Integer, default=3, nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relations
    cas = relationship("Cas", back_populates="maladie")
    alertes = relationship("Alerte", back_populates="maladie")
    interventions = relationship("Intervention", back_populates="maladie")
