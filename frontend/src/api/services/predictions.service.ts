// src/api/services/predictions.service.ts
import axiosInstance from '../axios.config'

export interface PredictionRequest {
  maladie_id: number
  district_id?: number
  horizon_jours: 7 | 14 | 30
  jours_historique?: number
}

export interface PredictionResponse {
  success: boolean
  historique: Array<{
    date: string
    cas_reels: number
    cas_predits: number
    intervalle_min: number
    intervalle_max: number
  }>
  predictions: Array<{
    date: string
    cas_predits: number
    intervalle_min: number
    intervalle_max: number
    confiance: number
  }>
  metriques: {
    mae: number
    rmse: number
    mape: number
    tendance: 'hausse' | 'baisse' | 'stable'
    confiance_score: number
    jours_historique: number
    horizon_jours: number
  }
  modele: string
  error?: string
}

export const predictionsService = {
  /**
   * 🤖 Génère des prédictions avec Prophet
   */
  generer: async (data: PredictionRequest): Promise<PredictionResponse> => {
    const response = await axiosInstance.post('/predictions/generer', data)
    return response.data
  },

  /**
   * Récupère l'historique des prédictions
   */
  getHistorique: async (maladieId: number, districtId?: number): Promise<any[]> => {
    const params = new URLSearchParams()
    params.append('maladie_id', maladieId.toString())
    if (districtId) params.append('district_id', districtId.toString())
    
    const response = await axiosInstance.get(`/predictions/historique?${params.toString()}`)
    return response.data
  },
}
