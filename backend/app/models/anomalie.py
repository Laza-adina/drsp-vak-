# app/models/anomalie.py
from sqlalchemy import Column, Integer, Float, Date, DateTime, Text, Enum as SQLEnum, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.core.database import Base
from app.utils.enums import AnomalieSeverite


class Anomalie(Base):
    __tablename__ = "anomalies"
    
    id = Column(Integer, primary_key=True, index=True)
    
    maladie_id = Column(Integer, ForeignKey("maladies.id"), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    
    date_anomalie = Column(Date, nullable=False)
    cas_observes = Column(Integer, nullable=False)
    cas_attendus = Column(Float, nullable=False)
    z_score = Column(Float, nullable=True)
    severite = Column(SQLEnum(AnomalieSeverite), nullable=False)
    
    est_validee = Column(Boolean, default=False)
    est_fausse_alerte = Column(Boolean, default=False)
    notes_validation = Column(Text, nullable=True)
    
    valide_par = Column(Integer, ForeignKey("users.id"), nullable=True)
    alerte_id = Column(Integer, ForeignKey("alertes.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())