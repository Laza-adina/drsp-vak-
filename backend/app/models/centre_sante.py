# app/models/centre_sante.py
from sqlalchemy import Column, Integer, String, Float, Boolean, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.utils.enums import TypeCentreSante


class CentreSante(Base):
    __tablename__ = "centres_sante"
    
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    type = Column(SQLEnum(TypeCentreSante), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    adresse = Column(String, nullable=True)
    capacite_accueil = Column(Integer, nullable=True)
    a_laboratoire = Column(Boolean, default=False)
    telephone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relations
    district = relationship("District", back_populates="centres_sante")
    users = relationship("User", back_populates="centre_sante")
    cas = relationship("Cas", back_populates="centre_sante")
