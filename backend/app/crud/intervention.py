# app/crud/intervention.py
from app.crud.base import CRUDBase
from app.models.intervention import Intervention
from app.schemas.intervention import InterventionCreate, InterventionUpdate
from sqlalchemy.orm import Session


class CRUDIntervention(CRUDBase[Intervention, InterventionCreate, InterventionUpdate]):
    def create(self, db: Session, *, obj_in: InterventionCreate, created_by: int) -> Intervention:
        db_obj = Intervention(
            **obj_in.dict(),
            created_by=created_by
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


intervention = CRUDIntervention(Intervention)