/**
 * 📄 Fichier: src/api/services/referentiels.service.ts
 * 📝 Description: Service pour les référentiels
 * 🎯 Usage: Récupérer maladies, centres, districts
 */

import axiosInstance from '../axios.config'
import type { Maladie, CentreSante, District } from '@/types/cas.types'

// ========================================
// 📋 SERVICE RÉFÉRENTIELS
// ========================================

export const referentielsService = {
  // ========================================
  // 🦠 MALADIES
  // ========================================
  
  /**
   * Récupérer toutes les maladies
   * @param includeInactive - Inclure les maladies désactivées
   */
  getMaladies: async (includeInactive = false): Promise<Maladie[]> => {
    const response = await axiosInstance.get('/maladies', {
      params: { active_only: !includeInactive }
    })
    return response.data
  },

  /**
   * Récupérer une maladie par ID
   */
  getMaladieById: async (id: number): Promise<Maladie> => {
    const response = await axiosInstance.get(`/maladies/${id}`)
    return response.data
  },

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
   * Supprimer une maladie (soft delete si cas associés)
   */
  deleteMaladie: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`/maladies/${id}`)
    return response.data
  },

  /**
   * Réactiver une maladie désactivée
   */
  reactivateMaladie: async (id: number): Promise<any> => {
    const response = await axiosInstance.post(`/maladies/${id}/reactivate`)
    return response.data
  },

  // ========================================
  // 🗺️ DISTRICTS
  // ========================================
  
  /**
   * Récupérer tous les districts
   * @param includeInactive - Inclure les districts désactivés
   */
  getDistricts: async (includeInactive = false): Promise<District[]> => {
    const response = await axiosInstance.get('/districts', {
      params: { active_only: !includeInactive }
    })
    return response.data
  },

  /**
   * Récupérer un district par ID
   */
  getDistrictById: async (id: number): Promise<District> => {
    const response = await axiosInstance.get(`/districts/${id}`)
    return response.data
  },

  /**
   * Créer un nouveau district
   */
  createDistrict: async (data: Partial<District>): Promise<District> => {
    const response = await axiosInstance.post('/districts', data)
    return response.data
  },

  /**
   * Modifier un district
   */
  updateDistrict: async (id: number, data: Partial<District>): Promise<District> => {
    const response = await axiosInstance.put(`/districts/${id}`, data)
    return response.data
  },

  /**
   * Supprimer un district (soft delete si dépendances)
   */
  deleteDistrict: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`/districts/${id}`)
    return response.data
  },

  /**
   * Réactiver un district désactivé
   */
  reactivateDistrict: async (id: number): Promise<any> => {
    const response = await axiosInstance.post(`/districts/${id}/reactivate`)
    return response.data
  },

  // ========================================
  // 🏥 CENTRES DE SANTÉ
  // ========================================
  
  /**
   * Récupérer les centres de santé
   * @param includeInactive - Inclure les centres désactivés
   * @param district_id - Filtrer par district (optionnel)
   */
  getCentresSante: async (includeInactive = false, district_id?: number): Promise<CentreSante[]> => {
    const params: any = { active_only: !includeInactive }
    if (district_id) {
      params.district_id = district_id
    }
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

  /**
   * Récupérer les centres d'un district spécifique
   */
  getCentresSanteByDistrict: async (districtId: number): Promise<CentreSante[]> => {
    const response = await axiosInstance.get(`/centres-sante/district/${districtId}`)
    return response.data
  },

  /**
   * Créer un nouveau centre de santé
   */
  createCentreSante: async (data: Partial<CentreSante>): Promise<CentreSante> => {
    const response = await axiosInstance.post('/centres-sante', data)
    return response.data
  },

  /**
   * Modifier un centre de santé
   */
  updateCentreSante: async (id: number, data: Partial<CentreSante>): Promise<CentreSante> => {
    const response = await axiosInstance.put(`/centres-sante/${id}`, data)
    return response.data
  },

  /**
   * Supprimer un centre de santé (soft delete si dépendances)
   */
  deleteCentreSante: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`/centres-sante/${id}`)
    return response.data
  },

  /**
   * Réactiver un centre de santé désactivé
   */
  reactivateCentreSante: async (id: number): Promise<any> => {
    const response = await axiosInstance.post(`/centres-sante/${id}/reactivate`)
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
}
