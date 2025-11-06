# scripts/seed_data.py
"""
Script pour initialiser la base de données avec des données de test
Exécuter : python -m scripts.seed_data
"""
import sys
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH
sys.path.append(str(Path(__file__).parent.parent))

from datetime import datetime, timedelta
import random
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.district import District
from app.models.centre_sante import CentreSante
from app.models.maladie import Maladie
from app.models.cas import Cas
from app.core.security import get_password_hash
from app.utils.enums import (
    UserRole, TypeCentreSante, ModeTransmission,
    CasStatut, Sexe
)


def create_tables():
    """Créer toutes les tables"""
    print("Création des tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables créées")


def seed_users(db):
    """Créer les utilisateurs de test"""
    print("\nCréation des utilisateurs...")
    
    users_data = [
        {
            "email": "admin@drsp.mg",
            "nom": "Administrateur",
            "prenom": "Système",
            "password": "admin123",
            "role": UserRole.ADMINISTRATEUR
        },
        {
            "email": "epidemio@drsp.mg",
            "nom": "Rakoto",
            "prenom": "Jean",
            "password": "epidemio123",
            "role": UserRole.EPIDEMIOLOGISTE
        },
        {
            "email": "agent@drsp.mg",
            "nom": "Razafy",
            "prenom": "Marie",
            "password": "agent123",
            "role": UserRole.AGENT_SAISIE
        },
        {
            "email": "lecteur@drsp.mg",
            "nom": "Randria",
            "prenom": "Paul",
            "password": "lecteur123",
            "role": UserRole.LECTEUR
        }
    ]
    
    for user_data in users_data:
        user = User(
            email=user_data["email"],
            nom=user_data["nom"],
            prenom=user_data["prenom"],
            hashed_password=get_password_hash(user_data["password"]),
            role=user_data["role"]
        )
        db.add(user)
    
    db.commit()
    print(f"✓ {len(users_data)} utilisateurs créés")


def seed_districts(db):
    """Créer les districts"""
    print("\nCréation des districts...")
    
    districts_data = [
        {
            "nom": "Antananarivo Renivohitra",
            "code": "TANA-R",
            "population": 1275207,
            "latitude": -18.8792,
            "longitude": 47.5079
        },
        {
            "nom": "Toamasina I",
            "code": "TOAST-I",
            "population": 289351,
            "latitude": -18.1443,
            "longitude": 49.3958
        },
        {
            "nom": "Mahajanga I",
            "code": "MAHAJ-I",
            "population": 244722,
            "latitude": -15.7167,
            "longitude": 46.3167
        },
        {
            "nom": "Ambohidratrimo",
            "code": "AMBOH",
            "population": 452032,
            "latitude": -18.7333,
            "longitude": 47.4333
        }
    ]
    
    for district_data in districts_data:
        district = District(**district_data)
        db.add(district)
    
    db.commit()
    print(f"✓ {len(districts_data)} districts créés")


def seed_centres_sante(db):
    """Créer les centres de santé"""
    print("\nCréation des centres de santé...")
    
    districts = db.query(District).all()
    
    centres_data = [
        {
            "nom": "CSB2 Isotry",
            "type": TypeCentreSante.CSB2,
            "district_id": districts[0].id,
            "latitude": -18.9204,
            "longitude": 47.5228,
            "a_laboratoire": True,
            "capacite_accueil": 50
        },
        {
            "nom": "CHU Befelatanana",
            "type": TypeCentreSante.CHU,
            "district_id": districts[0].id,
            "latitude": -18.9138,
            "longitude": 47.5219,
            "a_laboratoire": True,
            "capacite_accueil": 200
        },
        {
            "nom": "CSB1 Ambohimanarina",
            "type": TypeCentreSante.CSB1,
            "district_id": districts[0].id,
            "latitude": -18.8920,
            "longitude": 47.5355,
            "a_laboratoire": False,
            "capacite_accueil": 30
        },
        {
            "nom": "CHD Toamasina",
            "type": TypeCentreSante.CHD,
            "district_id": districts[1].id,
            "latitude": -18.1475,
            "longitude": 49.3953,
            "a_laboratoire": True,
            "capacite_accueil": 150
        },
        {
            "nom": "CSB2 Mahajanga",
            "type": TypeCentreSante.CSB2,
            "district_id": districts[2].id,
            "latitude": -15.7194,
            "longitude": 46.3169,
            "a_laboratoire": True,
            "capacite_accueil": 60
        }
    ]
    
    for centre_data in centres_data:
        centre = CentreSante(**centre_data)
        db.add(centre)
    
    db.commit()
    print(f"✓ {len(centres_data)} centres de santé créés")


def seed_maladies(db):
    """Créer les maladies à surveiller"""
    print("\nCréation des maladies...")
    
    maladies_data = [
        {
            "nom": "Peste",
            "code_icd10": "A20",
            "mode_transmission": ModeTransmission.VECTORIELLE,
            "periode_incubation_min": 1,
            "periode_incubation_max": 7,
            "priorite_surveillance": 5,
            "description": "Maladie infectieuse causée par Yersinia pestis",
            "symptomes": "Fièvre, frissons, malaise, ganglions enflés"
        },
        {
            "nom": "Paludisme",
            "code_icd10": "B50",
            "mode_transmission": ModeTransmission.VECTORIELLE,
            "periode_incubation_min": 7,
            "periode_incubation_max": 30,
            "priorite_surveillance": 5,
            "description": "Parasitose transmise par les moustiques",
            "symptomes": "Fièvre, frissons, sueurs, maux de tête"
        },
        {
            "nom": "Rougeole",
            "code_icd10": "B05",
            "mode_transmission": ModeTransmission.AERIENNE,
            "periode_incubation_min": 7,
            "periode_incubation_max": 21,
            "priorite_surveillance": 4,
            "description": "Maladie virale très contagieuse",
            "symptomes": "Fièvre, toux, éruption cutanée, conjonctivite"
        },
        {
            "nom": "Choléra",
            "code_icd10": "A00",
            "mode_transmission": ModeTransmission.EAU,
            "periode_incubation_min": 1,
            "periode_incubation_max": 5,
            "priorite_surveillance": 5,
            "description": "Infection intestinale aiguë",
            "symptomes": "Diarrhée aqueuse abondante, vomissements"
        },
        {
            "nom": "COVID-19",
            "code_icd10": "U07.1",
            "mode_transmission": ModeTransmission.AERIENNE,
            "periode_incubation_min": 2,
            "periode_incubation_max": 14,
            "priorite_surveillance": 4,
            "description": "Maladie à coronavirus 2019",
            "symptomes": "Fièvre, toux, fatigue, perte du goût/odorat"
        },
        {
            "nom": "Dengue",
            "code_icd10": "A90",
            "mode_transmission": ModeTransmission.VECTORIELLE,
            "periode_incubation_min": 3,
            "periode_incubation_max": 14,
            "priorite_surveillance": 4,
            "description": "Fièvre hémorragique virale",
            "symptomes": "Fièvre élevée, douleurs articulaires, éruption"
        },
        {
            "nom": "Tuberculose",
            "code_icd10": "A15",
            "mode_transmission": ModeTransmission.AERIENNE,
            "periode_incubation_min": 30,
            "periode_incubation_max": 90,
            "priorite_surveillance": 3,
            "description": "Infection bactérienne des poumons",
            "symptomes": "Toux persistante, fièvre, sueurs nocturnes"
        }
    ]
    
    for maladie_data in maladies_data:
        maladie = Maladie(**maladie_data)
        db.add(maladie)
    
    db.commit()
    print(f"✓ {len(maladies_data)} maladies créées")


def seed_cas(db):
    """Créer des cas de test"""
    print("\nCréation des cas...")
    
    maladies = db.query(Maladie).all()
    centres = db.query(CentreSante).all()
    districts = db.query(District).all()
    users = db.query(User).filter(
        User.role.in_([UserRole.AGENT_SAISIE, UserRole.EPIDEMIOLOGISTE])
    ).all()
    
    if not users:
        users = db.query(User).all()
    
    # Générer 500 cas sur 6 mois
    nombre_cas = 500
    jours = 180
    
    for i in range(nombre_cas):
        # Date aléatoire dans les 6 derniers mois
        jours_avant = random.randint(0, jours)
        date_cas = datetime.now() - timedelta(days=jours_avant)
        date_symptomes = date_cas - timedelta(days=random.randint(0, 7))
        
        maladie = random.choice(maladies)
        centre = random.choice(centres)
        district = db.query(District).filter(
            District.id == centre.district_id
        ).first()
        
        # Numéro de cas
        year = date_cas.year
        numero_cas = f"CAS-{year}-{str(i+1).zfill(6)}"
        
        cas = Cas(
            numero_cas=numero_cas,
            maladie_id=maladie.id,
            centre_sante_id=centre.id,
            district_id=district.id,
            date_symptomes=date_symptomes.date(),
            date_declaration=date_cas.date(),
            age=random.randint(1, 80),
            sexe=random.choice([Sexe.MASCULIN, Sexe.FEMININ]),
            statut=random.choices(
                [CasStatut.SUSPECT, CasStatut.CONFIRME, CasStatut.GUERI, CasStatut.DECEDE],
                weights=[0.3, 0.4, 0.25, 0.05]
            )[0],
            latitude=centre.latitude + random.uniform(-0.05, 0.05) if centre.latitude else None,
            longitude=centre.longitude + random.uniform(-0.05, 0.05) if centre.longitude else None,
            created_by=random.choice(users).id,
            created_at=date_cas
        )
        db.add(cas)
    
    db.commit()
    print(f"✓ {nombre_cas} cas créés")


def main():
    """Fonction principale"""
    print("=" * 50)
    print("INITIALISATION DE LA BASE DE DONNÉES DRSP")
    print("=" * 50)
    
    # Créer les tables
    create_tables()
    
    # Créer une session
    db = SessionLocal()
    
    try:
        # Vérifier si les données existent déjà
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("\n⚠️  La base de données contient déjà des données.")
            response = input("Voulez-vous réinitialiser ? (y/N): ")
            if response.lower() != 'y':
                print("Annulation.")
                return
            
            # Supprimer toutes les données
            print("\nSuppression des données existantes...")
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            print("✓ Données supprimées")
        
        # Créer les données
        seed_users(db)
        seed_districts(db)
        seed_centres_sante(db)
        seed_maladies(db)
        seed_cas(db)
        
        print("\n" + "=" * 50)
        print("✓ INITIALISATION TERMINÉE AVEC SUCCÈS")
        print("=" * 50)
        print("\nComptes créés :")
        print("- Admin: admin@drsp.mg / admin123")
        print("- Épidémiologiste: epidemio@drsp.mg / epidemio123")
        print("- Agent de saisie: agent@drsp.mg / agent123")
        print("- Lecteur: lecteur@drsp.mg / lecteur123")
        
    except Exception as e:
        print(f"\n❌ Erreur : {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()