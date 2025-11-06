/**
 * 📄 Fichier: src/types/alertes.types.ts
 * 📝 Description: Types liés aux alertes épidémiologiques
 * 🎯 Usage: Typage des alertes, notifications, seuils
 */

// ========================================
// 🚨 TYPES ALERTES
// ========================================

/**
 * Types d'alertes
 */
export type AlerteType = 'Épidémie' | 'Cluster' | 'Augmentation inhabituelle' | 'Décès multiple'

/**
 * Niveaux de gravité
 */
export type NiveauGravite = 'Faible' | 'Modéré' | 'Élevé' | 'Critique'

/**
 * Statuts d'alerte
 */
export type AlerteStatut = 'Active' | 'Résolue' | 'En investigation' | 'Archivée'

/**
 * Structure d'une alerte
 */
export interface Alerte {
  id: number
  maladie_id: number
  maladie_nom: string
  district_id: number
  district_nom: string
  type_alerte: AlerteType
  niveau_gravite: NiveauGravite
  nombre_cas: number
  date_detection: string
  date_resolution?: string
  statut: AlerteStatut
  description: string
  actions_recommandees?: string
  responsable?: string
  date_creation: string
  utilisateur_id: number
}

/**
 * Données pour créer une alerte
 */
export interface CreateAlerteData {
  maladie_id: number
  district_id: number
  type_alerte: AlerteType
  niveau_gravite: NiveauGravite
  nombre_cas: number
  date_detection: string
  description: string
  actions_recommandees?: string
  responsable?: string
}

/**
 * Seuil d'alerte pour une maladie
 */
export interface SeuilAlerte {
  maladie_id: number
  seuil_cas: number
  periode_jours: number
  niveau_gravite: NiveauGravite
}
