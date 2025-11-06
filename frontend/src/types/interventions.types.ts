/**
 * 📄 Fichier: src/types/interventions.types.ts
 * 📝 Description: Types liés aux interventions sanitaires
 * 🎯 Usage: Typage des interventions, campagnes, actions terrain
 */

// ========================================
// 💼 TYPES INTERVENTIONS
// ========================================

/**
 * Types d'interventions
 */
export type TypeIntervention =
  | 'Vaccination'
  | 'Sensibilisation'
  | 'Distribution de médicaments'
  | 'Désinfection'
  | 'Formation'
  | 'Autre'

/**
 * Statuts d'intervention
 */
export type InterventionStatut = 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée'

/**
 * Structure d'une intervention
 */
export interface Intervention {
  id: number
  district_id: number
  district_nom: string
  type_intervention: TypeIntervention
  description: string
  date_debut: string
  date_fin_prevue: string
  date_fin_reelle?: string
  statut: InterventionStatut
  responsable: string
  nombre_personnes_ciblees?: number
  nombre_personnes_atteintes?: number
  budget_prevu?: number
  budget_utilise?: number
  resultats?: string
  date_creation: string
  utilisateur_id: number
}

/**
 * Données pour créer une intervention
 */
export interface CreateInterventionData {
  district_id: number
  type_intervention: TypeIntervention
  description: string
  date_debut: string
  date_fin_prevue: string
  responsable: string
  nombre_personnes_ciblees?: number
  budget_prevu?: number
}

/**
 * Rapport d'intervention
 */
export interface InterventionRapport {
  intervention_id: number
  date_rapport: string
  personnes_atteintes: number
  budget_utilise: number
  observations: string
  photos?: string[]
}
