// src/api/services/interventions.service.ts
import api from '../axios.config'
import type { 
  Intervention, 
  InterventionCreate, 
  InterventionUpdate,
  InterventionFilters,
  AIRecommendationRequest,
  AIRecommendationResponse 
} from '@/types/interventions.types'

export const interventionsService = {
  // CRUD classique
  getAll: async (filters?: InterventionFilters): Promise<Intervention[]> => {
    const params = new URLSearchParams()
    if (filters?.district_id) params.append('district_id', filters.district_id.toString())
    if (filters?.maladie_id) params.append('maladie_id', filters.maladie_id.toString())
    if (filters?.statut) params.append('statut', filters.statut)
    
    const response = await api.get(`/interventions?${params.toString()}`)
    return response.data
  },

  getById: async (id: number): Promise<Intervention> => {
    const response = await api.get(`/interventions/${id}`)
    return response.data
  },

  create: async (data: InterventionCreate): Promise<Intervention> => {
    const response = await api.post('/interventions', data)
    return response.data
  },

  update: async (id: number, data: InterventionUpdate): Promise<Intervention> => {
    const response = await api.put(`/interventions/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/interventions/${id}`)
  },

  // 🤖 ENDPOINTS IA
  genererRecommandationsIA: async (data: AIRecommendationRequest): Promise<AIRecommendationResponse> => {
    const response = await api.post('/interventions/generer-recommandations-ia', data)
    return response.data
  },

  creerDepuisIA: async (data: {
    recommandation: any
    maladie_id: number
    district_id: number
    alerte_id?: number
  }): Promise<Intervention> => {
    const response = await api.post('/interventions/creer-depuis-ia', data)
    return response.data
  },
}
