/**
 * 📄 Fichier: src/api/services/interventions.service.ts
 * 📝 Description: Service de gestion des interventions
 * 🎯 Usage: CRUD interventions sanitaires
 */

import axiosInstance from '../axios.config'
import { INTERVENTIONS_ENDPOINTS } from '../endpoints'
import type { Intervention, CreateInterventionData, InterventionRapport } from '@/types/interventions.types'

// ========================================
// 💼 SERVICE INTERVENTIONS
// ========================================

export const interventionsService = {
  /**
   * 📋 Récupérer toutes les interventions
   * @param statut - Filtrer par statut (optionnel)
   * @returns Liste des interventions
   */
  getAll: async (statut?: string): Promise<Intervention[]> => {
    const response = await axiosInstance.get(INTERVENTIONS_ENDPOINTS.LIST, {
      params: { statut },
    })
    return response.data
  },

  /**
   * 🔍 Récupérer une intervention par ID
   * @param id - ID de l'intervention
   * @returns Détails de l'intervention
   */
  getById: async (id: number): Promise<Intervention> => {
    const response = await axiosInstance.get(INTERVENTIONS_ENDPOINTS.GET(id))
    return response.data
  },

  /**
   * ➕ Créer une nouvelle intervention
   * @param data - Données de l'intervention
   * @returns Intervention créée
   */
  create: async (data: CreateInterventionData): Promise<Intervention> => {
    const response = await axiosInstance.post(INTERVENTIONS_ENDPOINTS.CREATE, data)
    return response.data
  },

  /**
   * ✏️ Mettre à jour une intervention
   * @param id - ID de l'intervention
   * @param data - Données à mettre à jour
   * @returns Intervention mise à jour
   */
  update: async (id: number, data: Partial<CreateInterventionData>): Promise<Intervention> => {
    const response = await axiosInstance.put(INTERVENTIONS_ENDPOINTS.UPDATE(id), data)
    return response.data
  },

  /**
   * 🗑️ Supprimer une intervention
   * @param id - ID de l'intervention
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(INTERVENTIONS_ENDPOINTS.DELETE(id))
  },

  /**
   * 📊 Soumettre un rapport d'intervention
   * @param id - ID de l'intervention
   * @param rapport - Données du rapport
   * @returns Rapport enregistré
   */
  submitRapport: async (id: number, rapport: InterventionRapport): Promise<InterventionRapport> => {
    const response = await axiosInstance.post(INTERVENTIONS_ENDPOINTS.RAPPORT(id), rapport)
    return response.data
  },
}
