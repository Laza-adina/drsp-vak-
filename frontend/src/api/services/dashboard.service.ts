/**
 * 📄 Fichier: src/api/services/dashboard.service.ts
 * 📝 Description: Service du tableau de bord
 * 🎯 Usage: Récupération des statistiques et graphiques du dashboard
 */

import axiosInstance from '../axios.config'
import type { DashboardStats, EvolutionData, MaladieDistribution, TopDistrict } from '@/types/dashboard.types'

// ========================================
// 📊 SERVICE DASHBOARD
// ========================================

export const dashboardService = {
  /**
   * 📈 Récupérer les statistiques globales du dashboard
   * @returns Statistiques (total cas, décès, alertes actives)
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get('/dashboard/statistics')  // ✅ Changé
    return response.data
  },

  /**
   * 📉 Récupérer l'évolution temporelle des cas
   * @param periode - Période ('7j', '30j', '90j', '1an')
   * @returns Données d'évolution par jour/semaine/mois
   */
  getEvolution: async (periode: string = '30j'): Promise<EvolutionData[]> => {
    const response = await axiosInstance.get('/dashboard/evolution-temporelle', {  // ✅ Changé
      params: { periode },
    })
    return response.data
  },

  /**
   * 🏆 Récupérer le top 5 des districts par nombre de cas
   * @returns Liste des districts avec le plus de cas
   */
  getTopDistricts: async (): Promise<TopDistrict[]> => {
    const response = await axiosInstance.get('/dashboard/top-districts')  // ✅ OK
    return response.data
  },

  /**
   * 🦠 Récupérer la répartition des cas par maladie
   * @returns Distribution des cas par maladie avec pourcentages
   */
  getDistributionMaladies: async (): Promise<MaladieDistribution[]> => {
    const response = await axiosInstance.get('/dashboard/repartition-maladies')  // ✅ Changé
    return response.data
  },
}
