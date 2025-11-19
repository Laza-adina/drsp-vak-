// src/api/services/alertes.service.ts
import axiosInstance from '../axios.config'
import type { Alerte, AlerteCreateInput, AlerteUpdateInput, AlerteFilters } from '@/types/alertes.types'

export const alertesService = {
  /**
   * Récupérer toutes les alertes avec filtres
   */
  getAll: async (filters?: AlerteFilters): Promise<Alerte[]> => {
    const response = await axiosInstance.get('/alertes', { params: filters })
    return response.data
  },

  /**
   * Récupérer une alerte par ID
   */
  getById: async (id: number): Promise<Alerte> => {
    const response = await axiosInstance.get(`/alertes/${id}`)
    return response.data
  },

  /**
   * Créer une alerte manuelle
   */
  create: async (data: AlerteCreateInput): Promise<Alerte> => {
    const response = await axiosInstance.post('/alertes', data)
    return response.data
  },

  /**
   * Mettre à jour une alerte
   */
  update: async (id: number, data: AlerteUpdateInput): Promise<Alerte> => {
    const response = await axiosInstance.put(`/alertes/${id}`, data)
    return response.data
  },

  /**
   * Marquer une alerte comme résolue
   */
  resolve: async (id: number, actions: string): Promise<Alerte> => {
    const response = await axiosInstance.post(`/alertes/${id}/resolve`, { actions })
    return response.data
  },

  /**
   * Supprimer une alerte
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/alertes/${id}`)
  },

  /**
   * Obtenir le nombre d'alertes actives
   */
  countActive: async (): Promise<number> => {
    const response = await axiosInstance.get('/alertes/count/active')
    return response.data.count
  },

  /**
   * Vérifier et générer des alertes automatiques
   */
  checkThresholds: async (): Promise<Alerte[]> => {
    const response = await axiosInstance.post('/alertes/check-thresholds')
    return response.data
  },

  /**
   * 🤖 Suggérer une action IA pour une alerte
   */
  suggererActionIA: async (alerteId: number): Promise<{ success: boolean; action_suggeree: string; alerte_id: number }> => {
    const response = await axiosInstance.post(`/alertes/${alerteId}/suggerer-action-ia`)
    return response.data
  },
}
