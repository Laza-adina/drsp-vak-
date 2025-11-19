from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.crud.base import CRUDBase
from app.models.alerte import Alerte
from app.schemas.alerte import AlerteCreate, AlerteUpdate

class CRUDAlertes(CRUDBase[Alerte, AlerteCreate, AlerteUpdate]):
    
    def get_by_filters(
        self,
        db: Session,
        *,
        statut: Optional[str] = None,
        niveau_gravite: Optional[str] = None,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Alerte]:
        """Récupérer les alertes avec filtres"""
        query = db.query(self.model)
        
        if statut:
            query = query.filter(self.model.statut == statut)
        if niveau_gravite:
            query = query.filter(self.model.niveau_gravite == niveau_gravite)
        if maladie_id:
            query = query.filter(self.model.maladie_id == maladie_id)
        if district_id:
            query = query.filter(self.model.district_id == district_id)
        if date_debut:
            query = query.filter(self.model.date_detection >= date_debut)
        if date_fin:
            query = query.filter(self.model.date_detection <= date_fin)
        
        return query.order_by(self.model.date_detection.desc()).offset(skip).limit(limit).all()
    
    def count_active(self, db: Session) -> int:
        """Compter les alertes actives"""
        return db.query(self.model).filter(self.model.statut == 'active').count()
    
    def resolve(self, db: Session, *, alerte_id: int, actions: str, resolved_date: date) -> Alerte:
        """Marquer une alerte comme résolue"""
        alerte = db.query(self.model).filter(self.model.id == alerte_id).first()
        if alerte:
            alerte.statut = 'resolue'
            alerte.date_resolution = resolved_date
            alerte.actions_recommandees = actions
            db.commit()
            db.refresh(alerte)
        return alerte

alerte = CRUDAlertes(Alerte)
