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
    nom = Column(String(200), nullable=True)
    
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
    
    # ✅ Relations (avec lazy='joined' pour charger automatiquement)
    maladie = relationship("Maladie", foreign_keys=[maladie_id], lazy='joined')
    centre_sante = relationship("CentreSante", foreign_keys=[centre_sante_id], lazy='joined')
    district = relationship("District", foreign_keys=[district_id], lazy='joined')
    created_by_user = relationship("User", foreign_keys=[created_by])
