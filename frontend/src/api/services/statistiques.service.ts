// src/api/services/statistiques.service.ts
import axiosInstance from '../axios.config'

export interface DashboardStats {
  total_cas: number
  cas_actifs: number
  cas_gueris: number
  cas_decedes: number
  taux_guerison: number
  taux_mortalite: number
  nouveaux_cas_7j: number
  evolution_7j: number
  cas_par_district: Array<{ district: string; count: number }>
  cas_par_statut: Array<{ statut: string; count: number }>
  evolution_temporelle: Array<{ date: string; count: number }>
}

export interface TendanceResponse {
  periode1_cas: number
  periode2_cas: number
  variation_pourcent: number
  tendance: 'croissante' | 'decroissante' | 'stable'
  date_debut: string
  date_milieu: string
  date_fin: string
}

export const statistiquesService = {
  /**
   * Dashboard complet
   */
  getDashboard: async (maladieId?: number): Promise<DashboardStats> => {
    const params = new URLSearchParams()
    if (maladieId) params.append('maladie_id', maladieId.toString())
    
    const response = await axiosInstance.get(`/statistiques/dashboard?${params.toString()}`)
    return response.data
  },

  /**
   * Analyse de tendance
   */
  getTendance: async (maladieId?: number, districtId?: number, jours: number = 14): Promise<TendanceResponse> => {
    const params = new URLSearchParams()
    if (maladieId) params.append('maladie_id', maladieId.toString())
    if (districtId) params.append('district_id', districtId.toString())
    params.append('jours', jours.toString())
    
    const response = await axiosInstance.get(`/statistiques/tendance?${params.toString()}`)
    return response.data
  },

  /**
   * Distribution par âge
   */
  getDistributionAge: async (maladieId?: number, districtId?: number): Promise<Array<{ tranche_age: string; nombre_cas: number }>> => {
    const params = new URLSearchParams()
    if (maladieId) params.append('maladie_id', maladieId.toString())
    if (districtId) params.append('district_id', districtId.toString())
    
    const response = await axiosInstance.get(`/statistiques/distribution-age?${params.toString()}`)
    return response.data
  },
}
