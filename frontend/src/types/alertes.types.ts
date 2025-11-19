export type NiveauAlerte = 'info' | 'avertissement' | 'alerte' | 'critique'
export type StatutAlerte = 'active' | 'en_cours' | 'resolue' | 'fausse_alerte'

export interface Alerte {
  id: number
  type_alerte: string
  niveau_gravite: NiveauAlerte
  maladie_id: number
  maladie?: {
    id: number
    nom: string
  }
  district_id: number
  district?: {
    id: number
    nom: string
  }
  nombre_cas: number
  seuil_declenche: number
  date_detection: string
  date_resolution?: string
  statut: StatutAlerte
  description: string
  actions_recommandees?: string
  responsable?: string
  interventions_liees?: number[]
  created_by: number
  created_at: string
  updated_at?: string
}

export interface AlerteCreateInput {
  type_alerte: string
  niveau_gravite: NiveauAlerte
  maladie_id: number
  district_id: number
  nombre_cas: number
  date_detection: string
  description: string
  actions_recommandees?: string
  responsable?: string
}

export interface AlerteUpdateInput {
  statut?: StatutAlerte
  actions_recommandees?: string
  responsable?: string
  date_resolution?: string
}

export interface AlerteFilters {
  statut?: StatutAlerte
  niveau_gravite?: NiveauAlerte
  maladie_id?: number
  district_id?: number
  date_debut?: string
  date_fin?: string
}
