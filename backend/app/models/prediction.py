# app/models/prediction.py
from sqlalchemy import Column, Integer, Float, Date, DateTime, Text, ForeignKey, String
from sqlalchemy.sql import func
from app.core.database import Base


class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    maladie_id = Column(Integer, ForeignKey("maladies.id"), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    
    date_prediction = Column(Date, nullable=False)
    horizon_jours = Column(Integer, nullable=False)  # 7, 14, 30
    
    cas_predits = Column(Float, nullable=False)
    intervalle_min = Column(Float, nullable=True)
    intervalle_max = Column(Float, nullable=True)
    confiance_score = Column(Float, nullable=True)  # 0-1
    
    modele_utilise = Column(String, default="LSTM")
    parametres = Column(Text, nullable=True)  # JSON
    
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
