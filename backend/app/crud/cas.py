# app/crud/cas.py

from typing import List, Optional
from datetime import date, datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, func, extract, text
from app.crud.base import CRUDBase
from app.models.cas import Cas
from app.schemas.cas import CasCreate, CasUpdate


class CRUDCas(CRUDBase[Cas, CasCreate, CasUpdate]):
    """CRUD operations pour les cas"""
    
    # ========================================
    # ➕ CREATE - AVEC GÉNÉRATION NUMÉRO CORRIGÉE
    # ========================================
    
    def create(self, db: Session, *, obj_in: CasCreate, created_by: int) -> Cas:
        """
        Créer un cas avec numéro auto-généré unique
        ✅ CORRECTION : Gère correctement les doublons
        """
        current_year = datetime.now().year
        
        # ✅ Trouver le dernier cas de l'année
        last_cas = db.query(Cas).filter(
            extract('year', Cas.created_at) == current_year
        ).order_by(Cas.id.desc()).first()
        
        if last_cas and last_cas.numero_cas:
            # Extraire le dernier numéro (ex: CAS-2025-000007 → 7)
            try:
                last_number = int(last_cas.numero_cas.split('-')[-1])
                next_number = last_number + 1
            except (ValueError, IndexError):
                # Si erreur de parsing, compter tous les cas
                count = db.query(func.count(Cas.id)).filter(
                    extract('year', Cas.created_at) == current_year
                ).scalar()
                next_number = (count or 0) + 1
        else:
            # Premier cas de l'année
            next_number = 1
        
        # Générer le numéro
        numero_cas = f"CAS-{current_year}-{str(next_number).zfill(6)}"
        
        # ✅ Vérification de sécurité : Si le numéro existe déjà, incrémenter
        max_attempts = 100  # Éviter boucle infinie
        attempts = 0
        while db.query(Cas).filter(Cas.numero_cas == numero_cas).first() and attempts < max_attempts:
            next_number += 1
            numero_cas = f"CAS-{current_year}-{str(next_number).zfill(6)}"
            attempts += 1
        
        if attempts >= max_attempts:
            raise Exception("Impossible de générer un numéro de cas unique")
        
        # Créer le cas
        db_obj = Cas(
            numero_cas=numero_cas,
            maladie_id=obj_in.maladie_id,
            centre_sante_id=obj_in.centre_sante_id,
            district_id=obj_in.district_id,
            date_symptomes=obj_in.date_symptomes,
            date_declaration=obj_in.date_declaration,
            age=obj_in.age,
            sexe=obj_in.sexe,
            statut=obj_in.statut,
            latitude=obj_in.latitude,
            longitude=obj_in.longitude,
            observations=obj_in.observations,
            created_by=created_by
        )
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Recharger avec relations
        return self.get(db, id=db_obj.id)
    
    # ========================================
    # 📋 GET
    # ========================================
    
    def get(self, db: Session, id: int) -> Optional[Cas]:
        """Récupérer un cas avec relations"""
        return db.query(Cas).options(
            joinedload(Cas.maladie),
            joinedload(Cas.district),
            joinedload(Cas.centre_sante)
        ).filter(Cas.id == id).first()
    
    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Cas]:
        """Récupérer plusieurs cas avec relations"""
        return db.query(Cas).options(
            joinedload(Cas.maladie),
            joinedload(Cas.district),
            joinedload(Cas.centre_sante)
        ).offset(skip).limit(limit).all()
    
    # ========================================
    # 🔍 GET BY FILTERS
    # ========================================
    
    def get_by_filters(
        self,
        db: Session,
        *,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        statut: Optional[str] = None,
        date_symptomes_debut: Optional[date] = None,
        date_symptomes_fin: Optional[date] = None,
        date_declaration_debut: Optional[date] = None,
        date_declaration_fin: Optional[date] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Cas]:
        """Récupérer les cas avec filtres avancés"""
        
        # Base query avec relations
        query = db.query(Cas).options(
            joinedload(Cas.maladie),
            joinedload(Cas.district),
            joinedload(Cas.centre_sante)
        )
        
        # Filtres
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        
        if statut:
            # Convertir en enum si c'est une string
            from app.utils.enums import CasStatut
            try:
                if isinstance(statut, str):
                    statut_enum = CasStatut[statut.upper()]
                    query = query.filter(Cas.statut == statut_enum)
                else:
                    query = query.filter(Cas.statut == statut)
            except (KeyError, AttributeError):
                query = query.filter(Cas.statut == statut)
        
        # Filtres par dates symptômes
        if date_symptomes_debut:
            query = query.filter(Cas.date_symptomes >= date_symptomes_debut)
        
        if date_symptomes_fin:
            query = query.filter(Cas.date_symptomes <= date_symptomes_fin)
        
        # Filtres par dates déclaration (compatibilité anciens noms)
        date_decl_debut = date_declaration_debut or date_debut
        date_decl_fin = date_declaration_fin or date_fin
        
        if date_decl_debut:
            query = query.filter(Cas.date_declaration >= date_decl_debut)
        
        if date_decl_fin:
            query = query.filter(Cas.date_declaration <= date_decl_fin)
        
        # Tri et pagination
        query = query.order_by(Cas.date_declaration.desc())
        
        return query.offset(skip).limit(limit).all()
    
    # ========================================
    # 🔢 COUNT BY FILTERS
    # ========================================
    
    def count_by_filters(
        self,
        db: Session,
        *,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        statut: Optional[str] = None,
        date_symptomes_debut: Optional[date] = None,
        date_symptomes_fin: Optional[date] = None,
        date_declaration_debut: Optional[date] = None,
        date_declaration_fin: Optional[date] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None
    ) -> int:
        """Compter les cas selon les filtres"""
        
        query = db.query(func.count(Cas.id))
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        
        if statut:
            from app.utils.enums import CasStatut
            try:
                if isinstance(statut, str):
                    statut_enum = CasStatut[statut.upper()]
                    query = query.filter(Cas.statut == statut_enum)
                else:
                    query = query.filter(Cas.statut == statut)
            except (KeyError, AttributeError):
                query = query.filter(Cas.statut == statut)
        
        if date_symptomes_debut:
            query = query.filter(Cas.date_symptomes >= date_symptomes_debut)
        
        if date_symptomes_fin:
            query = query.filter(Cas.date_symptomes <= date_symptomes_fin)
        
        date_decl_debut = date_declaration_debut or date_debut
        date_decl_fin = date_declaration_fin or date_fin
        
        if date_decl_debut:
            query = query.filter(Cas.date_declaration >= date_decl_debut)
        
        if date_decl_fin:
            query = query.filter(Cas.date_declaration <= date_decl_fin)
        
        return query.scalar()


# Instance du CRUD
cas = CRUDCas(Cas)
