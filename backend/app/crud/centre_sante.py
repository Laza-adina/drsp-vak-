# app/crud/centre_sante.py
from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.centre_sante import CentreSante
from app.schemas.centre_sante import CentreSanteCreate, CentreSanteUpdate


class CRUDCentreSante(CRUDBase[CentreSante, CentreSanteCreate, CentreSanteUpdate]):
    def get_by_district(self, db: Session, *, district_id: int) -> List[CentreSante]:
        return db.query(CentreSante).filter(CentreSante.district_id == district_id).all()


centre_sante = CRUDCentreSante(CentreSante)
