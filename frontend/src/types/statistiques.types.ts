/**
 * 📄 Fichier: src/types/statistiques.types.ts
 * 📝 Description: Types liés aux statistiques et analyses
 * 🎯 Usage: Typage des données statistiques, graphiques, tendances
 */

// ========================================
// 📈 TYPES STATISTIQUES
// ========================================

/**
 * Tendance temporelle
 */
export interface TendanceData {
  periode: string // Date ou période (semaine, mois)
  nombre_cas: number
  nombre_deces?: number
  taux_letalite?: number
}

/**
 * Taux d'incidence par zone
 */
export interface TauxIncidence {
  zone_id: number
  zone_nom: string
  population: number
  nombre_cas: number
  taux_incidence: number // Pour 100 000 habitants
}

/**
 * Distribution par tranche d'âge
 */
export interface DistributionAge {
  tranche_age: string // Ex: '0-5', '6-15', '16-30', etc.
  nombre_cas: number
  pourcentage: number
}

/**
 * Distribution par sexe
 */
export interface DistributionSexe {
  sexe: 'M' | 'F'
  nombre_cas: number
  pourcentage: number
}

/**
 * Prédiction (modèle simple)
 */
export interface PredictionData {
  periode_future: string
  cas_predits: number
  intervalle_confiance_min: number
  intervalle_confiance_max: number
  confiance: number // 0-1
}

/**
 * Corrélation entre variables
 */
export interface CorrelationData {
  variable_x: string
  variable_y: string
  coefficient: number // -1 à 1
  p_value: number
}
