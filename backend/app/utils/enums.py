# app/utils/enums.py
from enum import Enum


class UserRole(str, Enum):
    ADMINISTRATEUR = "ADMINISTRATEUR"  
    EPIDEMIOLOGISTE = "EPIDEMIOLOGISTE"  
    AGENT_SAISIE = "AGENT_SAISIE"  
    LECTEUR = "LECTEUR"  


class CasStatut(str, Enum):
    SUSPECT = "suspect"
    PROBABLE = "probable"
    CONFIRME = "confirme"
    GUERI = "gueri"
    DECEDE = "decede"


class Sexe(str, Enum):
    MASCULIN = "masculin"
    FEMININ = "feminin"
    AUTRE = "autre"


class TypeCentreSante(str, Enum):
    CSB1 = "csb1"
    CSB2 = "csb2"
    CHD = "chd"
    CHU = "chu"
    HOPITAL = "hopital"


class AlerteNiveau(str, Enum):
    INFO = "info"
    AVERTISSEMENT = "avertissement"
    ALERTE = "alerte"
    CRITIQUE = "critique"


class AlerteStatut(str, Enum):
    ACTIVE = "active"
    EN_COURS = "en_cours"
    RESOLUE = "resolue"
    FAUSSE_ALERTE = "fausse_alerte"


class TypeIntervention(str, Enum):
    INVESTIGATION = "investigation"
    VACCINATION = "vaccination"
    DESINFECTION = "desinfection"
    SENSIBILISATION = "sensibilisation"
    TRAITEMENT = "traitement"
    QUARANTAINE = "quarantaine"


class InterventionStatut(str, Enum):
    PLANIFIEE = "planifiee"
    EN_COURS = "en_cours"
    TERMINEE = "terminee"
    ANNULEE = "annulee"


class AnomalieSeverite(str, Enum):
    FAIBLE = "faible"
    MODERE = "modere"
    ELEVE = "eleve"
    CRITIQUE = "critique"


class RisqueNiveau(str, Enum):
    TRES_FAIBLE = "tres_faible"
    FAIBLE = "faible"
    MODERE = "modere"
    ELEVE = "eleve"
    TRES_ELEVE = "tres_eleve"


class ModeTransmission(str, Enum):
    AERIENNE = "aerienne"
    CONTACT = "contact"
    VECTORIELLE = "vectorielle"
    ALIMENTAIRE = "alimentaire"
    EAU = "eau"
    SEXUELLE = "sexuelle"
    SANGUINE = "sanguine"