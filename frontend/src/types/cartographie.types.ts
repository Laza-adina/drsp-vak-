/**
 * 📄 Fichier: src/types/cartographie.types.ts
 * 📝 Description: Types liés à la cartographie
 * 🎯 Usage: Typage des marqueurs, couches, zones géographiques
 */

// ========================================
// 🗺️ TYPES CARTOGRAPHIE
// ========================================

/**
 * Marqueur sur la carte (cas géolocalisé)
 */
export interface MapMarker {
  id: number
  latitude: number
  longitude: number
  patient_nom: string
  maladie_nom: string
  district_nom: string
  statut: string
  date_debut_symptomes: string
  cas_confirme: boolean
  cas_deces: boolean
}

/**
 * Zone géographique (district)
 */
export interface GeoZone {
  id: number
  nom: string
  type: 'district' | 'commune' | 'fokontany'
  population?: number
  centre_lat: number
  centre_lng: number
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  geometrie?: any // GeoJSON
}

/**
 * Données pour la carte de chaleur (heatmap)
 */
export interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number // Intensité (nombre de cas)
}

/**
 * Données pour le choropleth (carte thématique)
 */
export interface ChoroplethData {
  zone_id: number
  zone_nom: string
  valeur: number // Nombre de cas ou taux d'incidence
  couleur: string
}

/**
 * Cluster de cas
 */
export interface CasCluster {
  centre_lat: number
  centre_lng: number
  rayon_km: number
  nombre_cas: number
  maladie_principale: string
  date_debut: string
  date_fin: string
}
