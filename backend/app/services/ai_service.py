# app/services/ai_service.py
"""
📄 Fichier: app/services/ai_service.py
📝 Description: Service IA pour recommandations via Groq
"""

from groq import Groq
import os
from typing import Dict, List, Optional
import json
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY manquante dans .env")

groq_client = Groq(api_key=GROQ_API_KEY)

# ✅ MODÈLE MIS À JOUR (novembre 2025)
DEFAULT_MODEL = "llama-3.3-70b-versatile"  # Remplace l'ancien llama-3.1-70b
MODEL_RAPIDE = "llama-3.1-8b-instant"      # Pour suggestions courtes

class AIService:
    
    @staticmethod
    async def generer_recommandations_intervention(
        maladie_nom: str,
        district_nom: str,
        nb_cas: int,
        tendance: str,
        cas_recents: List[Dict],
        interventions_passees: Optional[List[Dict]] = None,
        alerte_info: Optional[Dict] = None
    ) -> Dict:
        """
        🤖 Génère 3 recommandations d'interventions via Groq
        """
        
        contexte = f"""Tu es un expert en épidémiologie pour Madagascar (région Vakinankaratra).

SITUATION ACTUELLE:
- Maladie: {maladie_nom}
- District: {district_nom}
- Nombre de cas: {nb_cas}
- Tendance: {tendance}
"""

        if alerte_info:
            contexte += f"\n- 🚨 ALERTE: {alerte_info['niveau_gravite']} - {alerte_info['description']}"
        
        if interventions_passees and len(interventions_passees) > 0:
            contexte += f"\n\nINTERVENTIONS RÉCENTES:"
            for interv in interventions_passees[:3]:
                contexte += f"\n- {interv['type']}: {interv['titre']} (Efficacité: {interv.get('efficacite_score', 'N/A')}/5)"

        prompt = f"""{contexte}

Recommande 3 interventions prioritaires. Format JSON exact:

{{
  "interventions": [
    {{
      "titre": "Titre clair et court (max 60 caractères)",
      "description": "Description détaillée en 3-4 phrases",
      "type": "vaccination|sensibilisation|desinfection|distribution_medicaments|formation_personnel|enquete_terrain|autre",
      "priorite": 1|2|3,
      "justification": "Pourquoi cette intervention maintenant?",
      "population_cible": nombre_estimé,
      "budget_estime": montant_en_ariary,
      "duree_jours": nombre_de_jours,
      "ressources": ["ressource1", "ressource2", "ressource3"],
      "indicateurs_succes": ["indicateur1", "indicateur2"]
    }}
  ],
  "analyse_globale": "Synthèse épidémiologique (2-3 phrases)",
  "risques_identifies": ["risque1", "risque2", "risque3"],
  "recommandations_generales": "Conseils additionnels"
}}

Types valides: vaccination, sensibilisation, desinfection, distribution_medicaments, formation_personnel, enquete_terrain, autre
Réponds UNIQUEMENT en JSON pur, sans markdown."""

        try:
            completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Expert santé publique Madagascar. Réponses JSON structurées, précises et actionnables."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=DEFAULT_MODEL,  # ✅ Utilise le nouveau modèle
                temperature=0.3,
                max_tokens=2500,
                response_format={"type": "json_object"}
            )
            
            response_text = completion.choices[0].message.content
            recommendations = json.loads(response_text)
            
            return {
                "success": True,
                "data": recommendations,
                "model": DEFAULT_MODEL,
                "tokens": completion.usage.total_tokens
            }
            
        except Exception as e:
            print(f"❌ Erreur Groq: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "data": AIService._fallback_recommendations(maladie_nom, nb_cas)
            }
    
    @staticmethod
    def _fallback_recommendations(maladie: str, nb_cas: int) -> Dict:
        """Recommandations de secours si Groq échoue"""
        return {
            "interventions": [
                {
                    "titre": f"Investigation {maladie}",
                    "description": f"Enquête épidémiologique sur les {nb_cas} cas déclarés",
                    "type": "enquete_terrain",
                    "priorite": 1,
                    "justification": "Investigation standard obligatoire",
                    "population_cible": nb_cas * 10,
                    "budget_estime": 500000,
                    "duree_jours": 7,
                    "ressources": ["Équipe mobile", "Kits prélèvement"],
                    "indicateurs_succes": ["Tous cas investigués", "Source identifiée"]
                }
            ],
            "analyse_globale": "Recommandations standard appliquées (IA indisponible)",
            "risques_identifies": ["Propagation communautaire"],
            "recommandations_generales": "Suivre protocoles Ministère Santé Publique"
        }
    
    @staticmethod
    async def suggerer_action_alerte(
        alerte: Dict,
        nb_cas: int,
        interventions_en_cours: int
    ) -> str:
        """
        🤖 Suggestion d'action courte pour une alerte (affichage UI)
        """
        
        prompt = f"""Situation d'alerte épidémiologique à Madagascar:
- Maladie: {alerte['maladie_nom']}
- District: {alerte['district_nom']}
- Niveau: {alerte['niveau_gravite']}
- Cas: {nb_cas}
- Interventions actives: {interventions_en_cours}

Fournis UNE action prioritaire immédiate en 1 phrase courte (max 120 caractères).
Format: "Action: [description]"
"""

        try:
            completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "Expert santé publique. Réponses ultra-concises."},
                    {"role": "user", "content": prompt}
                ],
                model=MODEL_RAPIDE,  # ✅ Utilise le modèle rapide
                temperature=0.2,
                max_tokens=80
            )
            
            return completion.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Action: Investiguer immédiatement les {nb_cas} cas dans {alerte['district_nom']}"
