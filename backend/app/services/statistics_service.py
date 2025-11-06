# app/services/statistics_service.py
from typing import Dict, List, Optional
from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, case

from app.models.cas import Cas
from app.models.district import District
from app.models.maladie import Maladie
from app.utils.enums import CasStatut


class StatisticsService:
    """Service pour les calculs statistiques avancés"""
    
    @staticmethod
    def calculate_incidence_rate(
        db: Session,
        district_id: int,
        maladie_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None
    ) -> float:
        """
        Calcul du taux d'incidence pour 100,000 habitants
        Formule : (Nombre de cas / Population) * 100,000
        """
        district = db.query(District).filter(District.id == district_id).first()
        if not district or not district.population:
            return 0.0
        
        query = db.query(func.count(Cas.id)).filter(Cas.district_id == district_id)
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        if date_debut:
            query = query.filter(Cas.date_declaration >= date_debut)
        if date_fin:
            query = query.filter(Cas.date_declaration <= date_fin)
        
        nombre_cas = query.scalar() or 0
        
        taux_incidence = (nombre_cas / district.population) * 100000
        return round(taux_incidence, 2)
    
    @staticmethod
    def calculate_case_fatality_rate(
        db: Session,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None
    ) -> float:
        """
        Calcul du taux de létalité
        Formule : (Nombre de décès / Nombre de cas confirmés) * 100
        """
        query = db.query(Cas)
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        if date_debut:
            query = query.filter(Cas.date_declaration >= date_debut)
        if date_fin:
            query = query.filter(Cas.date_declaration <= date_fin)
        
        total_cas = query.filter(
            Cas.statut.in_([CasStatut.CONFIRME, CasStatut.GUERI, CasStatut.DECEDE])
        ).count()
        
        if total_cas == 0:
            return 0.0
        
        deces = query.filter(Cas.statut == CasStatut.DECEDE).count()
        
        taux_letalite = (deces / total_cas) * 100
        return round(taux_letalite, 2)
    
    @staticmethod
    def calculate_attack_rate(
        db: Session,
        district_id: int,
        maladie_id: int,
        date_debut: date,
        date_fin: date
    ) -> float:
        """
        Calcul du taux d'attaque lors d'une épidémie
        Formule : (Nombre de nouveaux cas / Population à risque) * 100
        """
        district = db.query(District).filter(District.id == district_id).first()
        if not district or not district.population:
            return 0.0
        
        nombre_cas = db.query(func.count(Cas.id)).filter(
            and_(
                Cas.district_id == district_id,
                Cas.maladie_id == maladie_id,
                Cas.date_declaration >= date_debut,
                Cas.date_declaration <= date_fin
            )
        ).scalar() or 0
        
        taux_attaque = (nombre_cas / district.population) * 100
        return round(taux_attaque, 2)
    
    @staticmethod
    def calculate_trend(
        db: Session,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        jours: int = 14
    ) -> Dict:
        """
        Calcul de la tendance d'évolution (croissance/décroissance)
        Compare les 2 périodes de même durée
        """
        date_fin = datetime.now().date()
        date_milieu = date_fin - timedelta(days=jours)
        date_debut = date_milieu - timedelta(days=jours)
        
        # Première période
        query1 = db.query(func.count(Cas.id)).filter(
            and_(
                Cas.date_declaration >= date_debut,
                Cas.date_declaration < date_milieu
            )
        )
        
        # Deuxième période
        query2 = db.query(func.count(Cas.id)).filter(
            and_(
                Cas.date_declaration >= date_milieu,
                Cas.date_declaration <= date_fin
            )
        )
        
        if maladie_id:
            query1 = query1.filter(Cas.maladie_id == maladie_id)
            query2 = query2.filter(Cas.maladie_id == maladie_id)
        
        if district_id:
            query1 = query1.filter(Cas.district_id == district_id)
            query2 = query2.filter(Cas.district_id == district_id)
        
        cas_periode1 = query1.scalar() or 0
        cas_periode2 = query2.scalar() or 0
        
        if cas_periode1 == 0:
            pourcentage_variation = 100.0 if cas_periode2 > 0 else 0.0
        else:
            pourcentage_variation = ((cas_periode2 - cas_periode1) / cas_periode1) * 100
        
        if pourcentage_variation > 10:
            tendance = "croissante"
        elif pourcentage_variation < -10:
            tendance = "decroissante"
        else:
            tendance = "stable"
        
        return {
            "periode1_cas": cas_periode1,
            "periode2_cas": cas_periode2,
            "variation_pourcent": round(pourcentage_variation, 2),
            "tendance": tendance,
            "date_debut": date_debut.isoformat(),
            "date_milieu": date_milieu.isoformat(),
            "date_fin": date_fin.isoformat()
        }
    
    @staticmethod
    def get_age_distribution(
        db: Session,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None
    ) -> List[Dict]:
        """Répartition des cas par tranche d'âge"""
        query = db.query(
            case(
                (Cas.age < 1, "0-1 an"),
                (and_(Cas.age >= 1, Cas.age < 5), "1-4 ans"),
                (and_(Cas.age >= 5, Cas.age < 15), "5-14 ans"),
                (and_(Cas.age >= 15, Cas.age < 25), "15-24 ans"),
                (and_(Cas.age >= 25, Cas.age < 45), "25-44 ans"),
                (and_(Cas.age >= 45, Cas.age < 65), "45-64 ans"),
                (Cas.age >= 65, "65+ ans"),
                else_="Non renseigné"
            ).label("tranche_age"),
            func.count(Cas.id).label("nombre_cas")
        )
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        if date_debut:
            query = query.filter(Cas.date_declaration >= date_debut)
        if date_fin:
            query = query.filter(Cas.date_declaration <= date_fin)
        
        results = query.group_by("tranche_age").all()
        
        return [
            {
                "tranche_age": r.tranche_age,
                "nombre_cas": r.nombre_cas
            }
            for r in results
        ]
    
    @staticmethod
    def get_weekly_summary(
        db: Session,
        maladie_id: Optional[int] = None,
        semaines: int = 12
    ) -> List[Dict]:
        """Résumé hebdomadaire des cas"""
        date_fin = datetime.now().date()
        date_debut = date_fin - timedelta(weeks=semaines)
        
        query = db.query(
            func.date_trunc('week', Cas.date_declaration).label('semaine'),
            func.count(Cas.id).label('nombre_cas')
        ).filter(
            Cas.date_declaration >= date_debut
        )
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        
        results = query.group_by('semaine').order_by('semaine').all()
        
        return [
            {
                "semaine": r.semaine.isoformat() if r.semaine else None,
                "nombre_cas": r.nombre_cas
            }
            for r in results
        ]


# Instance globale
stats_service = StatisticsService()