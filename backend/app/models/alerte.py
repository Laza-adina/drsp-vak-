# app/models/alerte.py (MISE À JOUR)
from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Alerte(Base):
    __tablename__ = "alertes"
    
    id = Column(Integer, primary_key=True, index=True)
    type_alerte = Column(String(100), nullable=False)
    niveau_gravite = Column(
        SQLEnum('info', 'avertissement', 'alerte', 'critique', name='niveau_alerte'),
        nullable=False
    )
    maladie_id = Column(Integer, ForeignKey("maladies.id"), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    nombre_cas = Column(Integer, nullable=False)
    seuil_declenche = Column(Integer, nullable=True)
    date_detection = Column(Date, nullable=False)
    date_resolution = Column(Date, nullable=True)
    statut = Column(
        SQLEnum('active', 'en_cours', 'resolue', 'fausse_alerte', name='statut_alerte'),
        default='active',
        nullable=False
    )
    description = Column(Text, nullable=False)
    actions_recommandees = Column(Text, nullable=True)
    action_ia_suggeree = Column(Text, nullable=True)
    
    # 🆕 NOUVEAU CHAMP IA
    action_ia_suggeree = Column(Text, nullable=True)
    
    responsable = Column(String(200), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relations
    maladie = relationship("Maladie", back_populates="alertes")
    district = relationship("District", back_populates="alertes")
    created_by_user = relationship("User", foreign_keys=[created_by])
    interventions = relationship("Intervention", back_populates="alerte")  # 🆕
