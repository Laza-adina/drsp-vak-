/**
 * 📄 Fichier: src/api/services/referentiels.service.ts
 * 📝 Description: Service pour les référentiels
 * 🎯 Usage: Récupérer maladies, centres, districts
 */

import axiosInstance from '../api/axios.config'
import type { Maladie, CentreSante } from '@/types/cas.types'

export const referentielsService = {
  // Maladies
  getMaladies: async (): Promise<Maladie[]> => {
    const response = await axiosInstance.get('/maladies')
    return response.data
  },

  // Centres de santé
  getCentresSante: async (district_id?: string): Promise<CentreSante[]> => {
    const params = district_id ? { district_id } : {}
    const response = await axiosInstance.get('/centres-sante', { params })
    return response.data
  },

  // Enums
  getStatutsCas: () => ['suspect', 'probable', 'confirme', 'gueri', 'decede'],
  getNiveauxAlertes: () => ['info', 'avertissement', 'alerte', 'critique'],
  getTypesInterventions: () => ['investigation', 'vaccination', 'desinfection', 'sensibilisation', 'traitement', 'quarantaine'],
  
  // Sexe
  getOptionsSexe: () => [
    { value: 'masculin', label: 'Masculin' },
    { value: 'feminin', label: 'Féminin' },
    { value: 'autre', label: 'Autre' }
  ],
}
// ========================================
// 🗺️ DISTRICTS DE VAKINANKARATRA
// ========================================

export enum DistrictName {
    Ambatolampy = "ambatolampy",
    Antanifotsy = "antanifotsy",
    AntsirabI = "antsirabe_i",
    AntsirabII = "antsirabe_ii",
    Betafo = "betafo",
    Faratsiho = "faratsiho",
    Mandoto = "mandoto"
  }
  
  export const DistrictLabels: Record<string, string> = {
    "ambatolampy": "Ambatolampy",
    "antanifotsy": "Antanifotsy",
    "antsirabe_i": "Antsirabe I",
    "antsirabe_ii": "Antsirabe II",
    "betafo": "Betafo",
    "faratsiho": "Faratsiho",
    "mandoto": "Mandoto"
  }
  
  // ✅ EXPORTER CECI
  export const DISTRICTS_LIST = Object.entries(DistrictLabels).map(([value, label]) => ({
    value,
    label
  }))
  
  // ========================================
  // 📊 STATUTS CAS
  // ========================================
  
  export enum CasStatut {
    Suspect = "suspect",
    Probable = "probable",
    Confirme = "confirme",
    Gueri = "gueri",
    Decede = "decede"
  }
  
  export const CasStatutLabels: Record<string, string> = {
    "suspect": "🟡 Suspect",
    "probable": "🟠 Probable",
    "confirme": "🔴 Confirmé",
    "gueri": "🟢 Guéri",
    "decede": "⚫ Décédé"
  }
  