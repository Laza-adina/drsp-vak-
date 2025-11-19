# app/services/prediction_service.py
"""
📄 Fichier: app/services/prediction_service.py
📝 Description: Service de prédiction épidémiologique avec Prophet et analyse IA
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
from prophet import Prophet
import numpy as np

from app.models.cas import Cas
from app.models.prediction import Prediction


class PredictionService:
    """Service de prédiction avec Prophet et analyse IA"""
    
    @staticmethod
    def preparer_donnees_prophet(
        db: Session,
        maladie_id: int,
        district_id: Optional[int] = None,
        jours_historique: int = 90
    ) -> pd.DataFrame:
        """
        Prépare les données au format Prophet (ds, y)
        ds = date, y = nombre de cas
        """
        date_debut = datetime.now().date() - timedelta(days=jours_historique)
        
        query = db.query(
            func.date(Cas.date_symptomes).label('date'),
            func.count(Cas.id).label('cas')
        ).filter(
            Cas.maladie_id == maladie_id,
            Cas.date_symptomes >= date_debut
        )
        
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        
        resultats = query.group_by(func.date(Cas.date_symptomes)).order_by('date').all()
        
        # Conversion en DataFrame Prophet
        df = pd.DataFrame([
            {'ds': r.date, 'y': r.cas}
            for r in resultats
        ])
        
        if df.empty:
            return pd.DataFrame(columns=['ds', 'y'])
        
        # Remplir les jours manquants avec 0
        df['ds'] = pd.to_datetime(df['ds'])
        df = df.set_index('ds').asfreq('D', fill_value=0).reset_index()
        
        return df
    
    @staticmethod
    def predire_cas_futurs(
        db: Session,
        maladie_id: int,
        district_id: Optional[int] = None,
        horizon_jours: int = 14,
        jours_historique: int = 90
    ) -> Dict:
        """
        Génère des prédictions avec Prophet
        """
        
        # 1. Préparer les données
        df = PredictionService.preparer_donnees_prophet(
            db, maladie_id, district_id, jours_historique
        )
        
        if df.empty or len(df) < 7:
            return {
                "success": False,
                "error": "Données insuffisantes pour la prédiction (minimum 7 jours)",
                "historique": [],
                "predictions": []
            }
        
        try:
            # 2. Créer et entraîner le modèle Prophet
            model = Prophet(
                daily_seasonality=True,
                weekly_seasonality=True,
                yearly_seasonality=False,
                changepoint_prior_scale=0.05,
                interval_width=0.95
            )
            
            model.fit(df)
            
            # 3. Créer le DataFrame de prédiction
            future = model.make_future_dataframe(periods=horizon_jours)
            forecast = model.predict(future)
            
            # 4. Extraire historique et prédictions
            n_historique = len(df)
            
            historique = []
            for i in range(n_historique):
                historique.append({
                    "date": df.iloc[i]['ds'].strftime('%Y-%m-%d'),
                    "cas_reels": int(df.iloc[i]['y']),
                    "cas_predits": max(0, int(forecast.iloc[i]['yhat'])),
                    "intervalle_min": max(0, int(forecast.iloc[i]['yhat_lower'])),
                    "intervalle_max": max(0, int(forecast.iloc[i]['yhat_upper']))
                })
            
            predictions = []
            for i in range(n_historique, len(forecast)):
                predictions.append({
                    "date": forecast.iloc[i]['ds'].strftime('%Y-%m-%d'),
                    "cas_predits": max(0, int(forecast.iloc[i]['yhat'])),
                    "intervalle_min": max(0, int(forecast.iloc[i]['yhat_lower'])),
                    "intervalle_max": max(0, int(forecast.iloc[i]['yhat_upper'])),
                    "confiance": 0.95
                })
            
            # 5. Calculer métriques de qualité
            y_true = df['y'].values
            y_pred = forecast.iloc[:n_historique]['yhat'].values
            
            mae = np.mean(np.abs(y_true - y_pred))
            rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))
            mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1))) * 100
            
            # 6. Analyser la tendance
            tendance = "stable"
            derniers_jours = predictions[:7] if len(predictions) >= 7 else predictions
            if len(derniers_jours) > 0:
                moyenne_predite = np.mean([p['cas_predits'] for p in derniers_jours])
                moyenne_historique = np.mean(df['y'].tail(7).values)
                
                if moyenne_predite > moyenne_historique * 1.2:
                    tendance = "hausse"
                elif moyenne_predite < moyenne_historique * 0.8:
                    tendance = "baisse"
            
            return {
                "success": True,
                "historique": historique,
                "predictions": predictions,
                "metriques": {
                    "mae": round(mae, 2),
                    "rmse": round(rmse, 2),
                    "mape": round(mape, 2),
                    "tendance": tendance,
                    "confiance_score": round(1 - (mape / 100), 2),
                    "jours_historique": len(df),
                    "horizon_jours": horizon_jours
                },
                "modele": "Prophet (Meta)"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Erreur Prophet: {str(e)}",
                "historique": [],
                "predictions": []
            }
    
    @staticmethod
    def analyser_predictions_avec_ia(
        predictions: List[Dict],
        metriques: Dict,
        maladie_nom: str,
        district_nom: str
    ) -> Dict:
        """
        🤖 Génère une analyse IA des prédictions avec recommandations
        """
        
        # Calcule des statistiques sur les prédictions
        cas_predits = [p['cas_predits'] for p in predictions]
        moyenne_predite = np.mean(cas_predits)
        max_predit = max(cas_predits)
        min_predit = min(cas_predits)
        
        # Tendance sur la période prédite
        tendance_prediction = "hausse" if cas_predits[-1] > cas_predits[0] * 1.2 else \
                             "baisse" if cas_predits[-1] < cas_predits[0] * 0.8 else "stable"
        
        # Détermine le niveau d'alerte
        if max_predit > 50 or (tendance_prediction == "hausse" and moyenne_predite > 30):
            niveau_alerte = "danger"
            couleur = "red"
        elif max_predit > 20 or tendance_prediction == "hausse":
            niveau_alerte = "attention"
            couleur = "orange"
        else:
            niveau_alerte = "normal"
            couleur = "green"
        
        # Génère le message selon le contexte
        if niveau_alerte == "danger":
            message = f"⚠️ ALERTE IMPORTANTE : Le modèle prévoit jusqu'à {int(max_predit)} cas de {maladie_nom} dans {district_nom}. Une augmentation significative est attendue dans les prochains jours."
            recommandations = [
                "🚨 Renforcer immédiatement la surveillance épidémiologique",
                "💉 Préparer des campagnes de vaccination ou de sensibilisation d'urgence",
                "🏥 Assurer la disponibilité des ressources médicales et des lits",
                "📢 Informer les autorités sanitaires régionales et nationales",
                "👥 Mobiliser les équipes d'intervention rapide"
            ]
        elif niveau_alerte == "attention":
            message = f"⚡ VIGILANCE REQUISE : Le modèle prévoit une moyenne de {int(moyenne_predite)} cas de {maladie_nom} dans {district_nom}. Tendance observée : {tendance_prediction}."
            recommandations = [
                "👀 Maintenir une surveillance active et quotidienne",
                "📋 Prévoir des interventions préventives si la hausse se confirme",
                "🏥 Sensibiliser les centres de santé locaux à la situation",
                "📊 Suivre l'évolution quotidienne des cas réels vs prédits",
                "🎯 Préparer un plan d'intervention en cas d'escalade"
            ]
        else:
            message = f"✅ SITUATION STABLE : Le modèle prévoit une situation maîtrisée pour {maladie_nom} dans {district_nom} avec environ {int(moyenne_predite)} cas. Aucune hausse significative n'est anticipée."
            recommandations = [
                "✅ Continuer la surveillance de routine",
                "🔄 Maintenir les mesures préventives actuelles",
                "😌 Pas d'action urgente nécessaire",
                "📅 Réévaluer la situation dans 7 jours",
                "📖 Documenter les bonnes pratiques actuelles"
            ]
        
        # Évalue la fiabilité du modèle
        confiance = metriques['confiance_score']
        if confiance > 0.8:
            fiabilite = "Fiabilité ÉLEVÉE - Prédictions très probables"
            fiabilite_couleur = "green"
            fiabilite_detail = "Le modèle dispose de données historiques suffisantes et montre une excellente précision."
        elif confiance > 0.6:
            fiabilite = "Fiabilité MOYENNE - Surveiller l'évolution réelle"
            fiabilite_couleur = "orange"
            fiabilite_detail = "Les prédictions sont indicatives. Comparer avec les cas réels pour ajuster."
        else:
            fiabilite = "Fiabilité FAIBLE - Données insuffisantes"
            fiabilite_couleur = "red"
            fiabilite_detail = "Manque de données historiques. Utiliser ces prédictions avec précaution."
        
        # Analyse comparative
        variation = ((max_predit - min_predit) / (min_predit + 1)) * 100
        volatilite = "élevée" if variation > 50 else "modérée" if variation > 20 else "faible"
        
        return {
            "niveau_alerte": niveau_alerte,
            "couleur": couleur,
            "message": message,
            "recommandations": recommandations,
            "statistiques": {
                "moyenne_predite": round(moyenne_predite, 1),
                "max_predit": int(max_predit),
                "min_predit": int(min_predit),
                "tendance": tendance_prediction,
                "volatilite": volatilite,
                "variation_pourcent": round(variation, 1)
            },
            "fiabilite": {
                "texte": fiabilite,
                "couleur": fiabilite_couleur,
                "score": confiance,
                "detail": fiabilite_detail
            },
            "contexte": {
                "maladie": maladie_nom,
                "zone": district_nom,
                "periode_analyse": f"{metriques['jours_historique']} jours",
                "horizon_prediction": f"{metriques['horizon_jours']} jours"
            }
        }
    


@staticmethod
def sauvegarder_prediction(
    db: Session,
    maladie_id: int,
    district_id: int,
    predictions: List[Dict],
    metriques: Dict,
    created_by: int
):
    """Sauvegarde les prédictions dans la BD avec logs détaillés"""
    
    print("="*80)
    print(f"🔵 DÉBUT SAUVEGARDE PRÉDICTIONS")
    print(f"   📊 Nombre de prédictions: {len(predictions)}")
    print(f"   🦠 Maladie ID: {maladie_id}")
    print(f"   📍 District ID: {district_id}")
    print(f"   👤 Créé par: {created_by}")
    print("="*80)
    
    if not predictions:
        print("❌ ERREUR: Aucune prédiction à sauvegarder")
        return
    
    saved_count = 0
    for i, pred in enumerate(predictions, 1):
        try:
            print(f"\n📝 Prédiction {i}/{len(predictions)}")
            print(f"   Date: {pred['date']}")
            print(f"   Cas prédits: {pred['cas_predits']}")
            
            prediction_db = Prediction(
                maladie_id=maladie_id,
                district_id=district_id,
                date_prediction=datetime.strptime(pred['date'], '%Y-%m-%d').date(),
                horizon_jours=metriques['horizon_jours'],
                cas_predits=pred['cas_predits'],
                intervalle_min=pred['intervalle_min'],
                intervalle_max=pred['intervalle_max'],
                confiance_score=metriques['confiance_score'],
                modele_utilise="Prophet",
                parametres=str(metriques),
                created_by=created_by
            )
            
            db.add(prediction_db)
            saved_count += 1
            print(f"   ✅ Ajouté à la session")
            
        except Exception as e:
            print(f"   ❌ ERREUR sur prédiction {i}: {e}")
            import traceback
            traceback.print_exc()
    
    print(f"\n💾 Tentative de COMMIT de {saved_count} prédictions...")
    
    try:
        db.commit()
        print(f"✅ ✅ ✅ COMMIT RÉUSSI - {saved_count} prédictions sauvegardées")
        
        # Vérifie dans la BD
        count = db.query(Prediction).filter(Prediction.maladie_id == maladie_id).count()
        print(f"🔍 Vérification: {count} prédictions totales pour maladie {maladie_id}")
        
    except Exception as e:
        print(f"❌ ❌ ❌ ERREUR COMMIT: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    
    print("="*80)
    print(f"🔵 FIN SAUVEGARDE PRÉDICTIONS")
    print("="*80)
