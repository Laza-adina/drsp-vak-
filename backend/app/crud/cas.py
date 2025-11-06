# app/crud/cas.py
from typing import List, Optional
from datetime import date, datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.crud.base import CRUDBase
from app.models.cas import Cas
from app.schemas.cas import CasCreate, CasUpdate


class CRUDCas(CRUDBase[Cas, CasCreate, CasUpdate]):
    def create(self, db: Session, *, obj_in: CasCreate, created_by: int) -> Cas:
        # Générer le numéro de cas unique
        current_year = datetime.now().year
        count = db.query(func.count(Cas.id)).filter(
            func.extract('year', Cas.created_at) == current_year
        ).scalar()
        numero_cas = f"CAS-{current_year}-{str(count + 1).zfill(6)}"
        
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
        return db_obj
    
    def get_by_filters(
        self,
        db: Session,
        *,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None,
        statut: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Cas]:
        query = db.query(Cas)
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        if date_debut:
            query = query.filter(Cas.date_declaration >= date_debut)
        if date_fin:
            query = query.filter(Cas.date_declaration <= date_fin)
        if statut:
            query = query.filter(Cas.statut == statut)
        
        return query.offset(skip).limit(limit).all()
    
    def count_by_filters(
        self,
        db: Session,
        *,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None,
        statut: Optional[str] = None
    ) -> int:
        query = db.query(func.count(Cas.id))
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        if date_debut:
            query = query.filter(Cas.date_declaration >= date_debut)
        if date_fin:
            query = query.filter(Cas.date_declaration <= date_fin)
        if statut:
            query = query.filter(Cas.statut == statut)
        
        return query.scalar()


cas = CRUDCas(Cas)
