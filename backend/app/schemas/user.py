"""
📄 Fichier: app/schemas/user.py
📝 Description: Schémas Pydantic pour les utilisateurs
🎯 Usage: Validation et sérialisation des données utilisateurs
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
from app.utils.enums import UserRole


# ========================================
# 📋 SCHÉMA DE BASE UTILISATEUR
# ========================================

class UserBase(BaseModel):
    """
    Schéma de base contenant les champs communs pour les utilisateurs
    """
    email: EmailStr
    nom: str
    prenom: str
    role: UserRole
    district_id: Optional[int] = None
    centre_sante_id: Optional[int] = None
    
    # ========================================
    # ✅ VALIDATEUR: NORMALISATION DU RÔLE
    # ========================================
    @field_validator('role', mode='before')
    @classmethod
    def normalize_role(cls, v):
        """
        Convertit le rôle en MAJUSCULES pour accepter tous les formats
        Exemples: 'lecteur' -> 'LECTEUR', 'Administrateur' -> 'ADMINISTRATEUR'
        """
        if isinstance(v, str):
            return v.upper()
        return v
    
    # ========================================
    # ✅ VALIDATEUR: CLÉS ÉTRANGÈRES OPTIONNELLES
    # ========================================
    @field_validator('district_id', 'centre_sante_id', mode='before')
    @classmethod
    def convert_zero_to_none(cls, v):
        """
        Convertit 0 ou chaîne vide en None pour les clés étrangères optionnelles
        PostgreSQL accepte NULL mais refuse 0 si la référence n'existe pas
        """
        if v == 0 or v == "" or v is None:
            return None
        return v


# ========================================
# 📝 SCHÉMA DE CRÉATION UTILISATEUR
# ========================================

class UserCreate(UserBase):
    """
    Schéma pour la création d'un nouvel utilisateur
    Hérite de UserBase et ajoute le champ password
    """
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """
        Validation basique du mot de passe
        Minimum 6 caractères (ajustez selon vos besoins)
        """
        if len(v) < 6:
            raise ValueError('Le mot de passe doit contenir au moins 6 caractères')
        return v


# ========================================
# 🔄 SCHÉMA DE MISE À JOUR UTILISATEUR
# ========================================

class UserUpdate(BaseModel):
    """
    Schéma pour la mise à jour d'un utilisateur existant
    Tous les champs sont optionnels pour permettre des mises à jour partielles
    """
    email: Optional[EmailStr] = None
    nom: Optional[str] = None
    prenom: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    district_id: Optional[int] = None
    centre_sante_id: Optional[int] = None
    
    # ========================================
    # ✅ VALIDATEURS IDENTIQUES À UserBase
    # ========================================
    @field_validator('role', mode='before')
    @classmethod
    def normalize_role(cls, v):
        """Convertit le rôle en MAJUSCULES"""
        if v is not None and isinstance(v, str):
            return v.upper()
        return v
    
    @field_validator('district_id', 'centre_sante_id', mode='before')
    @classmethod
    def convert_zero_to_none(cls, v):
        """Convertit 0 en None pour les clés étrangères"""
        if v == 0 or v == "":
            return None
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validation du mot de passe si fourni"""
        if v is not None and len(v) < 6:
            raise ValueError('Le mot de passe doit contenir au moins 6 caractères')
        return v


# ========================================
# 📤 SCHÉMA DE RÉPONSE UTILISATEUR
# ========================================

class UserResponse(UserBase):
    """
    Schéma pour les réponses API contenant les informations utilisateur
    Inclut les champs générés automatiquement (id, dates, etc.)
    """
    id: int
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        """
        Configuration Pydantic pour la compatibilité avec SQLAlchemy
        from_attributes=True permet de créer le schéma depuis un objet ORM
        """
        from_attributes = True
