# app/crud/maladie.py
from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.maladie import Maladie
from app.schemas.maladie import MaladieCreate, MaladieUpdate


class CRUDMaladie(CRUDBase[Maladie, MaladieCreate, MaladieUpdate]):
    def get_active(self, db: Session) -> List[Maladie]:
        return db.query(Maladie).filter(Maladie.is_active == True).all()


maladie = CRUDMaladie(Maladie)