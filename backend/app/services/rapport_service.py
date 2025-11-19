# app/services/rapport_service.py (VERSION COMPLÈTE AVEC IA)
"""
📄 Fichier: app/services/rapport_service.py
📝 Description: Service de génération de rapports PDF avec analyse IA
"""

from datetime import datetime, date, timedelta
from typing import Optional, List, Dict
from io import BytesIO
from sqlalchemy.orm import Session
from sqlalchemy import func
from calendar import monthrange

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, 
    Spacer, PageBreak, Image, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

from app.models.cas import Cas
from app.models.district import District
from app.models.maladie import Maladie
from app.models.alerte import Alerte
from app.models.intervention import Intervention
from app.models.prediction import Prediction
from app.utils.enums import CasStatut
from app.services.rapport_ia_service import rapport_ia_service


class RapportService:
    """Service pour la génération de rapports PDF intelligents"""
    
    @staticmethod
    def _get_styles():
        """Styles personnalisés pour les rapports"""
        styles = getSampleStyleSheet()
        
        # Titre principal
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#1F4E78'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Sous-titre
        styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1F4E78'),
            spaceAfter=15,
            spaceBefore=15,
            fontName='Helvetica-Bold'
        ))
        
        # Paragraphe justifié
        styles.add(ParagraphStyle(
            name='Justified',
            parent=styles['Normal'],
            alignment=TA_JUSTIFY,
            fontSize=10,
            leading=14
        ))
        
        # Alerte
        styles.add(ParagraphStyle(
            name='Alert',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#D32F2F'),
            fontName='Helvetica-Bold'
        ))
        
        return styles
    
    @staticmethod
    def _add_header(elements: List, titre: str, periode: str, district_nom: str = None):
        """Ajoute l'en-tête du rapport"""
        styles = RapportService._get_styles()
        
        # Logo et titre (si tu as un logo)
        elements.append(Paragraph(
            "RÉPUBLIQUE DE MADAGASCAR",
            styles['CustomTitle']
        ))
        elements.append(Paragraph(
            "Ministère de la Santé Publique",
            styles['Normal']
        ))
        elements.append(Paragraph(
            "Direction Régionale de la Santé Publique - Vakinankaratra",
            styles['Heading2']
        ))
        elements.append(Spacer(1, 0.5*cm))
        
        # Ligne de séparation
        elements.append(Paragraph(
            "─" * 80,
            styles['Normal']
        ))
        elements.append(Spacer(1, 0.5*cm))
        
        # Titre du rapport
        elements.append(Paragraph(titre, styles['CustomTitle']))
        elements.append(Spacer(1, 0.3*cm))
        
        # Informations
        info_style = styles['Normal']
        elements.append(Paragraph(
            f"<b>📅 Période:</b> {periode}",
            info_style
        ))
        elements.append(Paragraph(
            f"<b>📄 Généré le:</b> {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
            info_style
        ))
        if district_nom:
            elements.append(Paragraph(
                f"<b>📍 District:</b> {district_nom}",
                info_style
            ))
        else:
            elements.append(Paragraph(
                f"<b>📍 Couverture:</b> Tous les districts de Vakinankaratra",
                info_style
            ))
        
        elements.append(Spacer(1, 1*cm))
    
    @staticmethod
    def generate_rapport_hebdomadaire(
        db: Session,
        date_debut: date,
        date_fin: date,
        district_id: Optional[int] = None
    ) -> BytesIO:
        """📊 Génère un rapport hebdomadaire avec analyse IA"""
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
        elements = []
        styles = RapportService._get_styles()
        
        # District
        district = None
        if district_id:
            district = db.query(District).filter(District.id == district_id).first()
        
        # EN-TÊTE
        RapportService._add_header(
            elements,
            "RAPPORT HEBDOMADAIRE DE SURVEILLANCE ÉPIDÉMIOLOGIQUE",
            f"{date_debut.strftime('%d/%m/%Y')} - {date_fin.strftime('%d/%m/%Y')}",
            district.nom if district else None
        )
        
        # COLLECTE DES DONNÉES
        query_base = db.query(Cas).filter(
            Cas.date_declaration >= date_debut,
            Cas.date_declaration <= date_fin
        )
        if district_id:
            query_base = query_base.filter(Cas.district_id == district_id)
        
        total_cas = query_base.count()
        cas_confirmes = query_base.filter(Cas.statut == CasStatut.CONFIRME).count()
        cas_suspects = query_base.filter(Cas.statut == CasStatut.SUSPECT).count()
        cas_deces = query_base.filter(Cas.statut == CasStatut.DECEDE).count()
        cas_gueris = query_base.filter(Cas.statut == CasStatut.GUERI).count()
        
        taux_letalite = (cas_deces / total_cas * 100) if total_cas > 0 else 0
        
        # Analyse de tendance IA
        tendance = rapport_ia_service.generer_analyse_tendance(
            db, date_debut, date_fin, district_id
        )
        
        # 1. RÉSUMÉ EXÉCUTIF (IA)
        elements.append(Paragraph("📋 RÉSUMÉ EXÉCUTIF", styles['CustomSubtitle']))
        
        stats_pour_ia = {
            'total_cas': total_cas,
            'nouveaux_cas': total_cas,
            'evolution_pourcent': tendance['evolution_pourcent'],
            'deces': cas_deces,
            'taux_letalite': taux_letalite
        }
        
        resume = rapport_ia_service.generer_resume_executif(stats_pour_ia)
        elements.append(Paragraph(resume, styles['Justified']))
        elements.append(Spacer(1, 0.5*cm))
        
        # Encadré de tendance
        elements.append(Paragraph(
            f"<b>{tendance['emoji']} {tendance['message']}</b>",
            styles['Alert'] if 'hausse' in tendance['tendance'] else styles['Normal']
        ))
        elements.append(Spacer(1, 0.7*cm))
        
        # 2. STATISTIQUES GLOBALES
        elements.append(Paragraph("📊 STATISTIQUES GLOBALES", styles['CustomSubtitle']))
        
        data_stats = [
            ['Indicateur', 'Nombre', 'Pourcentage'],
            ['Total de cas déclarés', str(total_cas), '100%'],
            ['Cas suspects', str(cas_suspects), f'{cas_suspects/total_cas*100:.1f}%' if total_cas > 0 else '0%'],
            ['Cas confirmés', str(cas_confirmes), f'{cas_confirmes/total_cas*100:.1f}%' if total_cas > 0 else '0%'],
            ['Cas guéris', str(cas_gueris), f'{cas_gueris/total_cas*100:.1f}%' if total_cas > 0 else '0%'],
            ['Décès', str(cas_deces), f'{taux_letalite:.2f}%']
        ]
        
        table_stats = Table(data_stats, colWidths=[9*cm, 3*cm, 3*cm])
        table_stats.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E78')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table_stats)
        elements.append(Spacer(1, 0.7*cm))
        
        # 3. RÉPARTITION PAR MALADIE
        elements.append(Paragraph("🦠 RÉPARTITION PAR MALADIE", styles['CustomSubtitle']))
        
        maladies_data = db.query(
            Maladie.nom,
            func.count(Cas.id).label('nombre')
        ).join(Cas).filter(
            Cas.date_declaration >= date_debut,
            Cas.date_declaration <= date_fin
        )
        if district_id:
            maladies_data = maladies_data.filter(Cas.district_id == district_id)
        
        maladies_data = maladies_data.group_by(Maladie.nom).order_by(
            func.count(Cas.id).desc()
        ).all()
        
        if maladies_data:
            data_maladies = [['Maladie', 'Nombre de cas', 'Pourcentage', 'Évolution']]
            for maladie in maladies_data:
                pourcent = (maladie.nombre / total_cas * 100) if total_cas > 0 else 0
                data_maladies.append([
                    maladie.nom,
                    str(maladie.nombre),
                    f"{pourcent:.1f}%",
                    "📈" if pourcent > 30 else "➡️" if pourcent > 10 else "📉"
                ])
            
            table_maladies = Table(data_maladies, colWidths=[7*cm, 3*cm, 3*cm, 2*cm])
            table_maladies.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E78')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
            ]))
            
            elements.append(table_maladies)
        
        elements.append(Spacer(1, 0.7*cm))
        
        # 4. ANALYSE PAR DISTRICT (si tous les districts)
        if not district_id:
            elements.append(Paragraph("📍 ANALYSE PAR DISTRICT", styles['CustomSubtitle']))
            
            analyse_districts = rapport_ia_service.generer_analyse_districts(
                db, date_debut, date_fin
            )
            
            elements.append(Paragraph(analyse_districts['message'], styles['Justified']))
            elements.append(Spacer(1, 0.3*cm))
            
            data_districts = [['District', 'Cas', 'Taux/100k hab.', 'Niveau de risque']]
            for dist in analyse_districts['districts'][:7]:  # Top 7 districts
                data_districts.append([
                    dist['district'],
                    str(dist['cas']),
                    f"{dist['taux_incidence']:.1f}",
                    dist['niveau_risque']
                ])
            
            table_districts = Table(data_districts, colWidths=[5*cm, 3*cm, 3.5*cm, 3.5*cm])
            table_districts.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E78')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
            ]))
            
            elements.append(table_districts)
            elements.append(Spacer(1, 0.7*cm))
        
        # 5. ALERTES ACTIVES
        elements.append(Paragraph("🚨 ALERTES ÉPIDÉMIOLOGIQUES", styles['CustomSubtitle']))
        
        alertes = db.query(Alerte).filter(
            Alerte.date_detection >= date_debut,
            Alerte.date_detection <= date_fin,
            Alerte.statut == 'active'
        )
        if district_id:
            alertes = alertes.filter(Alerte.district_id == district_id)
        
        alertes = alertes.all()
        
        if alertes:
            for alerte in alertes[:5]:  # Max 5 alertes
                district_alerte = db.query(District).filter(District.id == alerte.district_id).first()
                maladie_alerte = db.query(Maladie).filter(Maladie.id == alerte.maladie_id).first()
                
                alerte_text = f"""
<b>⚠️ {alerte.niveau_gravite.upper()}</b> - {maladie_alerte.nom if maladie_alerte else 'N/A'}<br/>
<i>District: {district_alerte.nom if district_alerte else 'N/A'}</i><br/>
{alerte.description}
"""
                elements.append(Paragraph(alerte_text, styles['Normal']))
                elements.append(Spacer(1, 0.3*cm))
        else:
            elements.append(Paragraph(
                "✅ Aucune alerte active durant cette période",
                styles['Normal']
            ))
        
        elements.append(Spacer(1, 0.7*cm))
        
        # 6. RECOMMANDATIONS IA
        elements.append(Paragraph("💡 RECOMMANDATIONS STRATÉGIQUES", styles['CustomSubtitle']))
        
        recommandations = rapport_ia_service.generer_recommandations(
            stats_pour_ia,
            alertes,
            tendance
        )
        
        for i, rec in enumerate(recommandations, 1):
            elements.append(Paragraph(f"{i}. {rec}", styles['Normal']))
            elements.append(Spacer(1, 0.2*cm))
        
        elements.append(Spacer(1, 1*cm))
        
        # PIED DE PAGE
        elements.append(Paragraph("─" * 80, styles['Normal']))
        elements.append(Spacer(1, 0.3*cm))
        elements.append(Paragraph(
            "<i>Ce rapport a été généré automatiquement par le système DRSP Vakinankaratra. "
            "Pour toute question, contactez: surveillance.epidemio@drsp-vakinankaratra.mg</i>",
            styles['Normal']
        ))
        
        # Construction du PDF
        doc.build(elements)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_rapport_interventions(
        db: Session,
        date_debut: date,
        date_fin: date
    ) -> BytesIO:
        """🎯 Rapport des interventions avec analyse d'efficacité"""
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
        elements = []
        styles = RapportService._get_styles()
        
        # EN-TÊTE
        RapportService._add_header(
            elements,
            "RAPPORT DES INTERVENTIONS ÉPIDÉMIOLOGIQUES",
            f"{date_debut.strftime('%d/%m/%Y')} - {date_fin.strftime('%d/%m/%Y')}"
        )
        
        # ANALYSE DES INTERVENTIONS
        analyse = rapport_ia_service.generer_analyse_interventions(
            db, date_debut, date_fin
        )
        
        # RÉSUMÉ
        elements.append(Paragraph("📋 SYNTHÈSE DES INTERVENTIONS", styles['CustomSubtitle']))
        elements.append(Paragraph(analyse['message'], styles['Justified']))
        elements.append(Spacer(1, 0.5*cm))
        
        # STATISTIQUES
        data_stats = [
            ['Indicateur', 'Valeur'],
            ['Interventions menées', str(analyse['total'])],
            ['Interventions complétées', str(analyse['completees'])],
            ['Interventions en cours', str(analyse['en_cours'])],
            ['Taux de réalisation', f"{analyse['taux_completion']:.1f}%"]
        ]
        
        table = Table(data_stats, colWidths=[10*cm, 5*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E78')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.7*cm))
        
        # DÉTAIL DES INTERVENTIONS
        interventions = db.query(Intervention).filter(
            Intervention.date_debut >= date_debut,
            Intervention.date_debut <= date_fin
        ).all()
        
        if interventions:
            elements.append(Paragraph("📝 DÉTAIL DES INTERVENTIONS", styles['CustomSubtitle']))
            
            for intervention in interventions[:10]:  # Max 10
                maladie = db.query(Maladie).filter(Maladie.id == intervention.maladie_id).first()
                district = db.query(District).filter(District.id == intervention.district_id).first()
                
                intervention_text = f"""
<b>{intervention.titre}</b><br/>
Type: {intervention.type} | Maladie: {maladie.nom if maladie else 'N/A'} | District: {district.nom if district else 'N/A'}<br/>
Statut: {intervention.statut} | Score d'efficacité: {intervention.efficacite_score or 'N/A'}/5
"""
                elements.append(Paragraph(intervention_text, styles['Normal']))
                elements.append(Spacer(1, 0.3*cm))
        
        # Construction
        doc.build(elements)
        buffer.seek(0)
        return buffer


    # app/services/rapport_service.py (SUITE - AJOUTE CES MÉTHODES)

    @staticmethod
    def generate_rapport_predictions(
        db: Session,
        maladie_id: int,
        district_id: Optional[int] = None
    ) -> BytesIO:
        """🤖 Rapport de prédictions IA avec analyses"""
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
        elements = []
        styles = RapportService._get_styles()
        
        # Récupère la maladie
        maladie = db.query(Maladie).filter(Maladie.id == maladie_id).first()
        district = None
        if district_id:
            district = db.query(District).filter(District.id == district_id).first()
        
        # EN-TÊTE
        RapportService._add_header(
            elements,
            f"RAPPORT DE PRÉDICTIONS IA - {maladie.nom if maladie else 'N/A'}",
            f"Généré le {datetime.now().strftime('%d/%m/%Y')}",
            district.nom if district else None
        )
        
        # INTRODUCTION
        elements.append(Paragraph("📊 À PROPOS DE CE RAPPORT", styles['CustomSubtitle']))
        intro_text = f"""
Ce rapport présente les prédictions épidémiologiques générées par le modèle Prophet (Meta AI) 
pour la maladie <b>{maladie.nom if maladie else 'N/A'}</b>. Les prédictions sont basées sur 
l'analyse de 90 jours de données historiques et projettent l'évolution sur les 14 prochains jours.
"""
        elements.append(Paragraph(intro_text, styles['Justified']))
        elements.append(Spacer(1, 0.5*cm))
        
        # DONNÉES HISTORIQUES
        from datetime import timedelta
        date_fin = datetime.now().date()
        date_debut = date_fin - timedelta(days=90)
        
        query_historique = db.query(func.count(Cas.id)).filter(
            Cas.maladie_id == maladie_id,
            Cas.date_symptomes >= date_debut,
            Cas.date_symptomes <= date_fin
        )
        if district_id:
            query_historique = query_historique.filter(Cas.district_id == district_id)
        
        total_cas_historique = query_historique.scalar() or 0
        moyenne_quotidienne = total_cas_historique / 90
        
        elements.append(Paragraph("📈 ANALYSE DES DONNÉES HISTORIQUES", styles['CustomSubtitle']))
        
        data_historique = [
            ['Indicateur', 'Valeur'],
            ['Période analysée', '90 derniers jours'],
            ['Total de cas observés', str(total_cas_historique)],
            ['Moyenne quotidienne', f"{moyenne_quotidienne:.1f} cas/jour"],
            ['Dernière mise à jour', datetime.now().strftime('%d/%m/%Y %H:%M')]
        ]
        
        table_hist = Table(data_historique, colWidths=[10*cm, 5*cm])
        table_hist.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E78')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))
        
        elements.append(table_hist)
        elements.append(Spacer(1, 0.7*cm))
        
        # PRÉDICTIONS (Récupère la dernière prédiction)
 # Dans generate_rapport_predictions, REMPLACE la section "PRÉDICTIONS" par:

        # PRÉDICTIONS (Récupère la dernière prédiction)
        prediction_query = db.query(Prediction).filter(
            Prediction.maladie_id == maladie_id
        )
        if district_id:
            prediction_query = prediction_query.filter(Prediction.district_id == district_id)
        
        predictions = prediction_query.order_by(Prediction.created_at.desc()).limit(14).all()
        
        if predictions and len(predictions) > 0:  # ✅ AJOUTE CETTE VÉRIFICATION
            elements.append(Paragraph("🔮 PRÉDICTIONS POUR LES 14 PROCHAINS JOURS", styles['CustomSubtitle']))
            
            # Calcule statistiques des prédictions
            cas_predits_total = sum([p.cas_predits for p in predictions])
            moyenne_predite = cas_predits_total / len(predictions)
            max_predit = max([p.cas_predits for p in predictions])
            
            # Analyse de tendance
            tendance_pred = "hausse" if moyenne_predite > moyenne_quotidienne * 1.2 else \
                           "baisse" if moyenne_predite < moyenne_quotidienne * 0.8 else "stable"
            
            emoji_tendance = "📈" if tendance_pred == "hausse" else "📉" if tendance_pred == "baisse" else "➡️"
            
            analyse_pred = f"""
Le modèle prévoit une moyenne de <b>{moyenne_predite:.1f} cas par jour</b> sur les 14 prochains jours, 
avec un pic potentiel de <b>{max_predit:.0f} cas</b>. La tendance prédite est <b>{emoji_tendance} {tendance_pred.upper()}</b> 
par rapport aux données historiques récentes.
"""
            elements.append(Paragraph(analyse_pred, styles['Justified']))
            elements.append(Spacer(1, 0.5*cm))
            
            # Tableau des prédictions
            data_pred = [['Date', 'Cas prédits', 'Intervalle min-max', 'Confiance']]
            for pred in predictions[:7]:  # Affiche 7 jours
                data_pred.append([
                    pred.date_prediction.strftime('%d/%m/%Y'),
                    f"{pred.cas_predits:.0f}",
                    f"{pred.intervalle_min:.0f} - {pred.intervalle_max:.0f}",
                    f"{pred.confiance_score*100:.0f}%"
                ])
            
            table_pred = Table(data_pred, colWidths=[4*cm, 3*cm, 4*cm, 3*cm])
            table_pred.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7c3aed')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3e8ff')])
            ]))
            
            elements.append(table_pred)
            elements.append(Spacer(1, 0.7*cm))
            
            # RECOMMANDATIONS BASÉES SUR LES PRÉDICTIONS
            elements.append(Paragraph("💡 RECOMMANDATIONS BASÉES SUR LES PRÉDICTIONS", styles['CustomSubtitle']))
            
            if tendance_pred == "hausse":
                recommandations_pred = [
                    "🚨 Renforcer la surveillance épidémiologique dès maintenant",
                    "💉 Préparer une campagne de prévention ciblée",
                    "🏥 Augmenter les stocks de médicaments et consommables",
                    "👥 Former les équipes aux protocoles d'urgence",
                    "📢 Sensibiliser la population aux mesures préventives"
                ]
            elif tendance_pred == "baisse":
                recommandations_pred = [
                    "✅ Maintenir les mesures actuelles qui portent leurs fruits",
                    "📊 Documenter les facteurs de succès",
                    "🔄 Adapter les ressources en fonction de la baisse",
                    "👀 Rester vigilant malgré l'amélioration"
                ]
            else:
                recommandations_pred = [
                    "➡️ Maintenir la surveillance de routine",
                    "📋 Continuer les activités préventives actuelles",
                    "🔄 Réévaluer les prédictions chaque semaine"
                ]
            
            for i, rec in enumerate(recommandations_pred, 1):
                elements.append(Paragraph(f"{i}. {rec}", styles['Normal']))
                elements.append(Spacer(1, 0.2*cm))
            
        else:
            # ✅ MESSAGE SI PAS DE PRÉDICTIONS
            elements.append(Paragraph("🔮 PRÉDICTIONS", styles['CustomSubtitle']))
            elements.append(Paragraph(
                "⚠️ <b>Aucune prédiction disponible pour cette maladie.</b><br/><br/>"
                "Pour générer des prédictions :<br/>"
                "1. Allez dans le module <b>Statistiques</b><br/>"
                "2. Sélectionnez la maladie concernée<br/>"
                "3. Cliquez sur <b>Générer prédictions</b><br/><br/>"
                "Le modèle Prophet nécessite au minimum 7 jours de données historiques pour fonctionner.",
                styles['Alert']
            ))
        
        elements.append(Spacer(1, 1*cm))
        
        # MÉTHODOLOGIE (reste identique)
        elements.append(Paragraph("🔬 MÉTHODOLOGIE", styles['CustomSubtitle']))
        methodologie = """
<b>Modèle utilisé:</b> Prophet (développé par Meta/Facebook)<br/>
<b>Algorithme:</b> Analyse de séries temporelles avec décomposition de tendance et saisonnalité<br/>
<b>Données d'entraînement:</b> 90 jours de données historiques de cas confirmés<br/>
<b>Intervalle de confiance:</b> 95%<br/>
<b>Mise à jour:</b> Recommandée toutes les 48-72 heures<br/><br/>
<i>Note: Ces prédictions sont des projections statistiques basées sur les tendances passées. 
Elles doivent être utilisées comme outil d'aide à la décision et non comme certitude absolue.</i>
"""
        elements.append(Paragraph(methodologie, styles['Normal']))
        
        elements.append(Spacer(1, 1*cm))
        
        # PIED DE PAGE (✅ CORRIGÉ)
        elements.append(Paragraph("─" * 80, styles['Normal']))
        elements.append(Spacer(1, 0.3*cm))
        
        if predictions and len(predictions) > 0:
            confiance_text = f"Confiance moyenne: {predictions[0].confiance_score*100:.0f}%"
        else:
            confiance_text = "Générez des prédictions pour obtenir plus d'informations"
        
        elements.append(Paragraph(
            f"<i>Rapport généré automatiquement par le système DRSP Vakinankaratra. "
            f"Modèle: Prophet (Meta AI) | {confiance_text} | "
            f"Contact: surveillance.epidemio@drsp-vakinankaratra.mg</i>",
            styles['Normal']
        ))

        
        doc.build(elements)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_rapport_global(
        db: Session,
        annee: int,
        trimestre: Optional[int] = None
    ) -> BytesIO:
        """📈 Rapport global du système (annuel ou trimestriel)"""
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
        elements = []
        styles = RapportService._get_styles()
        
        # Déterminer les dates
        if trimestre:
            mois_debut = (trimestre - 1) * 3 + 1
            mois_fin = mois_debut + 2
            date_debut = date(annee, mois_debut, 1)
            dernier_jour = monthrange(annee, mois_fin)[1]
            date_fin = date(annee, mois_fin, dernier_jour)
            periode_nom = f"Trimestre {trimestre} {annee}"
        else:
            date_debut = date(annee, 1, 1)
            date_fin = date(annee, 12, 31)
            periode_nom = f"Année {annee}"
        
        # EN-TÊTE
        RapportService._add_header(
            elements,
            f"RAPPORT GLOBAL DU SYSTÈME DE SURVEILLANCE - {periode_nom.upper()}",
            periode_nom
        )
        
        # INTRODUCTION
        elements.append(Paragraph("📋 SYNTHÈSE GÉNÉRALE", styles['CustomSubtitle']))
        intro_text = f"""
Ce rapport présente une analyse exhaustive du système de surveillance épidémiologique 
de la région de Vakinankaratra pour {periode_nom}. Il couvre l'ensemble des activités 
de surveillance, d'intervention et d'analyse prédictive.
"""
        elements.append(Paragraph(intro_text, styles['Justified']))
        elements.append(Spacer(1, 0.5*cm))
        
        # STATISTIQUES GLOBALES DU SYSTÈME
        total_cas = db.query(func.count(Cas.id)).filter(
            Cas.date_declaration >= date_debut,
            Cas.date_declaration <= date_fin
        ).scalar() or 0
        
        total_alertes = db.query(func.count(Alerte.id)).filter(
            Alerte.date_detection >= date_debut,
            Alerte.date_detection <= date_fin
        ).scalar() or 0
        
        total_interventions = db.query(func.count(Intervention.id)).filter(
            Intervention.date_debut >= date_debut,
            Intervention.date_debut <= date_fin
        ).scalar() or 0
        
        total_deces = db.query(func.count(Cas.id)).filter(
            Cas.date_declaration >= date_debut,
            Cas.date_declaration <= date_fin,
            Cas.statut == CasStatut.DECEDE
        ).scalar() or 0
        
        taux_letalite_global = (total_deces / total_cas * 100) if total_cas > 0 else 0
        
        elements.append(Paragraph("📊 INDICATEURS CLÉS DU SYSTÈME", styles['CustomSubtitle']))
        
        data_global = [
            ['Indicateur', 'Valeur', 'Statut'],
            ['Cas déclarés', str(total_cas), '📈'],
            ['Alertes générées', str(total_alertes), '🚨'],
            ['Interventions menées', str(total_interventions), '🎯'],
            ['Taux de létalité global', f"{taux_letalite_global:.2f}%", '⚕️'],
            ['Districts couverts', '7/7', '✅'],
            ['Centres de santé actifs', 
             str(db.query(func.count(func.distinct(Cas.centre_sante_id))).filter(
                 Cas.date_declaration >= date_debut,
                 Cas.date_declaration <= date_fin
             ).scalar() or 0), 
             '🏥']
        ]
        
        table_global = Table(data_global, colWidths=[9*cm, 4*cm, 2*cm])
        table_global.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E78')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))
        
        elements.append(table_global)
        elements.append(Spacer(1, 0.7*cm))
        
        # TOP 5 MALADIES
        elements.append(Paragraph("🦠 MALADIES LES PLUS SURVEILLÉES", styles['CustomSubtitle']))
        
        top_maladies = db.query(
            Maladie.nom,
            func.count(Cas.id).label('cas')
        ).join(Cas).filter(
            Cas.date_declaration >= date_debut,
            Cas.date_declaration <= date_fin
        ).group_by(Maladie.nom).order_by(func.count(Cas.id).desc()).limit(5).all()
        
        data_maladies = [['Rang', 'Maladie', 'Nombre de cas', '% du total']]
        for i, (nom, cas) in enumerate(top_maladies, 1):
            pourcent = (cas / total_cas * 100) if total_cas > 0 else 0
            data_maladies.append([
                str(i),
                nom,
                str(cas),
                f"{pourcent:.1f}%"
            ])
        
        table_maladies = Table(data_maladies, colWidths=[2*cm, 7*cm, 3*cm, 3*cm])
        table_maladies.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E78')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))
        
        elements.append(table_maladies)
        elements.append(Spacer(1, 0.7*cm))
        
        # PERFORMANCE DU SYSTÈME
        elements.append(Paragraph("⚡ PERFORMANCE DU SYSTÈME", styles['CustomSubtitle']))
        
        performance_text = f"""
<b>Réactivité du système:</b> Le système a détecté et généré {total_alertes} alertes durant cette période, 
démontrant une capacité de surveillance active.<br/><br/>
<b>Capacité d'intervention:</b> {total_interventions} interventions ont été déployées en réponse aux alertes 
et aux besoins identifiés.<br/><br/>
<b>Couverture géographique:</b> Le système couvre l'intégralité des 7 districts de Vakinankaratra 
avec un réseau de centres de santé rapporteurs.<br/><br/>
<b>Utilisation de l'IA:</b> Le module de prédictions Prophet a été utilisé pour anticiper les tendances 
épidémiologiques et orienter les décisions stratégiques.
"""
        elements.append(Paragraph(performance_text, styles['Justified']))
        elements.append(Spacer(1, 0.7*cm))
        
        # RECOMMANDATIONS STRATÉGIQUES
        elements.append(Paragraph("🎯 RECOMMANDATIONS STRATÉGIQUES", styles['CustomSubtitle']))
        
        recommandations_globales = [
            "Poursuivre le renforcement des capacités de surveillance dans tous les districts",
            "Intensifier l'utilisation des outils prédictifs pour l'anticipation des épidémies",
            "Améliorer la coordination entre les centres de santé et la direction régionale",
            "Renforcer la formation continue du personnel de santé",
            "Développer des partenariats avec les communautés pour la détection précoce",
            "Assurer la maintenance et la mise à jour régulière du système informatique"
        ]
        
        for i, rec in enumerate(recommandations_globales, 1):
            elements.append(Paragraph(f"{i}. {rec}", styles['Normal']))
            elements.append(Spacer(1, 0.2*cm))
        
        elements.append(Spacer(1, 1*cm))
        
        # CONCLUSION
        elements.append(Paragraph("✅ CONCLUSION", styles['CustomSubtitle']))
        conclusion = f"""
Le système de surveillance épidémiologique de Vakinankaratra a démontré son efficacité durant {periode_nom} 
avec la gestion de {total_cas} cas déclarés et le déploiement de {total_interventions} interventions. 
L'intégration de l'intelligence artificielle pour les prédictions constitue un atout majeur pour l'anticipation 
et la préparation aux épidémies futures.
"""
        elements.append(Paragraph(conclusion, styles['Justified']))
        
        elements.append(Spacer(1, 1*cm))
        
        # PIED DE PAGE
        elements.append(Paragraph("─" * 80, styles['Normal']))
        elements.append(Spacer(1, 0.3*cm))
        elements.append(Paragraph(
            f"<i>Rapport global généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')} | "
            f"DRSP Vakinankaratra | Contact: direction@drsp-vakinankaratra.mg</i>",
            styles['Normal']
        ))
        
        doc.build(elements)
        buffer.seek(0)
        return buffer


# Instance globale
rapport_service = RapportService()

