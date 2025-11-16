"""
📄 Fichier: app/api/v1/endpoints/auth.py
📝 Description: Endpoints d'authentification
🎯 Usage: Inscription, connexion, génération JWT
"""

from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_db
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    📝 Inscription d'un nouvel utilisateur
    
    Vérifie que l'email n'existe pas déjà, puis crée le compte utilisateur
    avec le mot de passe hashé.
    """
    # Vérifier si l'email existe déjà
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email est déjà utilisé"
        )
    
    # Créer le nouvel utilisateur
    db_user = User(
        email=user_in.email,
        nom=user_in.nom,
        prenom=user_in.prenom,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        district_id=user_in.district_id,
        centre_sante_id=user_in.centre_sante_id,
        is_active=True  # ✅ Activé par défaut
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """🔐 Connexion"""
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Compte désactivé")
    
    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    # ✅ AJOUTER L'UTILISATEUR DANS LA RÉPONSE
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nom": user.nom,
            "prenom": user.prenom,
            "email": user.email,
            "role": str(user.role.value) if hasattr(user.role, 'value') else str(user.role),
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_login": user.last_login.isoformat() if user.last_login else None,
            "actif": user.is_active
        }
    }
