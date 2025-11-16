// /frontend/src/types/cas.types.ts

/**
 * 📄 Fichier: src/types/cas.types.ts
 * 📝 Description: Types pour la gestion des cas
 */

// ========================================
// 🗺️ DISTRICT
// ========================================

export interface District {
  id: number
  nom: string
  code: string
  population?: number
  latitude?: number
  longitude?: number
  description?: string  
}

// ========================================
// 🦠 MALADIE
// ========================================

export interface Maladie {
  id: number
  nom: string
  code: string
  seuil_alerte: number
  seuil_epidemie: number
  description?: string
}

// ========================================
// 🏥 CENTRE DE SANTÉ
// ========================================

export interface CentreSante {
  id: number
  nom: string
  type: string
  district_id: number
  latitude?: number
  longitude?: number
}

// ========================================
// 📋 CAS
// ========================================

export interface Cas {
  id: number
  numero_cas: string
  maladie_id: number
  maladie?: Maladie
  centre_sante_id: number
  centre_sante?: CentreSante
  district_id: number
  district?: District
  date_symptomes: string
  date_declaration: string
  age?: number
  sexe?: string
  statut: string
  latitude?: number
  longitude?: number
  observations?: string
  created_by: number
  created_at?: string
  updated_at?: string
}

// ========================================
// 📝 CREATE INPUT
// ========================================

export interface CasCreateInput {
  numero_cas: string
  maladie_id: number
  centre_sante_id: number
  district_id: number
  date_symptomes: string
  date_declaration: string
  age?: number
  sexe?: string
  statut: string
  latitude?: number
  longitude?: number
  observations?: string
}

// ========================================
// 🔍 FILTRES
// ========================================

export interface CasFilters {
  maladie_id?: number
  district_id?: number
  statut?: string
  date_debut?: string
  date_symptomes_debut?: string 
  date_symptomes_fin?: string 
  date_fin?: string
}
