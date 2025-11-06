# app/models/maladie.py
from sqlalchemy import Column, Integer, String, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.enums import ModeTransmission


class Maladie(Base):
    __tablename__ = "maladies"
    
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, unique=True, nullable=False, index=True)
    code_icd10 = Column(String(10), nullable=True)
    mode_transmission = Column(SQLEnum(ModeTransmission), nullable=True)
    periode_incubation_min = Column(Integer, nullable=True)  # jours
    periode_incubation_max = Column(Integer, nullable=True)  # jours
    priorite_surveillance = Column(Integer, default=3)  # 1-5
    description = Column(Text, nullable=True)
    symptomes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Relations
    cas = relationship("Cas", back_populates="maladie")