# app/models/district.py
from sqlalchemy import Column, Integer, String, Float, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class District(Base):
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, unique=True, nullable=False, index=True)
    code = Column(String(10), unique=True, nullable=True)
    population = Column(Integer, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    # Relations
    centres_sante = relationship("CentreSante", back_populates="district")
    users = relationship("User", back_populates="district")
    cas = relationship("Cas", back_populates="district")
    alertes = relationship("Alerte", back_populates="district")
    interventions = relationship("Intervention", back_populates="district")