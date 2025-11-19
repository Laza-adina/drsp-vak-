// src/types/interventions.types.ts
export type TypeIntervention = 
  | 'vaccination'
  | 'sensibilisation'
  | 'desinfection'
  | 'distribution_medicaments'
  | 'formation_personnel'
  | 'enquete_terrain'
  | 'autre'

export type InterventionStatut = 
  | 'planifiee'
  | 'en_cours'
  | 'terminee'
  | 'annulee'

export interface Intervention {
  id: number
  titre: string
  description: string
  type: TypeIntervention
  statut: InterventionStatut
  district_id: number
  district?: { id: number; nom: string }
  centre_sante_id?: number
  maladie_id?: number
  maladie?: { id: number; nom: string }
  alerte_id?: number
  date_planifiee: string
  date_debut?: string
  date_fin?: string
  chef_equipe?: string
  membres_equipe?: string
  population_cible?: number
  population_atteinte?: number
  budget_alloue?: number
  ressources_utilisees?: string
  resultats?: string
  efficacite_score?: number
  recommandation_ia?: string
  generee_par_ia: boolean
  created_by: number
  created_at: string
  updated_at?: string
}

export interface InterventionCreate {
  titre: string
  description: string
  type: TypeIntervention
  district_id: number
  centre_sante_id?: number
  maladie_id?: number
  alerte_id?: number
  date_planifiee: string
  chef_equipe?: string
  population_cible?: number
  budget_alloue?: number
  ressources_utilisees?: string
}

export interface InterventionUpdate extends Partial<InterventionCreate> {
  statut?: InterventionStatut
  date_debut?: string
  date_fin?: string
  population_atteinte?: number
  resultats?: string
  efficacite_score?: number
}

export interface InterventionFilters {
  district_id?: number
  maladie_id?: number
  statut?: InterventionStatut
}

export interface AIRecommendationRequest {
  maladie_id: number
  district_id: number
  alerte_id?: number
}

export interface AIRecommendation {
  titre: string
  description: string
  type: TypeIntervention
  priorite: 1 | 2 | 3
  justification: string
  population_cible: number
  budget_estime: number
  duree_jours: number
  ressources: string[]
  indicateurs_succes: string[]
}

export interface AIRecommendationResponse {
  success: boolean
  data: {
    interventions: AIRecommendation[]
    analyse_globale: string
    risques_identifies: string[]
    recommandations_generales: string
  }
  model?: string
  tokens?: number
  error?: string
}
