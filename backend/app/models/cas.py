# app/models/cas.py
from sqlalchemy import Column, Integer, String, Date, DateTime, Text, Float, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from app.utils.enums import CasStatut, Sexe


class Cas(Base):
    __tablename__ = "cas"
    
    id = Column(Integer, primary_key=True, index=True)
    numero_cas = Column(String, unique=True, nullable=False, index=True)
    
    maladie_id = Column(Integer, ForeignKey("maladies.id"), nullable=False)
    centre_sante_id = Column(Integer, ForeignKey("centres_sante.id"), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    
    date_symptomes = Column(Date, nullable=False)
    date_declaration = Column(Date, nullable=False)
    
    age = Column(Integer, nullable=True)
    sexe = Column(SQLEnum(Sexe), nullable=True)
    statut = Column(SQLEnum(CasStatut), nullable=False, default=CasStatut.SUSPECT)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    observations = Column(Text, nullable=True)
    
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    maladie = relationship("Maladie", back_populates="cas")
    centre_sante = relationship("CentreSante", back_populates="cas")
    district = relationship("District", back_populates="cas")
    created_by_user = relationship("User", back_populates="cas_crees", foreign_keys=[created_by])
