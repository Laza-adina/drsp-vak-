/**
 * 📄 Fichier: src/api/services/referentiels.service.ts
 * 📝 Description: Service pour les référentiels
 * 🎯 Usage: Récupérer maladies, centres, districts
 */

import axiosInstance from '../axios.config'
import type { Maladie, CentreSante, District } from '@/types/cas.types'  // ✅ Importer District

// ========================================
// 📋 SERVICE RÉFÉRENTIELS
// ========================================

export const referentielsService = {
  // ========================================
  // 🦠 MALADIES
  // ========================================
  
  /**
   * Récupérer toutes les maladies
   */
  getMaladies: async (): Promise<Maladie[]> => {
    const response = await axiosInstance.get('/maladies')
    return response.data
  },

  /**
   * Récupérer une maladie par ID
   */
  getMaladieById: async (id: number): Promise<Maladie> => {
    const response = await axiosInstance.get(`/maladies/${id}`)
    return response.data
  },

  // ========================================
  // 🗺️ DISTRICTS
  // ========================================
  
  /**
   * Récupérer tous les districts
   */
  getDistricts: async (): Promise<District[]> => {
    const response = await axiosInstance.get('/districts')
    return response.data
  },

  /**
   * Récupérer un district par ID
   */
  getDistrictById: async (id: number): Promise<District> => {
    const response = await axiosInstance.get(`/districts/${id}`)
    return response.data
  },

  // ========================================
  // 🏥 CENTRES DE SANTÉ
  // ========================================
  
  /**
   * Récupérer les centres de santé (optionnellement filtrés par district)
   * @param district_id - ID du district (optionnel)
   */
  getCentresSante: async (district_id?: number): Promise<CentreSante[]> => {
    const params = district_id ? { district_id } : {}
    const response = await axiosInstance.get('/centres-sante', { params })
    return response.data
  },

  /**
   * Récupérer un centre de santé par ID
   */
  getCentreSanteById: async (id: number): Promise<CentreSante> => {
    const response = await axiosInstance.get(`/centres-sante/${id}`)
    return response.data
  },

  // ========================================
  // 📋 LISTES D'ÉNUMÉRATIONS
  // ========================================
  
  /**
   * Statuts de cas possibles
   */
  getStatutsCas: (): string[] => {
    return ['suspect', 'probable', 'confirme', 'gueri', 'decede']
  },

  /**
   * Niveaux d'alerte possibles
   */
  getNiveauxAlertes: (): string[] => {
    return ['info', 'avertissement', 'alerte', 'critique']
  },

  /**
   * Types d'interventions possibles
   */
  getTypesInterventions: (): string[] => {
    return ['investigation', 'vaccination', 'desinfection', 'sensibilisation', 'traitement', 'quarantaine']
  },

  /**
   * Statuts d'interventions possibles
   */
  getInterventionStatuts: (): string[] => {
    return ['planifiee', 'en_cours', 'terminee', 'annulee']
  },

  /**
   * Statuts d'alertes possibles
   */
  getAlertesStatuts: (): string[] => {
    return ['active', 'en_cours', 'resolue', 'fausse_alerte']
  },

  // ========================================
  // 👤 OPTIONS SEXE
  // ========================================
  
  /**
   * Options de sexe pour les formulaires
   */
  getOptionsSexe: () => [
    { value: 'masculin', label: 'Masculin' },
    { value: 'feminin', label: 'Féminin' },
    { value: 'autre', label: 'Autre' }
  ],

  // ========================================
  // 🏥 TYPES CENTRES DE SANTÉ
  // ========================================
  
  /**
   * Types de centres de santé possibles
   */
  getTypesCentresSante: () => [
    { value: 'csb1', label: 'CSB I' },
    { value: 'csb2', label: 'CSB II' },
    { value: 'chd', label: 'CHD' },
    { value: 'chu', label: 'CHU' },
    { value: 'hopital', label: 'Hôpital' }
  ],

  // CRUD Districts
createDistrict: async (data: Partial<District>): Promise<District> => {
  const response = await axiosInstance.post('/districts', data)
  return response.data
},

updateDistrict: async (id: number, data: Partial<District>): Promise<District> => {
  const response = await axiosInstance.put(`/districts/${id}`, data)
  return response.data
},

deleteDistrict: async (id: number): Promise<void> => {
  await axiosInstance.delete(`/districts/${id}`)
},


// ========================================
  // 🦠 CRUD MALADIES
  // ========================================
  
  /**
   * Créer une nouvelle maladie
   */
  createMaladie: async (data: Partial<Maladie>): Promise<Maladie> => {
    const response = await axiosInstance.post('/maladies', data)
    return response.data
  },

  /**
   * Modifier une maladie
   */
  updateMaladie: async (id: number, data: Partial<Maladie>): Promise<Maladie> => {
    const response = await axiosInstance.put(`/maladies/${id}`, data)
    return response.data
  },

  /**
   * Supprimer une maladie
   */
  deleteMaladie: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/maladies/${id}`)
  },

  // CRUD Centres de Santé
createCentreSante: async (data: Partial<CentreSante>): Promise<CentreSante> => {
  const response = await axiosInstance.post('/centres-sante', data)
  return response.data
},

updateCentreSante: async (id: number, data: Partial<CentreSante>): Promise<CentreSante> => {
  const response = await axiosInstance.put(`/centres-sante/${id}`, data)
  return response.data
},

deleteCentreSante: async (id: number): Promise<void> => {
  await axiosInstance.delete(`/centres-sante/${id}`)
},
}
