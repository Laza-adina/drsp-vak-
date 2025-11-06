# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from app.utils.enums import UserRole


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.LECTEUR)
    is_active = Column(Boolean, default=True)
    
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    centre_sante_id = Column(Integer, ForeignKey("centres_sante.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relations
    district = relationship("District", back_populates="users")
    centre_sante = relationship("CentreSante", back_populates="users")
    cas_crees = relationship("Cas", back_populates="created_by_user", foreign_keys="Cas.created_by")
