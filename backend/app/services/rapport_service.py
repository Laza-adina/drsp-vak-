# app/services/rapport_service.py
from datetime import datetime, date
from typing import Optional
from io import BytesIO
from sqlalchemy.orm import Session
from sqlalchemy import func

from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT

from app.models.cas import Cas
from app.models.district import District
from app.models.maladie import Maladie
from app.utils.enums import CasStatut


class RapportService:
    """Service pour la génération de rapports PDF"""
    
    @staticmethod
    def generate_rapport_hebdomadaire(
        db: Session,
        date_debut: date,
        date_fin: date,
        district_id: Optional[int] = None
    ) -> BytesIO:
        """
        Génère un rapport hebdomadaire au format PDF
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()
        
        # Style personnalisé pour le titre
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1a5490'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        # Titre du rapport
        titre = f"Rapport Hebdomadaire de Surveillance Épidémiologique"
        elements.append(Paragraph(titre, title_style))
        elements.append(Spacer(1, 0.5*cm))
        
        # Informations générales
        info_style = styles['Normal']
        elements.append(Paragraph(f"<b>Période:</b> {date_debut.strftime('%d/%m/%Y')} - {date_fin.strftime('%d/%m/%Y')}", info_style))
        elements.append(Paragraph(f"<b>Date de génération:</b> {datetime.now().strftime('%d/%m/%Y %H:%M')}", info_style))
        
        if district_id:
            district = db.query(District).filter(District.id == district_id).first()
            if district:
                elements.append(Paragraph(f"<b>District:</b> {district.nom}", info_style))
        else:
            elements.append(Paragraph(f"<b>Couverture:</b> Tous les districts", info_style))
        
        elements.append(Spacer(1, 1*cm))
        
        # Statistiques globales
        query = db.query(func.count(Cas.id)).filter(
            Cas.date_declaration >= date_debut,
            Cas.date_declaration <= date_fin
        )
        
        if district_id:
            query = query.filter(Cas.district_id == district_id)
        
        total_cas = query.scalar() or 0
        
        # Cas par statut
        cas_confirmes = query.filter(Cas.statut == CasStatut.CONFIRME).scalar() or 0
        cas_suspects = query.filter(Cas.statut == CasStatut.SUSPECT).scalar() or 0
        cas_deces = query.filter(Cas.statut == CasStatut.DECEDE).scalar() or 0
        cas_gueris = query.filter(Cas.statut == CasStatut.GUERI).scalar() or 0
        
        # Tableau des statistiques
        elements.append(Paragraph("<b>1. STATISTIQUES GLOBALES</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.3*cm))
        
        data = [
            ['Indicateur', 'Nombre'],
            ['Total de cas déclarés', str(total_cas)],
            ['Cas suspects', str(cas_suspects)],
            ['Cas confirmés', str(cas_confirmes)],
            ['Cas guéris', str(cas_gueris)],
            ['Décès', str(cas_deces)]
        ]
        
        table = Table(data, colWidths=[12*cm, 4*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 1*cm))
        
        # Cas par maladie
        elements.append(Paragraph("<b>2. RÉPARTITION PAR MALADIE</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.3*cm))
        
        query_maladies = db.query(
            Maladie.nom,
            func.count(Cas.id).label('nombre')
        ).join(
            Cas, Cas.maladie_id == Maladie.id
        ).filter(
            Cas.date_declaration >= date_debut,
            Cas.date_declaration <= date_fin
        )
        
        if district_id:
            query_maladies = query_maladies.filter(Cas.district_id == district_id)
        
        maladies_data = query_maladies.group_by(Maladie.nom).order_by(func.count(Cas.id).desc()).all()
        
        if maladies_data:
            data_maladies = [['Maladie', 'Nombre de cas', 'Pourcentage']]
            for maladie in maladies_data:
                pourcentage = (maladie.nombre / total_cas * 100) if total_cas > 0 else 0
                data_maladies.append([
                    maladie.nom,
                    str(maladie.nombre),
                    f"{pourcentage:.1f}%"
                ])
            
            table_maladies = Table(data_maladies, colWidths=[8*cm, 4*cm, 4*cm])
            table_maladies.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(table_maladies)
        else:
            elements.append(Paragraph("Aucune donnée disponible", info_style))
        
        elements.append(Spacer(1, 1*cm))
        
        # Cas par district
        if not district_id:
            elements.append(Paragraph("<b>3. RÉPARTITION PAR DISTRICT</b>", styles['Heading2']))
            elements.append(Spacer(1, 0.3*cm))
            
            query_districts = db.query(
                District.nom,
                func.count(Cas.id).label('nombre')
            ).join(
                Cas, Cas.district_id == District.id
            ).filter(
                Cas.date_declaration >= date_debut,
                Cas.date_declaration <= date_fin
            ).group_by(District.nom).order_by(func.count(Cas.id).desc()).all()
            
            if query_districts:
                data_districts = [['District', 'Nombre de cas']]
                for district in query_districts:
                    data_districts.append([district.nom, str(district.nombre)])
                
                table_districts = Table(data_districts, colWidths=[12*cm, 4*cm])
                table_districts.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                
                elements.append(table_districts)
        
        # Construire le PDF
        doc.build(elements)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_rapport_mensuel(
        db: Session,
        annee: int,
        mois: int,
        district_id: Optional[int] = None
    ) -> BytesIO:
        """
        Génère un rapport mensuel au format PDF
        """
        from calendar import monthrange
        
        # Déterminer les dates
        date_debut = date(annee, mois, 1)
        dernier_jour = monthrange(annee, mois)[1]
        date_fin = date(annee, mois, d0ernier_jour)
        
        # Utiliser la même fonction avec les dates du mois
        return RapportService.generate_rapport_hebdomadaire(
            db=db,
            date_debut=date_debut,
            date_fin=date_fin,
            district_id=district_id
        )


# Instance globale
rapport_service = RapportService()