# app/services/cartographie_service.py
from typing import List, Dict, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.models.cas import Cas
from app.models.district import District
from app.models.centre_sante import CentreSante
from app.models.maladie import Maladie


class CartographieService:
    """Service pour la génération de données cartographiques"""
    
    @staticmethod
    def get_cas_markers(
        db: Session,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None,
        limit: int = 1000
    ) -> List[Dict]:
        """
        Récupère les cas avec coordonnées GPS pour affichage sur carte
        """
        query = db.query(
            Cas.id,
            Cas.numero_cas,
            Cas.latitude,
            Cas.longitude,
            Cas.statut,
            Cas.age,
            Cas.sexe,
            Cas.date_declaration,
            Maladie.nom.label('maladie_nom'),
            District.nom.label('district_nom'),
            CentreSante.nom.label('centre_nom')
        ).join(
            Maladie, Cas.maladie_id == Maladie.id
        ).join(
            District, Cas.district_id == District.id
        ).join(
            CentreSante, Cas.centre_sante_id == CentreSante.id
        ).filter(
            and_(
                Cas.latitude.isnot(None),
                Cas.longitude.isnot(None)
            )
        )
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        if date_debut:
            query = query.filter(Cas.date_declaration >= date_debut)
        if date_fin:
            query = query.filter(Cas.date_declaration <= date_fin)
        
        results = query.limit(limit).all()
        
        markers = []
        for r in results:
            markers.append({
                "id": r.id,
                "numero_cas": r.numero_cas,
                "latitude": float(r.latitude),
                "longitude": float(r.longitude),
                "statut": r.statut,
                "age": r.age,
                "sexe": r.sexe,
                "date_declaration": r.date_declaration.isoformat(),
                "maladie": r.maladie_nom,
                "district": r.district_nom,
                "centre_sante": r.centre_nom
            })
        
        return markers
    
    @staticmethod
    def get_districts_choropleth(
        db: Session,
        maladie_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None
    ) -> List[Dict]:
        """
        Données pour carte choroplèthe (districts colorés selon nombre de cas)
        """
        query = db.query(
            District.id,
            District.nom,
            District.latitude,
            District.longitude,
            District.population,
            func.count(Cas.id).label('nombre_cas')
        ).outerjoin(
            Cas, Cas.district_id == District.id
        )
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        if date_debut:
            query = query.filter(Cas.date_declaration >= date_debut)
        if date_fin:
            query = query.filter(Cas.date_declaration <= date_fin)
        
        results = query.group_by(
            District.id,
            District.nom,
            District.latitude,
            District.longitude,
            District.population
        ).all()
        
        districts = []
        for r in results:
            taux_incidence = 0.0
            if r.population and r.population > 0:
                taux_incidence = (r.nombre_cas / r.population) * 100000
            
            # Définir le niveau de risque
            if taux_incidence >= 100:
                niveau = "tres_eleve"
            elif taux_incidence >= 50:
                niveau = "eleve"
            elif taux_incidence >= 20:
                niveau = "modere"
            elif taux_incidence >= 5:
                niveau = "faible"
            else:
                niveau = "tres_faible"
            
            districts.append({
                "id": r.id,
                "nom": r.nom,
                "latitude": float(r.latitude) if r.latitude else None,
                "longitude": float(r.longitude) if r.longitude else None,
                "population": r.population,
                "nombre_cas": r.nombre_cas,
                "taux_incidence": round(taux_incidence, 2),
                "niveau_risque": niveau
            })
        
        return districts
    
    @staticmethod
    def get_centres_sante_markers(
        db: Session,
        district_id: Optional[int] = None,
        avec_laboratoire: Optional[bool] = None
    ) -> List[Dict]:
        """
        Récupère les centres de santé pour affichage sur carte
        """
        query = db.query(
            CentreSante.id,
            CentreSante.nom,
            CentreSante.type,
            CentreSante.latitude,
            CentreSante.longitude,
            CentreSante.capacite_accueil,
            CentreSante.a_laboratoire,
            CentreSante.telephone,
            District.nom.label('district_nom')
        ).join(
            District, CentreSante.district_id == District.id
        ).filter(
            and_(
                CentreSante.latitude.isnot(None),
                CentreSante.longitude.isnot(None)
            )
        )
        
        if district_id:
            query = query.filter(CentreSante.district_id == district_id)
        if avec_laboratoire is not None:
            query = query.filter(CentreSante.a_laboratoire == avec_laboratoire)
        
        results = query.all()
        
        centres = []
        for r in results:
            centres.append({
                "id": r.id,
                "nom": r.nom,
                "type": r.type,
                "latitude": float(r.latitude),
                "longitude": float(r.longitude),
                "capacite_accueil": r.capacite_accueil,
                "a_laboratoire": r.a_laboratoire,
                "telephone": r.telephone,
                "district": r.district_nom
            })
        
        return centres
    
    @staticmethod
    def get_heatmap_data(
        db: Session,
        maladie_id: Optional[int] = None,
        district_id: Optional[int] = None,
        date_debut: Optional[date] = None,
        date_fin: Optional[date] = None
    ) -> List[List[float]]:
        """
        Données pour heatmap (carte de chaleur)
        Format: [[lat, lng, intensité], ...]
        """
        query = db.query(
            Cas.latitude,
            Cas.longitude
        ).filter(
            and_(
                Cas.latitude.isnot(None),
                Cas.longitude.isnot(None)
            )
        )
        
        if maladie_id:
            query = query.filter(Cas.maladie_id == maladie_id)
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        if date_debut:
            query = query.filter(Cas.date_declaration >= date_debut)
        if date_fin:
            query = query.filter(Cas.date_declaration <= date_fin)
        
        results = query.all()
        
        # Convertir en format heatmap [lat, lng, intensity]
        heatmap_data = []
        for r in results:
            heatmap_data.append([
                float(r.latitude),
                float(r.longitude),
                1.0  # Intensité de base
            ])
        
        return heatmap_data
    
    @staticmethod
    def detect_clusters(
        db: Session,
        maladie_id: int,
        district_id: Optional[int] = None,
        jours: int = 14,
        rayon_km: float = 5.0,
        min_cas: int = 5
    ) -> List[Dict]:
        """
        Détection simple de clusters géographiques
        (Version simplifiée sans DBSCAN, pour implémentation basique)
        """
        from datetime import datetime, timedelta
        
        date_debut = datetime.now().date() - timedelta(days=jours)
        
        query = db.query(
            Cas.latitude,
            Cas.longitude,
            Cas.district_id,
            District.nom.label('district_nom')
        ).join(
            District, Cas.district_id == District.id
        ).filter(
            and_(
                Cas.maladie_id == maladie_id,
                Cas.latitude.isnot(None),
                Cas.longitude.isnot(None),
                Cas.date_declaration >= date_debut
            )
        )
        
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        
        results = query.all()
        
        # Regroupement simple par district
        clusters_by_district = {}
        for r in results:
            dist_id = r.district_id
            if dist_id not in clusters_by_district:
                clusters_by_district[dist_id] = {
                    "district_nom": r.district_nom,
                    "cas": [],
                    "centre_lat": 0,
                    "centre_lng": 0
                }
            clusters_by_district[dist_id]["cas"].append({
                "lat": float(r.latitude),
                "lng": float(r.longitude)
            })
        
        # Calculer les centres et filtrer
        clusters = []
        for dist_id, data in clusters_by_district.items():
            if len(data["cas"]) >= min_cas:
                avg_lat = sum(c["lat"] for c in data["cas"]) / len(data["cas"])
                avg_lng = sum(c["lng"] for c in data["cas"]) / len(data["cas"])
                
                clusters.append({
                    "district_id": dist_id,
                    "district_nom": data["district_nom"],
                    "nombre_cas": len(data["cas"]),
                    "centre_latitude": round(avg_lat, 6),
                    "centre_longitude": round(avg_lng, 6),
                    "rayon_km": rayon_km
                })
        
        return clusters


# Instance globale
carto_service = CartographieService()