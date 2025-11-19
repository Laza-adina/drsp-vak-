# app/services/rapport_ia_service.py
"""
📄 Fichier: app/services/rapport_ia_service.py
📝 Description: Service IA pour générer des analyses de rapports
"""

from typing import Dict, List
from datetime import date, datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
import numpy as np

from app.models.cas import Cas
from app.models.alerte import Alerte
from app.models.intervention import Intervention
from app.utils.enums import CasStatut, AlerteNiveau


class RapportIAService:
    """Service IA pour analyser et générer du contenu de rapport"""
    
    @staticmethod
    def generer_resume_executif(stats: Dict) -> str:
        """Génère un résumé exécutif intelligent"""
        
        total_cas = stats.get('total_cas', 0)
        nouveaux_cas = stats.get('nouveaux_cas', 0)
        evolution = stats.get('evolution_pourcent', 0)
        deces = stats.get('deces', 0)
        taux_letalite = stats.get('taux_letalite', 0)
        
        # Analyse de la situation
        if evolution > 50:
            tendance = "une augmentation alarmante"
            urgence = "CRITIQUE"
        elif evolution > 20:
            tendance = "une hausse significative"
            urgence = "ÉLEVÉE"
        elif evolution > 0:
            tendance = "une légère augmentation"
            urgence = "MODÉRÉE"
        elif evolution < -20:
            tendance = "une diminution encourageante"
            urgence = "FAIBLE"
        else:
            tendance = "une stabilité"
            urgence = "STABLE"
        
        resume = f"""
La région de Vakinankaratra enregistre {total_cas} cas au total durant cette période, 
dont {nouveaux_cas} nouveaux cas, représentant {tendance} de {abs(evolution):.1f}% 
par rapport à la période précédente.

Le niveau d'urgence épidémiologique est qualifié de **{urgence}**.

Avec {deces} décès enregistrés, le taux de létalité s'établit à {taux_letalite:.2f}%, 
{'ce qui nécessite une attention immédiate' if taux_letalite > 5 else 'demeurant dans les normes acceptables'}.
"""
        return resume.strip()
    
    @staticmethod
    def generer_analyse_tendance(
        db: Session,
        date_debut: date,
        date_fin: date,
        district_id: int = None
    ) -> Dict:
        """Analyse les tendances épidémiologiques"""
        
        # Calcule sur 2 périodes pour comparaison
        from datetime import timedelta
        duree = (date_fin - date_debut).days
        periode_precedente_debut = date_debut - timedelta(days=duree)
        
        # Période actuelle
        query_actuel = db.query(func.count(Cas.id)).filter(
            Cas.date_declaration >= date_debut,
            Cas.date_declaration <= date_fin
        )
        
        # Période précédente
        query_precedent = db.query(func.count(Cas.id)).filter(
            Cas.date_declaration >= periode_precedente_debut,
            Cas.date_declaration < date_debut
        )
        
        if district_id:
            query_actuel = query_actuel.filter(Cas.district_id == district_id)
            query_precedent = query_precedent.filter(Cas.district_id == district_id)
        
        cas_actuel = query_actuel.scalar() or 0
        cas_precedent = query_precedent.scalar() or 0
        
        evolution = ((cas_actuel - cas_precedent) / cas_precedent * 100) if cas_precedent > 0 else 0
        
        # Détermination de la tendance
        if evolution > 20:
            tendance = "forte_hausse"
            emoji = "📈"
            message = f"Augmentation préoccupante de {evolution:.1f}% des cas"
        elif evolution > 5:
            tendance = "hausse"
            emoji = "↗️"
            message = f"Hausse modérée de {evolution:.1f}% des cas"
        elif evolution > -5:
            tendance = "stable"
            emoji = "➡️"
            message = "Situation épidémiologique stable"
        elif evolution > -20:
            tendance = "baisse"
            emoji = "↘️"
            message = f"Baisse encourageante de {abs(evolution):.1f}% des cas"
        else:
            tendance = "forte_baisse"
            emoji = "📉"
            message = f"Diminution significative de {abs(evolution):.1f}% des cas"
        
        return {
            "tendance": tendance,
            "emoji": emoji,
            "evolution_pourcent": evolution,
            "cas_actuel": cas_actuel,
            "cas_precedent": cas_precedent,
            "message": message
        }
    
    @staticmethod
    def generer_recommandations(
        stats: Dict,
        alertes_actives: List,
        tendance: Dict
    ) -> List[str]:
        """Génère des recommandations IA contextuelles"""
        
        recommandations = []
        
        # Basé sur la tendance
        if tendance['tendance'] in ['forte_hausse', 'hausse']:
            recommandations.extend([
                "🚨 Renforcer immédiatement la surveillance épidémiologique dans les districts à forte incidence",
                "💉 Intensifier les campagnes de vaccination et de sensibilisation communautaire",
                "🏥 Vérifier la disponibilité des stocks de médicaments et intrants médicaux",
                "👥 Mobiliser les équipes d'intervention rapide dans les zones à risque"
            ])
        elif tendance['tendance'] == 'stable':
            recommandations.extend([
                "✅ Maintenir le niveau actuel de surveillance épidémiologique",
                "📋 Continuer les activités de prévention et de sensibilisation",
                "🔄 Renforcer la formation du personnel de santé sur la détection précoce"
            ])
        else:
            recommandations.extend([
                "✅ Maintenir la vigilance malgré la baisse observée",
                "📊 Documenter les facteurs ayant contribué à cette amélioration",
                "🔄 Adapter les stratégies d'intervention en fonction des résultats"
            ])
        
        # Basé sur les alertes
        if len(alertes_actives) > 3:
            recommandations.append(
                f"⚠️ URGENT: {len(alertes_actives)} alertes actives nécessitent une réponse coordonnée immédiate"
            )
        elif len(alertes_actives) > 0:
            recommandations.append(
                f" Assurer le suivi des {len(alertes_actives)} alertes en cours"
            )
        
        # Basé sur le taux de létalité
        if stats.get('taux_letalite', 0) > 5:
            recommandations.extend([
                " Améliorer la prise en charge clinique et l'accès aux soins",
                " Renforcer la formation du personnel sur les protocoles de traitement"
            ])
        
        return recommandations
    
    @staticmethod
    def generer_analyse_districts(
        db: Session,
        date_debut: date,
        date_fin: date
    ) -> Dict:
        """Analyse comparative des districts"""
        
        from app.models.district import District
        
        districts_data = db.query(
            District.nom,
            District.population,
            func.count(Cas.id).label('cas')
        ).outerjoin(
            Cas,
            (Cas.district_id == District.id) &
            (Cas.date_declaration >= date_debut) &
            (Cas.date_declaration <= date_fin)
        ).group_by(District.id, District.nom, District.population).all()
        
        analyse = []
        for district in districts_data:
            taux_incidence = (district.cas / district.population * 100000) if district.population > 0 else 0
            
            # Classification du risque
            if taux_incidence > 100:
                niveau_risque = "TRÈS ÉLEVÉ"
                couleur = "rouge"
            elif taux_incidence > 50:
                niveau_risque = "ÉLEVÉ"
                couleur = "orange"
            elif taux_incidence > 20:
                niveau_risque = "MODÉRÉ"
                couleur = "jaune"
            else:
                niveau_risque = "FAIBLE"
                couleur = "vert"
            
            analyse.append({
                "district": district.nom,
                "cas": district.cas,
                "population": district.population,
                "taux_incidence": taux_incidence,
                "niveau_risque": niveau_risque,
                "couleur": couleur
            })
        
        # Tri par taux d'incidence
        analyse.sort(key=lambda x: x['taux_incidence'], reverse=True)
        
        # Message d'analyse
        if analyse:
            district_max = analyse[0]
            message = f"Le district de {district_max['district']} présente le taux d'incidence le plus élevé ({district_max['taux_incidence']:.1f}/100 000 hab.) avec un niveau de risque {district_max['niveau_risque']}."
        else:
            message = "Aucune donnée disponible pour l'analyse des districts."
        
        return {
            "districts": analyse,
            "message": message
        }
    
    @staticmethod
    def generer_analyse_interventions(
        db: Session,
        date_debut: date,
        date_fin: date
    ) -> Dict:
        """Analyse l'efficacité des interventions"""
        
        interventions = db.query(Intervention).filter(
            Intervention.date_debut >= date_debut,
            Intervention.date_debut <= date_fin
        ).all()
        
        total = len(interventions)
        completees = len([i for i in interventions if i.statut == 'complete'])
        en_cours = len([i for i in interventions if i.statut == 'en_cours'])
        
        taux_completion = (completees / total * 100) if total > 0 else 0
        
        if taux_completion > 80:
            evaluation = "excellente"
            message = f"Le taux de réalisation des interventions est excellent ({taux_completion:.1f}%)"
        elif taux_completion > 60:
            evaluation = "satisfaisante"
            message = f"Le taux de réalisation des interventions est satisfaisant ({taux_completion:.1f}%)"
        else:
            evaluation = "insuffisante"
            message = f"Le taux de réalisation des interventions nécessite une amélioration ({taux_completion:.1f}%)"
        
        return {
            "total": total,
            "completees": completees,
            "en_cours": en_cours,
            "taux_completion": taux_completion,
            "evaluation": evaluation,
            "message": message
        }


# Instance globale
rapport_ia_service = RapportIAService()
