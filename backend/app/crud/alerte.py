# app/crud/alerte.py
from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.alerte import Alerte
from app.schemas.alerte import AlerteCreate, AlerteUpdate
from app.utils.enums import AlerteStatut


class CRUDAlerte(CRUDBase[Alerte, AlerteCreate, AlerteUpdate]):
    def get_active(self, db: Session) -> List[Alerte]:
        return db.query(Alerte).filter(
            Alerte.statut.in_([AlerteStatut.ACTIVE, AlerteStatut.EN_COURS])
        ).all()
    
    def create(self, db: Session, *, obj_in: AlerteCreate, created_by: int) -> Alerte:
        db_obj = Alerte(
            titre=obj_in.titre,
            message=obj_in.message,
            niveau=obj_in.niveau,
            maladie_id=obj_in.maladie_id,
            district_id=obj_in.district_id,
            source=obj_in.source,
            created_by=created_by
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


alerte = CRUDAlerte(Alerte)