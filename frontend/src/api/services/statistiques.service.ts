/**
 * 📄 Fichier: src/api/services/statistiques.service.ts
 * 📝 Description: Service de statistiques
 * 🎯 Usage: Analyses statistiques et prédictions
 */

import axiosInstance from '../axios.config'
import type {
  TendanceData,
  TauxIncidence,
  DistributionAge,
  DistributionSexe,
} from '@/types/statistiques.types'

// ========================================
// 📈 SERVICE STATISTIQUES
// ========================================

export const statistiquesService = {
  /**
   * 📉 Récupérer l'analyse de tendance
   */
  getTendance: async (maladieId?: number, periode: string = '30j'): Promise<TendanceData[]> => {
    const response = await axiosInstance.get('/statistiques/tendance', {  // ✅ OK
      params: { maladie_id: maladieId, periode },
    })
    return response.data
  },

  /**
   * 📊 Récupérer les taux d'incidence par district
   */
  getTauxIncidence: async (maladieId?: number): Promise<TauxIncidence[]> => {
    const response = await axiosInstance.get('/statistiques/taux-incidence', {  // ✅ OK
      params: { maladie_id: maladieId },
    })
    return response.data
  },

  /**
   * 💀 Récupérer le taux de létalité
   */
  getTauxLetalite: async (maladieId?: number): Promise<any> => {
    const response = await axiosInstance.get('/statistiques/taux-letalite', {  // ✅ Nouveau
      params: { maladie_id: maladieId },
    })
    return response.data
  },

  /**
   * 🎯 Récupérer le taux d'attaque
   */
  getTauxAttaque: async (districtId?: number): Promise<any> => {
    const response = await axiosInstance.get('/statistiques/taux-attaque', {  // ✅ Nouveau
      params: { district_id: districtId },
    })
    return response.data
  },

  /**
   * 👶 Récupérer la distribution par tranche d'âge
   */
  getDistributionAge: async (maladieId?: number): Promise<DistributionAge[]> => {
    const response = await axiosInstance.get('/statistiques/distribution-age', {  // ✅ OK
      params: { maladie_id: maladieId },
    })
    return response.data
  },

  /**
   * 📋 Récupérer le résumé hebdomadaire
   */
  getResumeHebdomadaire: async (): Promise<any> => {
    const response = await axiosInstance.get('/statistiques/resume-hebdomadaire')  // ✅ Nouveau
    return response.data
  },

  /**
   * ⚧ Distribution par sexe (si disponible dans le backend)
   */
  getDistributionSexe: async (maladieId?: number): Promise<DistributionSexe[]> => {
    // Note: Cet endpoint n'existe pas dans votre backend
    // Vous devrez soit l'ajouter, soit utiliser les données des cas
    return []
  },
}
