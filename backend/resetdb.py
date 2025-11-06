"""
🗑️ Script de réinitialisation de la base de données
⚠️ ATTENTION : Ce script supprime TOUTES les données !
"""

import sys
import os

# Ajouter le répertoire parent au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session

# Imports adaptés à votre structure
from database import SessionLocal, engine
from models.base import Base
from models.user import User
from models.maladie import Maladie
from models.district import District
from models.centre_sante import CentreSante
from models.cas import Cas
from core.security import get_password_hash


def reset_database():
    """Supprime et recrée toutes les tables"""
    print("🗑️  Suppression des tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("📦 Création des tables...")
    Base.metadata.create_all(bind=engine)
    
    print("✅ Base de données réinitialisée !")


def create_test_data():
    """Crée des données de test cohérentes"""
    db = SessionLocal()
    
    try:
        print("\n📝 Création des données de test...\n")
        
        # 1️⃣ UTILISATEURS
        print("👥 Création des utilisateurs...")
        users = [
            User(
                email="admin@drsp.mg",
                nom="Admin",
                prenom="Système",
                hashed_password=get_password_hash("admin123"),
                role="Admin",
                is_active=True
            ),
            User(
                email="epidemio@drsp.mg",
                nom="Rakoto",
                prenom="Jean",
                hashed_password=get_password_hash("epidemio123"),
                role="Épidémiologiste",
                is_active=True
            ),
            User(
                email="agent@drsp.mg",
                nom="Rabe",
                prenom="Marie",
                hashed_password=get_password_hash("agent123"),
                role="Agent de saisie",
                is_active=True
            ),
        ]
        db.add_all(users)
        db.commit()
        print(f"   ✅ {len(users)} utilisateurs créés")
        
        # 2️⃣ MALADIES
        print("\n🦠 Création des maladies...")
        maladies = [
            Maladie(nom="Paludisme", code="PAL", seuil_alerte=10, is_active=True),
            Maladie(nom="Tuberculose", code="TBC", seuil_alerte=5, is_active=True),
            Maladie(nom="Rougeole", code="RGE", seuil_alerte=3, is_active=True),
            Maladie(nom="COVID-19", code="COV", seuil_alerte=20, is_active=True),
        ]
        db.add_all(maladies)
        db.commit()
        print(f"   ✅ {len(maladies)} maladies créées")
        
        # 3️⃣ DISTRICTS
        print("\n🗺️  Création des districts...")
        districts = [
            District(nom="Antananarivo Renivohitra", population=1300000, code="101"),
            District(nom="Toamasina I", population=300000, code="201"),
            District(nom="Mahajanga I", population=250000, code="301"),
            District(nom="Antsirabe I", population=250000, code="401"),
            District(nom="Fianarantsoa I", population=200000, code="501"),
        ]
        db.add_all(districts)
        db.commit()
        print(f"   ✅ {len(districts)} districts créés")
        
        # 4️⃣ CENTRES DE SANTÉ
        print("\n🏥 Création des centres de santé...")
        centres = [
            CentreSante(nom="CHU Befelatanana", district_id=1, latitude=-18.9137, longitude=47.5362, type_centre="CHU"),
            CentreSante(nom="CSB Analakely", district_id=1, latitude=-18.9190, longitude=47.5267, type_centre="CSB II"),
            CentreSante(nom="CHD Toamasina", district_id=2, latitude=-18.1443, longitude=49.4019, type_centre="CHD"),
            CentreSante(nom="CSB Mahajanga", district_id=3, latitude=-15.7167, longitude=46.3167, type_centre="CSB II"),
            CentreSante(nom="CHD Antsirabe", district_id=4, latitude=-19.8637, longitude=47.0363, type_centre="CHD"),
        ]
        db.add_all(centres)
        db.commit()
        print(f"   ✅ {len(centres)} centres créés")
        
        # 5️⃣ CAS (30 derniers jours)
        print("\n🏥 Création des cas...")
        
        today = datetime.now()
        cas_list = []
        
        for day_offset in range(30):
            date = today - timedelta(days=day_offset)
            nb_cas = random.randint(3, 12)
            
            for i in range(nb_cas):
                maladie = random.choice(maladies)
                district = random.choice(districts)
                centre = random.choice([c for c in centres if c.district_id == district.id] or centres)
                
                cas = Cas(
                    numero_cas=f"CAS{date.strftime('%Y%m%d')}{i:03d}",
                    maladie_id=maladie.id,
                    district_id=district.id,
                    centre_sante_id=centre.id,
                    date_symptomes=date - timedelta(days=random.randint(0, 3)),
                    date_declaration=date.date(),
                    patient_nom=f"Patient{random.randint(1000, 9999)}",
                    patient_prenom=f"Prenom{random.randint(100, 999)}",
                    age=random.randint(1, 80),
                    sexe=random.choice(['M', 'F']),
                    latitude=centre.latitude + random.uniform(-0.1, 0.1),
                    longitude=centre.longitude + random.uniform(-0.1, 0.1),
                    statut=random.choice(['Suspect', 'Confirmé', 'En cours']),
                    cas_confirme=random.choice([True, False]),
                    utilisateur_id=users[0].id,
                    created_at=date
                )
                cas_list.append(cas)
        
        db.add_all(cas_list)
        db.commit()
        print(f"   ✅ {len(cas_list)} cas créés")
        
        print("\n" + "="*50)
        print("✅ SUCCÈS !")
        print("="*50)
        print(f"\n📊 Résumé :")
        print(f"   Utilisateurs : {len(users)}")
        print(f"   Maladies : {len(maladies)}")
        print(f"   Districts : {len(districts)}")
        print(f"   Centres : {len(centres)}")
        print(f"   Cas : {len(cas_list)}")
        print(f"\n🔐 Comptes :")
        print(f"   admin@drsp.mg / admin123")
        print(f"   epidemio@drsp.mg / epidemio123")
        print(f"   agent@drsp.mg / agent123\n")
        
    except Exception as e:
        print(f"\n❌ Erreur : {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("⚠️  Ce script va SUPPRIMER toutes les données !")
    response = input("Continuer ? (oui/non) : ")
    
    if response.lower() in ['oui', 'o', 'yes', 'y']:
        reset_database()
        create_test_data()
        print("🎉 Terminé !")
    else:
        print("❌ Annulé.")
