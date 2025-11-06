/**
 * 📄 Fichier: src/types/cas.types.ts
 * 📝 Description: Types liés aux cas de maladies
 * 🎯 Usage: Typage des données de cas, filtres, formulaires
 */

// ========================================
// 🏥 TYPES CAS
// ========================================

/**
 * Statuts possibles d'un cas
 */
export type CasStatut = 'Suspect' | 'Confirmé' | 'Écarté' | 'En cours'

/**
 * Sexe du patient
 */
export type PatientSexe = 'M' | 'F'

/**
 * Structure complète d'un cas
 */
export interface Cas {
  id: number
  maladie_id: number
  maladie_nom: string
  district_id: number
  district_nom: string
  centre_sante_id: number
  centre_sante_nom: string
  patient_nom: string
  patient_age: number
  patient_sexe: PatientSexe
  date_debut_symptomes: string
  date_notification: string
  statut: CasStatut
  cas_confirme: boolean
  cas_deces: boolean
  latitude?: number
  longitude?: number
  commentaire?: string
  date_creation: string
  date_modification?: string
  utilisateur_id: number
  utilisateur_nom?: string
}

/**
 * Données pour créer un cas
 */
export interface CreateCasData {
  maladie_id: number
  district_id: number
  centre_sante_id: number
  patient_nom: string
  patient_age: number
  patient_sexe: PatientSexe
  date_debut_symptomes: string
  date_notification: string
  statut: CasStatut
  cas_confirme: boolean
  cas_deces: boolean
  latitude?: number
  longitude?: number
  commentaire?: string
}

/**
 * Données pour mettre à jour un cas
 */
export interface UpdateCasData extends Partial<CreateCasData> {}

/**
 * Filtres pour la liste des cas
 */
export interface CasFilters {
  maladie_id?: number
  district_id?: number
  centre_sante_id?: number
  statut?: CasStatut
  date_debut?: string // Date de début de période
  date_fin?: string // Date de fin de période
  cas_confirme?: boolean
  cas_deces?: boolean
  search?: string // Recherche texte (nom patient, commentaire)
}

/**
 * Statistiques d'un cas (pour tableau de bord)
 */
export interface CasStats {
  total: number
  suspects: number
  confirmes: number
  ecartes: number
  en_cours: number
  deces: number
}
