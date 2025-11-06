# app/models/alerte.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from app.utils.enums import AlerteNiveau, AlerteStatut


class Alerte(Base):
    __tablename__ = "alertes"
    
    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    niveau = Column(SQLEnum(AlerteNiveau), nullable=False)
    statut = Column(SQLEnum(AlerteStatut), default=AlerteStatut.ACTIVE)
    
    maladie_id = Column(Integer, ForeignKey("maladies.id"), nullable=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    
    source = Column(String, nullable=True)  # "IA" ou "Utilisateur"
    is_automatic = Column(Boolean, default=False)
    
    responsable_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    
    actions_entreprises = Column(Text, nullable=True)